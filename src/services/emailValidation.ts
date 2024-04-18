import { CustomError } from "../utils/errors";
import { UserRepository } from "../interfaces/repository";
import { CreateAuthentication, PasswordEncrypt } from "../interfaces/utils";

export class EmailValidation {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly createAuthentication: CreateAuthentication
  ) {}

  async execute(
    emailValidationToken: string,
    callback: string
  ): Promise<string> {
    const user = await this.userRepository.getByEmailValidationToken(
      emailValidationToken
    );
    if (!user) throw new CustomError("Unauthorized user");
    const authentication = this.createAuthentication.create();
    user.authentication = authentication;
    user.isActive = true;
    await this.userRepository.updateByUsername(user.username as any, user);
    return callback + "?code=" + authentication.code;
  }
}
