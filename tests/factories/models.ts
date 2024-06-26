import { User } from "../../src/models/User";
import { Authentication } from "../../src/models/Authentication";

export const createAuthenticationMockedModel = (
  isActive: boolean = true
): Authentication => ({
  code: "any_code",
  codeExpiresIn: 1,
  token: "any_token",
  createdAt: "any_createdAt",
  updatedAt: "any_updatedAt",
  expiresIn: 1,
  isActive,
});

export const createOtherAuthenticationMockedModel = (
  isActive: boolean = true
): Authentication => ({
  code: "other_code",
  codeExpiresIn: 1,
  token: "other_token",
  createdAt: "other_createdAt",
  updatedAt: "other_updatedAt",
  expiresIn: 1,
  isActive,
});

export const createUserMockedModel = (isActive: boolean = true): User => ({
  userId: "any_userId",
  username: "any_username",
  password: "any_password",
  email: "any_email",
  image: "any_image",
  createdAt: "any_createdAt",
  updatedAt: "any_updatedAt",
  isActive,
  emailValidationExpiresIn: 1,
  emailValidationToken: "any_emailValidationToken",
  passwordRecoveryExpiresIn: 1,
  passwordRecoveryToken: "any_passwordRecoveryToken",
});

export const createOtherUserMockedModel = (): User => ({
  userId: "any_userId",
  username: "any_username",
  password: "any_password",
  email: "any_email",
  image: "any_image",
  createdAt: "any_createdAt",
  updatedAt: "any_updatedAt",
  isActive: true,
  emailValidationExpiresIn: 1,
  emailValidationToken: "other_emailValidationToken",
  passwordRecoveryExpiresIn: 1,
  passwordRecoveryToken: "other_passwordRecoveryToken",
});

export const createUserWithAuthenticationMockedModel = (
  isValid: boolean = true
): User => ({
  ...createUserMockedModel(isValid),
  authentication: createAuthenticationMockedModel(),
});
