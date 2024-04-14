export interface Authentication {
  userId?: string;
  code: string;
  codeExpiresIn: number;
  token: string;
  createdAt: string;
  updatedAt: string;
  expiresIn: number;
  isActive: boolean;
}
