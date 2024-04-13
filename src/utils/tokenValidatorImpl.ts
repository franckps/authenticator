import { Authentication } from "../models/Authentication";
import { CodeValidator, TokenValidator } from "../interfaces/utils";

export class TokenValidatorImpl implements TokenValidator, CodeValidator {
  validateCode(authentication: Authentication): boolean {
    if (!authentication.isActive) return false;
    const createdDate = new Date(authentication.createdAt).getMilliseconds();
    const currentDate = new Date().getMilliseconds();
    return createdDate - currentDate < authentication.codeExpiresIn;
  }
  validateTokenData(authentication: Authentication): boolean {
    if (!authentication.isActive) return false;
    const createdDate = new Date(authentication.createdAt).getMilliseconds();
    const currentDate = new Date().getMilliseconds();
    return createdDate - currentDate < authentication.expiresIn;
  }
}
