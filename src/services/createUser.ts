import { UserRepository } from "../interfaces/repository";
import {
  EmailVerification,
  PasswordEncrypt,
  Validator,
  PasswordRecoveryGenerate,
  CreateAuthentication,
} from "../interfaces/utils";
import { User } from "../models/User";
import { CustomError } from "../utils/errors";

export class CreateUser {
  constructor(
    private readonly userValidator: Validator<User>,
    private readonly userRepository: UserRepository,
    private readonly passwordEncrypt: PasswordEncrypt,
    private readonly createAuthentication: CreateAuthentication,
    private readonly passwordRecoveryGenerate: PasswordRecoveryGenerate,
    private readonly emailVerification: EmailVerification
  ) {}

  async execute(userData: User, callback: string): Promise<void> {
    this.userValidator.validate(userData);
    const user = await this.userRepository.getByUsername(
      userData.username as any
    );
    if (!!user) throw new CustomError("User awready registered");
    const encryptedPassword = await this.passwordEncrypt.encrypt(
      userData.password as any
    );
    const newUser = {
      ...userData,
      createdAt: undefined,
      updatedAt: undefined,
      password: encryptedPassword,
      isActive: false,
      authentication: this.createAuthentication.create(),
    } as User;
    const { passwordRecoveryToken, passwordRecoveryExpiresIn } =
      this.passwordRecoveryGenerate.generateRecovery();
    newUser.emailValidationToken = passwordRecoveryToken;
    newUser.emailValidationExpiresIn = passwordRecoveryExpiresIn;
    await this.userRepository.create(newUser);
    this.emailVerification.verify(
      {
        username: newUser.username,
        email: newUser.email,
        image: newUser.image,
      },
      passwordRecoveryToken,
      callback
    );
  }
}
