import * as t from "io-ts";
import { Email } from "./scalar";

export type User = {
  id: string;
  name: string;
  email: t.TypeOf<typeof Email>;
  cpf: string;
  password: string;
  status: boolean;
  createdAt: Date;
};

export type CreateUser = Omit<User, "createdAt" | "status"> & {
  currentUserId: User["id"];
};

export type UpdateUser = CreateUser;

export type SingIn = Pick<User, "email" | "password">;
