import { User } from "../../src/models/User";
import { Authentication } from "../../src/models/Authentication";
import { UserRepository } from "../../src/interfaces/repository";
import { CustomError } from "../../src/utils/errors";
import {
  CreateAuthentication,
  Validator,
  PasswordEncrypt,
} from "../../src/interfaces/utils";
import { CreateUser } from "../../src/services/createUser";

const userData: User = {
  username: "any_username",
  password: "any_password",
  email: "any_email",
  image: "any_image",
  createdAt: "any_createdAt",
  updatedAt: "any_updatedAt",
};

interface SutTypes {
  sut: CreateUser;
  userValidatorStub: Validator<User>;
  userRepositoryStub: UserRepository;
  passwordEncryptStub: PasswordEncrypt;
  createAuthenticationStub: CreateAuthentication;
}

class UserRepositoryStub implements UserRepository {
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

class CreateAuthenticationStub implements CreateAuthentication {
  create(): Authentication {
    return {
      code: "any_code",
      codeExpiresIn: 1,
      token: "any_token",
      createdAt: "any_createdAt",
      updatedAt: "any_updatedAt",
      expiresIn: 1,
      isActive: true,
    };
  }
}

class PasswordEncryptStub implements PasswordEncrypt {
  encrypt(password: string): Promise<string> {
    return Promise.resolve("any_encryptedPassword");
  }
}

const makeSut = (): SutTypes => {
  const userValidatorStub = new UserValidatorStub();
  const userRepositoryStub = new UserRepositoryStub();
  const passwordEncryptStub = new PasswordEncryptStub();
  const createAuthenticationStub = new CreateAuthenticationStub();
  const sut = new CreateUser(
    userValidatorStub,
    userRepositoryStub,
    passwordEncryptStub,
    createAuthenticationStub
  );

  return {
    sut,
    userValidatorStub,
    userRepositoryStub,
    passwordEncryptStub,
    createAuthenticationStub,
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
      Promise.resolve({
        username: "any_username",
        password: "any_password",
        email: "any_email",
        image: "any_image",
        createdAt: "any_createdAt",
        updatedAt: "any_updatedAt",
        authentication: {
          code: "any_code",
          codeExpiresIn: 1,
          token: "any_token",
          createdAt: "any_createdAt",
          updatedAt: "any_updatedAt",
          expiresIn: 1,
          isActive: true,
        },
      })
    );
    try {
      await sut.execute(userData, "any_callback");
      expect(false).toBe(true);
    } catch (err: any) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual("User awready registered");
    }
  });
  test("Should call the passwordEncrypt encrypt method correctly", async () => {
    const { sut, passwordEncryptStub } = makeSut();
    const spyEncrypt = jest.spyOn(passwordEncryptStub, "encrypt");
    await sut.execute(userData, "any_callback");
    expect(spyEncrypt).toBeCalledWith("any_password");
  });
  test("Should call the createAuthentication create method", async () => {
    const { sut, createAuthenticationStub } = makeSut();
    const spyCreate = jest.spyOn(createAuthenticationStub, "create");
    await sut.execute(userData, "any_callback");
    expect(spyCreate).toBeCalled();
  });
  test("Should call repository correctly to create user", async () => {
    const { sut, userRepositoryStub } = makeSut();
    const spyCreate = jest.spyOn(userRepositoryStub, "create");
    await sut.execute(userData, "any_callback");
    expect(spyCreate).toBeCalledWith({
      username: "any_username",
      password: "any_encryptedPassword",
      email: "any_email",
      image: "any_image",
      createdAt: "any_createdAt",
      updatedAt: "any_updatedAt",
      authentication: {
        code: "any_code",
        codeExpiresIn: 1,
        token: "any_token",
        createdAt: "any_createdAt",
        updatedAt: "any_updatedAt",
        expiresIn: 1,
        isActive: true,
      },
    });
  });
  test("Should return code case authenticated", async () => {
    const { sut } = makeSut();
    const resultCode = await sut.execute(userData, "any_callback");
    expect(resultCode).toEqual("any_code");
  });
});
