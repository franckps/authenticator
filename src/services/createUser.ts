import { UserRepository } from "../interfaces/repository";
import {
  CreateAuthentication,
  PasswordEncrypt,
  Validator,
} from "../interfaces/utils";
import { User } from "../models/User";
import { CustomError } from "../utils/errors";

export class CreateUser {
  constructor(
    private readonly userValidator: Validator<User>,
    private readonly userRepository: UserRepository,
    private readonly passwordEncrypt: PasswordEncrypt,
    private readonly createAuthentication: CreateAuthentication
  ) {}

  async execute(userData: User, callback: string): Promise<string> {
    this.userValidator.validate(userData);
    const user = await this.userRepository.getByUsername(userData.username);
    if (!!user) throw new CustomError("User awready registered");
    const encryptedPassword = await this.passwordEncrypt.encrypt(
      userData.password
    );
    const newUser = {
      ...userData,
      password: encryptedPassword,
    };
    const authentication = this.createAuthentication.create();
    newUser.authentication = authentication;
    this.userRepository.create(newUser);
    return authentication.code;
  }
}
