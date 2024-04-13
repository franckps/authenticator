import { genSalt, hash } from "bcrypt";
import { PasswordEncrypt } from "../interfaces/utils";

export class PasswordEncryptBcrypt implements PasswordEncrypt {
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
