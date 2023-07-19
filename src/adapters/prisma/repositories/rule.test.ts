import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { expectShouldBeLeft, expectShouldBeRight } from "@/config/test-helpers";
import { prisma } from "../prisma";
import * as rule from "./rule";
import { permission } from "@/core/rule/validators/rule_validator";

const seed = async () => {
  const user = await prisma.user.create({
    data: {
      email: "",
      cpf: "",
      name: "",
      password: "",
      status: "",
      date: new Date(),
    },
  });
  const resource = await prisma.resource.create({
    data: {
      name: "",
    },
  });

  const input = {
    permission: permission.READ,
    resourceId: resource.id,
    userId: user.id,
  };

  const output = {
    id: expect.any(Number),
    ...input,
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  };

  return { user, resource, input, output };
};

const createMocks = () => ({
  createdRuleMock: jest.fn(rule.createInDb),
  getOneInDbMock: jest.fn(rule.getOneInDb),
  updateInDbMock: jest.fn(rule.updateInDb),
  deleteInDbMock: jest.fn(rule.deleteInDb),
});

describe("Prisma Rule Repo", () => {
  beforeEach(async () => {
    await prisma.rule.deleteMany();
    await prisma.resource.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should create rule in db", async () => {
    const { input, output } = await seed();
    const { createdRuleMock } = createMocks();
    return pipe(
      input,
      createdRuleMock,
      expectShouldBeRight,
      TE.map((data) => expect(data).toEqual(output)),
    )();
  });

  it("should throw an error when creating a rule that already exists", async () => {
    const { input } = await seed();
    const { createdRuleMock } = createMocks();
    return pipe(
      input,
      createdRuleMock,
      TE.chain(() => createdRuleMock(input)),
      expectShouldBeLeft,
      TE.mapLeft((error) => {
        expect(error.details).toContain("already exists");
      }),
    )();
  });

  it("should throw an error when not finding a rule", async () => {
    const { getOneInDbMock } = createMocks();

    return pipe(
      { id: 1 },
      getOneInDbMock,
      expectShouldBeLeft,
      TE.mapLeft((error) => {
        expect(error.details).toContain("No Rule found");
      }),
    )();
  });

  it("should throw an error on not finding a resource when trying to update it", async () => {
    const { updateInDbMock } = createMocks();

    return pipe(
      { id: 1, permission: permission.DELETE },
      updateInDbMock,
      expectShouldBeLeft,
      TE.mapLeft((error) => {
        expect(error.details).toContain("Record to update not found.");
      }),
    )();
  });

  it("should delete rule in db", async () => {
    const { input, output } = await seed();
    const { createdRuleMock, deleteInDbMock } = createMocks();
    return pipe(
      input,
      createdRuleMock,
      TE.chain((newUser) => deleteInDbMock({ id: newUser.id })),
      expectShouldBeRight,
      TE.map((data) => expect(data).toEqual(output)),
    )();
  });
  //
});
