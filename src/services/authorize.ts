import { CustomError } from "../utils/errors";
import { UserRepository } from "../interfaces/repository";
import { TokenValidator } from "../interfaces/utils";

export class Authorize {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenValidator: TokenValidator
  ) {}

  async execute(token: string): Promise<void> {
    const user = await this.userRepository.getByToken(token);
    if (!user || !user.authentication)
      throw new CustomError("Unauthorized user");
    const isValid = this.tokenValidator.validateTokenData(user.authentication);
    if (!isValid) throw new CustomError("Unauthorized user");
  }
}
