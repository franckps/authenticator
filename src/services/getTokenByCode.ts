import { CustomError } from "../utils/errors";
import { UserRepository } from "../interfaces/repository";
import { CodeValidator } from "../interfaces/utils";

export class GetTokenByCode {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly codeValidator: CodeValidator
  ) {}

  async execute(
    code: string
  ): Promise<{ token: string; createdAt: string; expiresIn: string }> {
    const user = await this.userRepository.getByCode(code);
    if (!user) throw new CustomError("Unauthorized user");
    const isValid = this.codeValidator.validateCode(user.authentication as any);
    if (!isValid) throw new CustomError("Unauthorized user");
    return {
      token: (user.authentication as any).token,
      createdAt: (user.authentication as any).createdAt,
      expiresIn: (user.authentication as any).expiresIn,
    };
  }
}
