import { Authentication } from "./Authentication";

export interface User {
  username: string;
  password: string;
  email?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  authentication?: Authentication;
}
