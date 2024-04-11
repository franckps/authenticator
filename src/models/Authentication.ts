export interface Authentication {
  code: string;
  token: string;
  createdAt: string;
  expiresIn: string;
  isActive: boolean;
}
