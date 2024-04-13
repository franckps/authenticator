import { Authentication } from "src/models/Authentication";
import { TokenValidator } from "../interfaces/utils";

export class TokenValidatorImpl implements TokenValidator {
  validateTokenData(authentication: Authentication): boolean {
    if (!authentication.isActive) return false;
    const createdDate = new Date(authentication.createdAt).getMilliseconds();
    const currentDate = new Date().getMilliseconds();
    return createdDate - currentDate < authentication.expiresIn;
  }
}
