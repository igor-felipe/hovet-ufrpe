import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/lib/function";
import * as resource from "./resource";
import * as V from "@/core/resource/validators/resource_create_validator";
import { expectShouldBeLeft, expectShouldBeRight } from "@/config/test-helpers";
import { prisma } from "../prisma";

const input: V.CreateInDbInput = {
  name: "test",
};
const output: V.CreateInDbOutput = {
  name: "test",
  id: expect.any(Number),
};

describe("Prisma resource Repo", () => {
  const createMocks = () => ({
    createInDbMock: jest.fn(resource.createInDb),
    getOneInDbMock: jest.fn(resource.getOneInDb),
  });

  beforeEach(async () => {
    await prisma.resource.deleteMany();
  });
  beforeAll(async () => {
    await prisma.resource.deleteMany();
  });

  it("should create resource in db", () => {
    return pipe(
      input,
      resource.createInDb,
      expectShouldBeRight,
      TE.map((data) => expect(data).toEqual(output)),
    )();
  });

  it("should throw an error when creating a resource that already exists", () => {
    const { createInDbMock } = createMocks();
    return pipe(
      input,
      createInDbMock,
      TE.chain(() => createInDbMock(input)),
      expectShouldBeLeft,
      TE.mapLeft((error) => {
        expect(createInDbMock).toHaveBeenCalledTimes(2);
        expect(error.details).toContain("already in use");
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
        expect(error.details).toContain("No Resource found");
      }),
    )();
  });
});
