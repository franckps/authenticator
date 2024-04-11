import { User } from "../models/User";

export interface UserRepository {
  getByUsername(username: string): Promise<User>;
  updateByUsername(username: string, user: User): Promise<void>;
}
