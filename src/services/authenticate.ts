import { CustomError } from "../utils/errors";
import { UserRepository } from "../interfaces/repository";
import {
  CallUrlCallback,
  CreateAuthentication,
  PasswordValidator,
} from "../interfaces/utils";

export class Authenticate {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordValidator: PasswordValidator,
    private readonly createAuthentication: CreateAuthentication,
    private readonly callUrlCallback: CallUrlCallback
  ) {}

  async execute({
    username,
    password,
    callback,
  }: {
    username: string;
    password: string;
    callback: string;
  }): Promise<void> {
    const user = await this.userRepository.getByUsername(username);
    if (!user) throw new CustomError("Invalid username or password");
    const isValid = await this.passwordValidator.isEqual(
      password,
      user.password
    );
    if (!isValid) throw new CustomError("Invalid username or password");
    const authentication = this.createAuthentication.create();
    user.authentication = authentication;
    await this.userRepository.updateByUsername(username, user);
    this.callUrlCallback.call(callback, user.authentication.code);
  }
}
