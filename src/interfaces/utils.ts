import { Authentication } from "../models/Authentication";

export interface CreateAuthentication {
  create(): Authentication;
}

export interface PasswordValidator {
  isEqual(passwordToTest: string, userPassword: string): boolean;
}

export interface CallUrlCallback {
  call(url: string, code: string): void;
}

export interface Validator<T> {
  validate(data: T): boolean;
}
