import { User } from "../../src/models/User";
import { Authentication } from "../../src/models/Authentication";

export const createAuthenticationMockedModel = (): Authentication => ({
  code: "any_code",
  codeExpiresIn: 1,
  token: "any_token",
  createdAt: "any_createdAt",
  updatedAt: "any_updatedAt",
  expiresIn: 1,
  isActive: true,
});

export const createOtherAuthenticationMockedModel = (): Authentication => ({
  code: "other_code",
  codeExpiresIn: 1,
  token: "other_token",
  createdAt: "other_createdAt",
  updatedAt: "other_updatedAt",
  expiresIn: 1,
  isActive: true,
});

export const createUserMockedModel = (): User => ({
  userId: "any_userId",
  username: "any_username",
  password: "any_password",
  email: "any_email",
  image: "any_image",
  createdAt: "any_createdAt",
  updatedAt: "any_updatedAt",
});

export const createOtherUserMockedModel = (): User => ({
  userId: "any_userId",
  username: "any_username",
  password: "any_password",
  email: "any_email",
  image: "any_image",
  createdAt: "any_createdAt",
  updatedAt: "any_updatedAt",
});

export const createUserWithAuthenticationMockedModel = (): User => ({
  ...createUserMockedModel(),
  authentication: createAuthenticationMockedModel(),
});
