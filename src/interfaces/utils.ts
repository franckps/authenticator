import { User } from "../models/User";
import { Authentication } from "../models/Authentication";

export interface CreateAuthentication {
  create(): Authentication;
}

export interface PasswordEncrypt {
  encrypt(password: string): Promise<string>;
}

export interface PasswordValidator {
  isEqual(passwordToTest: string, userPassword: string): Promise<boolean>;
}

export interface Validator<T> {
  validate(data: T): boolean;
}

export interface TokenValidator {
  validateTokenData(authentication: Authentication): boolean;
}
export interface PasswordRecoveryGenerate {
  generateRecovery(): {
    passwordRecoveryToken: string;
    passwordRecoveryExpiresIn: number;
  };
}

export interface SendRecoveryToken {
  sendRecovery(user: User, passwordRecoveryToken: string): Promise<void>;
}

export interface CodeValidator {
  validateCode(authentication: Authentication): boolean;
}

export interface EmailVerification {
  verify(
    user: User,
    passwordRecoveryToken: string,
    callback: string
  ): Promise<void>;
}
