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
    return {} as any;
  }
}
