import { UserRepository } from "../interfaces/repository";
import {
  CallUrlCallback,
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
    private readonly createAuthentication: CreateAuthentication,
    private readonly callUrlCallback: CallUrlCallback
  ) {}

  async execute(userData: User, callback: string): Promise<void> {
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
    this.callUrlCallback.call(callback, authentication.code);
  }
}
