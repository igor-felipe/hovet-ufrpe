import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/lib/function";
import * as user from "./user";
import {
  RegisterInDbInput,
  RegisterInDbOutput,
  userStatus,
} from "@/core/user/validators";
import { expectShouldBeLeft, expectShouldBeRight } from "@/config/test-helpers";
import { prisma } from "../prisma";

const input: RegisterInDbInput = {
  email: "Keanu@gmail.co",
  cpf: "11144477734",
  name: "Keanu Charles Reeves",
  password: "Keanu123!",
  status: userStatus.ENABLED,
};
const output: RegisterInDbOutput = {
  email: "Keanu@gmail.co",
  cpf: "11144477734",
  name: "Keanu Charles Reeves",
  status: userStatus.ENABLED,
  id: expect.any(String),
  createdAt: expect.any(Date),
};

describe("Prisma User Repo", () => {
  const createMocks = () => ({
    createdUserMock: jest.fn(user.createUser),
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });
  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  it("should create user in db", () => {
    return pipe(
      input,
      user.createUser,
      expectShouldBeRight,
      TE.map((data) => expect(data).toEqual(output)),
    )();
  });

  it("should throw an error when creating a user that already exists", () => {
    const { createdUserMock } = createMocks();
    return pipe(
      input,
      createdUserMock,
      TE.chain(() => createdUserMock(input)),
      expectShouldBeLeft,
      TE.mapLeft((error) => {
        expect(createdUserMock).toHaveBeenCalledTimes(2);
        expect(error.details).toContain("already in use");
      }),
    )();
  });
});
