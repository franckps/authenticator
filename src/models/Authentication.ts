export interface Authentication {
  code: string;
  codeExpiresIn: number;
  token: string;
  createdAt: string;
  expiresIn: number;
  isActive: boolean;
}
