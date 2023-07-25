import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/lib/function";
import * as user from "./user";
import {
  CreateInDbInput,
  CreateInDbOutput,
  userStatus,
} from "@/core/user/validators";
import { expectShouldBeLeft, expectShouldBeRight } from "@/config/test-helpers";
import { prisma } from "../prisma";

const createInDbInput: CreateInDbInput = {
  email: "email1",
  cpf: "cpf1",
  name: "name1",
  password: "password1",
  status: userStatus.ENABLED,
  date: new Date(),
  authId: "authId1",
};

const createInDbOutput: CreateInDbOutput = {
  cpf: "cpf1",
  email: "email1",
  name: "name1",
  status: userStatus.ENABLED,
  id: expect.any(String),
  date: expect.any(Date),
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
  authId: expect.any(String),
};
const createMocks = () => ({
  createInDbMock: jest.fn(user.createInDb),
  getOneInDbMock: jest.fn(user.getOneInDb),
  updateInDbMock: jest.fn(user.updateInDb),
  loginInDbMock: jest.fn(user.loginInDb),
  findManyInDbMock: jest.fn(user.findManyInDb),
});
describe("Prisma User Repo", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it("should create user in db", () => {
    return pipe(
      createInDbInput,
      user.createInDb,
      expectShouldBeRight,
      TE.map((data) => expect(data).toEqual(createInDbOutput)),
    )();
  });

  it("should throw an error when creating a user that already exists", () => {
    const { createInDbMock } = createMocks();
    return pipe(
      createInDbInput,
      createInDbMock,
      TE.chain(() => createInDbMock(createInDbInput)),
      expectShouldBeLeft,
      TE.mapLeft((error) => {
        expect(createInDbMock).toHaveBeenCalledTimes(2);
        expect(["cpf already in use", "email already in use"]).toContain(
          error.details,
        );
      }),
    )();
  });

  it("should throw a database validation error when creating a user with a wrong type cpf.", () => {
    const { createInDbMock } = createMocks();
    return pipe(
      { ...createInDbInput, cpf: 1 } as unknown as CreateInDbInput,
      createInDbMock,
      expectShouldBeLeft,
      TE.mapLeft((error) => {
        expect(error.details).toBe("data validation error in the database");
      }),
    )();
  });

  it("should throw an error when not finding a user", () => {
    const { getOneInDbMock } = createMocks();
    return pipe(
      { id: "1" },
      getOneInDbMock,
      expectShouldBeLeft,
      TE.mapLeft((error) => {
        expect(error.details).toBe("No User found");
      }),
    )();
  });

  it("should finding a user", () => {
    const { getOneInDbMock, createInDbMock } = createMocks();
    return pipe(
      createInDbInput,
      createInDbMock,
      TE.chain((newUser) => getOneInDbMock({ email: newUser.email })),
      expectShouldBeRight,
      TE.map((result) => {
        expect(result).toEqual(createInDbOutput);
        return result;
      }),
    )();
  });
  it("should finding a user to login", () => {
    const { loginInDbMock, createInDbMock } = createMocks();
    return pipe(
      createInDbInput,
      createInDbMock,
      TE.chain((newUser) => loginInDbMock({ email: newUser.email })),
      expectShouldBeRight,
      TE.map((result) => {
        expect(result).toEqual({
          rules: expect.any(Array),
          user: {
            id: createInDbOutput.id,
            status: createInDbOutput.status,
            password: expect.any(String),
          },
        });
        return result;
      }),
    )();
  });

  it("should throw an error on not finding a user when trying to update it", async () => {
    const { updateInDbMock } = createMocks();

    return pipe(
      { id: "1" },
      updateInDbMock,
      expectShouldBeLeft,
      TE.mapLeft((error) => {
        expect(error.details).toBe("Record to update not found.");
      }),
    )();
  });
  it("should update user status", async () => {
    const { updateInDbMock, createInDbMock } = createMocks();

    return pipe(
      createInDbInput,
      createInDbMock,
      TE.chain((newUser) =>
        updateInDbMock({ id: newUser.id, status: userStatus.DISABLED }),
      ),
      expectShouldBeRight,
      TE.map((data) =>
        expect(data).toEqual({
          ...createInDbOutput,
          status: userStatus.DISABLED,
        }),
      ),
    )();
  });
  it("should throw an error when trying to update a cpf with a value already in use", async () => {
    const { updateInDbMock, createInDbMock } = createMocks();

    return pipe(
      createInDbInput,
      createInDbMock,
      TE.chain(() =>
        createInDbMock({
          ...createInDbInput,
          cpf: "cpf2",
          email: "email2",
        }),
      ),
      TE.chain((newUser) => updateInDbMock({ id: newUser.id, cpf: "cpf1" })),
      expectShouldBeLeft,
      TE.mapLeft((error) => {
        expect(error.details).toBe("cpf already in use");
      }),
    )();
  });

  it("should find an array of users", () => {
    const { findManyInDbMock, createInDbMock } = createMocks();
    return pipe(
      createInDbInput,
      createInDbMock,
      TE.chain((newUser) => findManyInDbMock({ name: newUser.name })),
      expectShouldBeRight,
      TE.map((result) => {
        expect(result).toEqual([createInDbOutput]);
        return result;
      }),
    )();
  });

  //
});
