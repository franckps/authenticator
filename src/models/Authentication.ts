export interface Authentication {
  userId?: string;
  code: string;
  codeExpiresIn: number;
  token: string;
  createdAt: string;
  expiresIn: number;
  isActive: boolean;
}
