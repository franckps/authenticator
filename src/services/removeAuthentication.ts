import { CustomError } from "../utils/errors";
import { UserRepository } from "../interfaces/repository";
import { InvalidateToken } from "../interfaces/utils";

export class RemoveAuthentication {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly invalidateToken: InvalidateToken
  ) {}

  async execute(token?: string): Promise<void> {
    if (!token) throw new CustomError("Unauthorized user");
    const user = await this.userRepository.getByToken(token);
    if (!user || !user.authentication)
      throw new CustomError("Unauthorized user");
    user.authentication = this.invalidateToken.invalidate(user.authentication);
    this.userRepository.updateByUsername(user.username as any, user);
    return;
  }
}
