import { User } from "../models/User";
import { Validator } from "../interfaces/utils";

export class UserValidator implements Validator<User> {
  validate(data: User): boolean {
    if (!data.username || data.username.trim() == "")
      throw Error("username can't be empty");
    if (!data.password || data.password.trim() == "")
      throw Error("password can't be empty");
    if (!data.email || data.email.trim() == "")
      throw Error("email can't be empty");

    return true;
  }
}
