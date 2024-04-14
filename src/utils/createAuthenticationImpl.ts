import { Authentication } from "src/models/Authentication";
import { CreateAuthentication } from "../interfaces/utils";
import { randomUUID } from "crypto";

export class CreateAuthenticationImpl implements CreateAuthentication {
  create(): Authentication {
    return {
      code: randomUUID(),
      codeExpiresIn: 1000 * 30, //30 secs
      token: randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresIn: 1000 * 60 * 60 * 24 * 3, //3 days
      isActive: true,
    };
  }
}
