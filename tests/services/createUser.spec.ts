import { User } from "../../src/models/User";
import { Authentication } from "../../src/models/Authentication";
import { UserRepository } from "../../src/interfaces/repository";
import { CustomError } from "../../src/utils/errors";
import {
  EmailVerification,
  Validator,
  PasswordEncrypt,
  PasswordRecoveryGenerate,
  CreateAuthentication,
} from "../../src/interfaces/utils";
import { CreateUser } from "../../src/services/createUser";
import {
  createAuthenticationMockedModel,
  createUserMockedModel,
  createUserWithAuthenticationMockedModel,
} from "../factories/models";

const userData: User = createUserMockedModel();

interface SutTypes {
  sut: CreateUser;
  userValidatorStub: Validator<User>;
  userRepositoryStub: UserRepository;
  passwordEncryptStub: PasswordEncrypt;
  createAuthenticationStub: CreateAuthentication;
  emailVerificationStub: EmailVerification;
  passwordRecoveryGenerateStub: PasswordRecoveryGenerate;
}

class UserRepositoryStub implements UserRepository {
  getByEmailValidationToken(token: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  getByCode(token: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  getByToken(token: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  getByPasswordRecoveryToken(token: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  create(user: User): Promise<void> {
    return Promise.resolve();
  }

  getByUsername(username: string): Promise<User> {
    return Promise.resolve(null as any);
  }

  updateByUsername(username: string, user: User): Promise<void> {
    return Promise.resolve();
  }
}

class UserValidatorStub implements Validator<User> {
  validate(data: User): boolean {
    return true;
  }
}

class EmailVerificationStub implements EmailVerification {
  verify(
    user: User,
    passwordRecoveryToken: string,
    callback: string
  ): Promise<void> {
    return Promise.resolve();
  }
}

class PasswordEncryptStub implements PasswordEncrypt {
  encrypt(password: string): Promise<string> {
    return Promise.resolve("any_encryptedPassword");
  }
}

class PasswordRecoveryGenerateStub implements PasswordRecoveryGenerate {
  generateRecovery(): {
    passwordRecoveryToken: string;
    passwordRecoveryExpiresIn: number;
  } {
    return {
      passwordRecoveryToken: "any_emailValidationToken",
      passwordRecoveryExpiresIn: 1,
    };
  }
}

class CreateAuthenticationStub implements CreateAuthentication {
  create(): Authentication {
    return createAuthenticationMockedModel();
  }
}

const makeSut = (): SutTypes => {
  const userValidatorStub = new UserValidatorStub();
  const userRepositoryStub = new UserRepositoryStub();
  const passwordEncryptStub = new PasswordEncryptStub();
  const createAuthenticationStub = new CreateAuthenticationStub();
  const emailVerificationStub = new EmailVerificationStub();
  const passwordRecoveryGenerateStub = new PasswordRecoveryGenerateStub();
  const sut = new CreateUser(
    userValidatorStub,
    userRepositoryStub,
    passwordEncryptStub,
    createAuthenticationStub,
    passwordRecoveryGenerateStub,
    emailVerificationStub
  );

  return {
    sut,
    userValidatorStub,
    userRepositoryStub,
    passwordEncryptStub,
    createAuthenticationStub,
    passwordRecoveryGenerateStub,
    emailVerificationStub,
  };
};

describe("#CreateUser", () => {
  test("Should call validator correctly to validate data received", async () => {
    const { sut, userValidatorStub } = makeSut();
    const spyValidate = jest.spyOn(userValidatorStub, "validate");
    await sut.execute(userData, "any_callback");
    expect(spyValidate).toBeCalledWith(userData);
  });
  test("Should throw if validator throws", async () => {
    const { sut, userValidatorStub } = makeSut();
    const spyValidate = jest.spyOn(userValidatorStub, "validate");
    spyValidate.mockImplementationOnce(() => {
      throw new Error("any_error");
    });
    try {
      await sut.execute(userData, "any_callback");
      expect(false).toBeTruthy();
    } catch (err: any) {
      expect(err.message).toEqual("any_error");
    }
  });
  test("Should call repository correctly to get user by username", async () => {
    const { sut, userRepositoryStub } = makeSut();
    const spyGetByUsername = jest.spyOn(userRepositoryStub, "getByUsername");
    await sut.execute(userData, "any_callback");
    expect(spyGetByUsername).toBeCalledWith("any_username");
  });
  test("Should call fail case a user be found", async () => {
    const { sut, userRepositoryStub } = makeSut();
    const spyGetByUsername = jest.spyOn(userRepositoryStub, "getByUsername");
    spyGetByUsername.mockReturnValue(
      Promise.resolve(createUserWithAuthenticationMockedModel())
    );
    try {
      await sut.execute(userData, "any_callback");
      expect(false).toBe(true);
    } catch (err: any) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual("User already registered");
    }
  });
  test("Should call the passwordEncrypt encrypt method correctly", async () => {
    const { sut, passwordEncryptStub } = makeSut();
    const spyEncrypt = jest.spyOn(passwordEncryptStub, "encrypt");
    await sut.execute(userData, "any_callback");
    expect(spyEncrypt).toBeCalledWith("any_password");
  });
  test("Should call passwordRecoveryGenerate", async () => {
    const { sut, passwordRecoveryGenerateStub } = makeSut();
    const spyGenerateRecovery = jest.spyOn(
      passwordRecoveryGenerateStub,
      "generateRecovery"
    );
    await sut.execute(userData, "any_callback");
    expect(spyGenerateRecovery).toBeCalled();
  });
  test("Should call the createAuthentication create method", async () => {
    const { sut, createAuthenticationStub } = makeSut();
    const spyCreate = jest.spyOn(createAuthenticationStub, "create");
    await sut.execute(userData, "any_callback");
    expect(spyCreate).toBeCalled();
  });
  test("Should call the emailVerification verify method correctly", async () => {
    const { sut, emailVerificationStub } = makeSut();
    const spyVerify = jest.spyOn(emailVerificationStub, "verify");
    await sut.execute(userData, "any_callback");
    expect(spyVerify).toBeCalledWith(
      {
        username: "any_username",
        email: "any_email",
        image: "any_image",
      },
      "any_emailValidationToken",
      "any_callback"
    );
  });
  test("Should call repository correctly to create user", async () => {
    const { sut, userRepositoryStub } = makeSut();
    const spyCreate = jest.spyOn(userRepositoryStub, "create");
    await sut.execute(userData, "any_callback");
    expect(spyCreate).toBeCalledWith({
      ...createUserWithAuthenticationMockedModel(),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      password: "any_encryptedPassword",
      isActive: false,
    });
  });
  test("Should resolve case authenticated", async () => {
    const { sut } = makeSut();
    await sut.execute(userData, "any_callback");
  });
});
