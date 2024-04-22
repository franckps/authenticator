import { Authentication } from "../models/Authentication";
import { CodeValidator, TokenValidator } from "../interfaces/utils";

export class TokenValidatorImpl implements TokenValidator, CodeValidator {
  validateCode(authentication: Authentication): boolean {
    if (!authentication.isActive) return false;
    const createdDate = new Date(authentication.createdAt).getTime();
    const currentDate = new Date().getTime();
    return currentDate - createdDate < authentication.codeExpiresIn;
  }
  validateTokenData(authentication: Authentication): boolean {
    console.log({ authentication });
    if (!authentication.isActive) return false;
    const createdDate = new Date(authentication.createdAt).getTime();
    const currentDate = new Date().getTime();
    return currentDate - createdDate < authentication.expiresIn;
  }
}
