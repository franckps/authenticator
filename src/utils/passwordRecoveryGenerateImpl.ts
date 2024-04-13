import { randomUUID } from "crypto";
import { PasswordRecoveryGenerate } from "../interfaces/utils";

export class PasswordRecoveryGenerateImpl implements PasswordRecoveryGenerate {
  generateRecovery(): {
    passwordRecoveryToken: string;
    passwordRecoveryExpiresIn: number;
  } {
    return {
      passwordRecoveryToken: randomUUID(),
      passwordRecoveryExpiresIn: 1000 * 60 * 5,
    };
  }
}
