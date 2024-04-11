import { UserRepository } from "../interfaces/repository";
import {
  CallUrlCallback,
  CreateAuthentication,
  Validator,
} from "../interfaces/utils";
import { User } from "../models/User";
import { CustomError } from "../utils/errors";

export class CreateUser {
  constructor(
    private readonly userValidator: Validator<User>,
    private readonly userRepository: UserRepository,
    private readonly createAuthentication: CreateAuthentication,
    private readonly callUrlCallback: CallUrlCallback
  ) {}

  async execute(userData: User, callback: string): Promise<void> {
    this.userValidator.validate(userData);
    const user = await this.userRepository.getByUsername(userData.username);
    if (!!user) throw new CustomError("User awready registered");
    const authentication = this.createAuthentication.create();
    userData.authentication = authentication;
    this.userRepository.create(userData);
    this.callUrlCallback.call(callback, authentication.code);
  }
}
