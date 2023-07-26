import { z } from "zod";

const permissionValidator = z.nativeEnum({
  READ: "read",
  WRITE: "write",
  DELETE: "delete",
} as const);

const resourceNameValidator = z.nativeEnum({
  USER: "user",
  RULE: "rule",
  ANIMAL: "animal",
  SPECIES: "species",
  MEDICAL_SPECIALTY: "medicalSpecialty",
  SURGICAL_PROCEDURE: "surgicalProcedure",
  LAB_EXAM: "labExam",
  IMAGE_EXAM: "imageExam",
  NECROPSY: "necropsy",
  CONSULTATION: "consultation",
  SURGERY: "surgery",
  LAB_EXAM_RESULT: "labExamResult",
  IMAGE_EXAM_RESULT: "imageExamResult",
} as const);

export const permission = permissionValidator.enum;
export const resourceName = resourceNameValidator.enum;

export const rule = z.object({
  id: z.number().nonnegative(),
  permission: permissionValidator,
  userId: z.string().nonempty(),
  resourceName: resourceNameValidator,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Rule = z.infer<typeof rule>;
export type Permission = z.infer<typeof permissionValidator>;
export type ResourceName = z.infer<typeof resourceNameValidator>;
