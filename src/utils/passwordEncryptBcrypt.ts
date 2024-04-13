import { genSalt, hash, compare } from "bcrypt";
import { PasswordEncrypt, PasswordValidator } from "../interfaces/utils";

export class PasswordEncryptBcrypt
  implements PasswordEncrypt, PasswordValidator
{
  isEqual(passwordToTest: string, userPassword: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      compare(passwordToTest, userPassword, (err, result) => {
        if (!!err) return reject(err);
        return resolve(result);
      });
    });
  }

  encrypt(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      genSalt(10, "a", (err, saltResult) => {
        if (!!err) return reject(err);
        hash(password, saltResult, (err, hashResult) => {
          if (!!err) return reject(err);
          return resolve(hashResult);
        });
      });
    });
  }
}
