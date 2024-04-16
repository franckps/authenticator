import { User } from "../models/User";
import { UserRepository } from "../interfaces/repository";
import { TokenValidator } from "../interfaces/utils";
import { CustomError } from "../utils/errors";

export class GetUserByToken {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenValidator: TokenValidator
  ) {}

  async execute(token?: string): Promise<User> {
    if (!token) throw new CustomError("Unauthorized user");
    const user = await this.userRepository.getByToken(token);
    if (!user || !user.authentication)
      throw new CustomError("Unauthorized user");
    const isValid = this.tokenValidator.validateTokenData(user.authentication);
    if (!isValid) throw new CustomError("Unauthorized user");
    user.password = undefined as any;
    user.authentication = undefined as any;
    user.passwordRecoveryExpiresIn = undefined as any;
    user.passwordRecoveryToken = undefined as any;

    return user;
  }
}
