import { UserValidator } from "../utils/userValidator";
import { CreateUser } from "../services/createUser";
import { UserRepositoryImpl } from "../repositories/sequelize/userRepositoryImpl";
import {
  SequelizeAuthentication,
  SequelizeUser,
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

const userValidator = new UserValidator();
const userRepository = new UserRepositoryImpl(
  SequelizeUser,
  SequelizeAuthentication
);
const passwordEncrypt = new PasswordEncryptBcrypt();
const createAuthentication = new CreateAuthenticationImpl();
const tokenValidator = new TokenValidatorImpl();
const passwordRecoveryGenerate = new PasswordRecoveryGenerateImpl();
const sendRecoveryToken = new SendRecoveryTokenEmail({
  service: "",
  authUser: "",
  authPassword: "",
  from: "",
});

export const makeCreateUserService = (): CreateUser => {
  return new CreateUser(
    userValidator,
    userRepository,
    passwordEncrypt,
    createAuthentication
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
