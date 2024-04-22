import { Sequelize } from "sequelize";
import { UserValidator } from "../utils/userValidator";
import { CreateUser } from "../services/createUser";
import { UserRepositoryImpl } from "../repositories/sequelize/userRepositoryImpl";
import {
  createSequelizeAuthenticationModel,
  createSequelizeUserModel,
} from "../repositories/sequelize/instances";
import { PasswordEncryptBcrypt } from "../utils/passwordEncryptBcrypt";
import { CreateAuthenticationImpl } from "../utils/createAuthenticationImpl";
import { Authenticate } from "../services/authenticate";
import { Authorize } from "../services/authorize";
import { TokenValidatorImpl } from "../utils/tokenValidatorImpl";
import { GetUserByToken } from "../services/getUserByToken";
import { GetTokenByCode } from "../services/getTokenByCode";
import { NewPasswordDefinition } from "../services/newPasswordDefinition";
import { RecoveryPassword } from "../services/recoveryPassword";
import { PasswordRecoveryGenerateImpl } from "../utils/passwordRecoveryGenerateImpl";
import { SendRecoveryTokenEmail } from "../utils/sendRecoveryTokenEmail";
import { EmailVerificationImpl } from "../utils/emailVerificationImpl";
import { EmailValidation } from "../services/emailValidation";
import { RemoveAuthentication } from "../services/removeAuthentication";
import { InvalidateTokenImpl } from "../utils/invalidateTokenImpl";
console.log(process.env.SQLITE_DATABASE);
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.SQLITE_DATABASE,
});
const userValidator = new UserValidator();
const userRepository = new UserRepositoryImpl(
  createSequelizeUserModel(sequelize),
  createSequelizeAuthenticationModel(sequelize)
);
const passwordEncrypt = new PasswordEncryptBcrypt();
const createAuthentication = new CreateAuthenticationImpl();
const tokenValidator = new TokenValidatorImpl();
const passwordRecoveryGenerate = new PasswordRecoveryGenerateImpl();
const invalidateToken = new InvalidateTokenImpl();
const sendRecoveryToken = new SendRecoveryTokenEmail(
  {
    service: process.env.EMAIL_HOST as any,
    authUser: process.env.EMAIL_USER as any,
    authPassword: process.env.EMAIL_PASS as any,
    from: process.env.EMAIL_FROM as any,
  },
  process.env.BASE_URL + "/api/v1/password/"
);
const emailVerificationImpl = new EmailVerificationImpl(
  {
    service: process.env.EMAIL_HOST as any,
    authUser: process.env.EMAIL_USER as any,
    authPassword: process.env.EMAIL_PASS as any,
    from: process.env.EMAIL_FROM as any,
  },
  process.env.BASE_URL + "/api/v1/register/validation/"
);

export const makeCreateUserService = (): CreateUser => {
  return new CreateUser(
    userValidator,
    userRepository,
    passwordEncrypt,
    createAuthentication,
    passwordRecoveryGenerate,
    emailVerificationImpl
  );
};

export const makeAuthenticateService = (): Authenticate => {
  return new Authenticate(
    userRepository,
    passwordEncrypt,
    createAuthentication
  );
};

export const makeAuthorizeService = (): Authorize => {
  return new Authorize(userRepository, tokenValidator);
};

export const makeGetTokenByCodeService = (): GetTokenByCode => {
  return new GetTokenByCode(userRepository, tokenValidator);
};

export const makeGetUserByTokenService = (): GetUserByToken => {
  return new GetUserByToken(userRepository, tokenValidator);
};

export const makeNewPasswordDefinitionService = (): NewPasswordDefinition => {
  return new NewPasswordDefinition(
    userRepository,
    passwordEncrypt,
    createAuthentication
  );
};

export const makeRecoveryPasswordService = (): RecoveryPassword => {
  return new RecoveryPassword(
    userRepository,
    passwordRecoveryGenerate,
    sendRecoveryToken
  );
};

export const makeEmailValidationService = (): EmailValidation => {
  return new EmailValidation(userRepository, createAuthentication);
};

export const makeRemoveAuthentication = (): RemoveAuthentication => {
  return new RemoveAuthentication(userRepository, invalidateToken);
};
