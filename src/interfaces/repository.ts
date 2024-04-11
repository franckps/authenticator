import { User } from "../models/User";

export interface UserRepository {
  create(user: User): Promise<void>;
  getByUsername(username: string): Promise<User>;
  updateByUsername(username: string, user: User): Promise<void>;
}
