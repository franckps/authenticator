import { CustomError } from "../utils/errors";
import { UserRepository } from "../interfaces/repository";
import {
  PasswordRecoveryGenerate,
  SendRecoveryToken,
} from "../interfaces/utils";

export class RecoveryPassword {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordRecoveryGenerate: PasswordRecoveryGenerate,
    private readonly sendRecoveryToken: SendRecoveryToken
  ) {}

  async execute(username: string): Promise<void> {
    const user = await this.userRepository.getByUsername(username);
    if (!user) throw new CustomError("User not found");
    const { passwordRecoveryToken, passwordRecoveryExpiresIn } =
      this.passwordRecoveryGenerate.generateRecovery();
    user.passwordRecoveryToken = passwordRecoveryToken;
    user.passwordRecoveryExpiresIn = passwordRecoveryExpiresIn;
    await this.userRepository.updateByUsername(username, user);
    await this.sendRecoveryToken.sendRecovery(
      {
        username: user.username,
        password: user.password,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      passwordRecoveryToken
    );
  }
}
