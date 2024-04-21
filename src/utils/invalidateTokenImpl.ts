import { Authentication } from "src/models/Authentication";
import { InvalidateToken } from "../interfaces/utils";

export class InvalidateTokenImpl implements InvalidateToken {
  invalidate(authentication: Authentication): Authentication {
    return { ...authentication, isActive: false };
  }
}
