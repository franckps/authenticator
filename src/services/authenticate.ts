import { CustomError } from "../utils/errors";
import { UserRepository } from "../interfaces/repository";
import { CreateAuthentication, PasswordValidator } from "../interfaces/utils";

export class Authenticate {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordValidator: PasswordValidator,
    private readonly createAuthentication: CreateAuthentication
  ) {}

  async execute({
    username,
    password,
    callback,
  }: {
    username: string;
    password: string;
    callback: string;
  }): Promise<string> {
    const user = await this.userRepository.getByUsername(username);
    if (!user) throw new CustomError("Invalid username or password");
    if (!user.isActive) throw new CustomError("Invalid user");
    const isValid = await this.passwordValidator.isEqual(
      password,
      user.password as any
    );
    if (!isValid) throw new CustomError("Invalid username or password");
    const authentication = this.createAuthentication.create();
    user.authentication = authentication;
    await this.userRepository.updateByUsername(username, user);
    return callback + "?code=" + authentication.code;
  }
}
