import { Authentication } from "./Authentication";

export interface User {
  userId?: string;
  username?: string;
  password?: string;
  email?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  authentication?: Authentication;
  passwordRecoveryToken?: string;
  passwordRecoveryExpiresIn?: number;
  isActive?: boolean;
  emailValidationToken?: string;
  emailValidationExpiresIn?: number;
}
