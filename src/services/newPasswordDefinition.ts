import { CustomError } from "../utils/errors";
import { UserRepository } from "../interfaces/repository";
import { CreateAuthentication, PasswordEncrypt } from "../interfaces/utils";

export class NewPasswordDefinition {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordEncrypt: PasswordEncrypt,
    private readonly createAuthentication: CreateAuthentication
  ) {}

  async execute(
    passwordRecoveryToken: string,
    newPassword: string,
    callback: string
  ): Promise<string> {
    const user = await this.userRepository.getByPasswordRecoveryToken(
      passwordRecoveryToken
    );
    if (!user) throw new CustomError("Unauthorized user");
    const encryptedPassword = await this.passwordEncrypt.encrypt(newPassword);
    user.password = encryptedPassword;
    const authentication = this.createAuthentication.create();
    user.authentication = authentication;
    user.updatedAt = new Date().toISOString();
    await this.userRepository.updateByUsername(user.username as any, user);
    return callback + "?code=" + authentication.code;
  }
}
