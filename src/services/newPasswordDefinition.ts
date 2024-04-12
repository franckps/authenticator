import { CustomError } from "../utils/errors";
import { UserRepository } from "../interfaces/repository";
import { CallUrlCallback, CreateAuthentication } from "../interfaces/utils";

export class NewPasswordDefinition {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly createAuthentication: CreateAuthentication,
    private readonly callUrlCallback: CallUrlCallback
  ) {}

  async execute(
    passwordRecoveryToken: string,
    newPassword: string,
    callback: string
  ): Promise<void> {
    const user = await this.userRepository.getByPasswordRecoveryToken(
      passwordRecoveryToken
    );
    if (!user) throw new CustomError("Unauthorized user");
    user.password = newPassword;
    const authentication = this.createAuthentication.create();
    user.authentication = authentication;
    await this.userRepository.updateByUsername(user.username, user);
    this.callUrlCallback.call(callback, authentication.code);
  }
}
