import { User } from "../../src/models/User";
import { Authentication } from "../../src/models/Authentication";
import { UserRepository } from "../../src/interfaces/repository";
import { CustomError } from "../../src/utils/errors";
import {
  CreateAuthentication,
  PasswordEncrypt,
} from "../../src/interfaces/utils";
import { NewPasswordDefinition } from "../../src/services/newPasswordDefinition";

interface SutTypes {
  sut: NewPasswordDefinition;
  userRepositoryStub: UserRepository;
  passwordEncryptStub: PasswordEncrypt;
  createAuthenticationStub: CreateAuthentication;
}

class UserRepositoryStub implements UserRepository {
  getByCode(token: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  getByPasswordRecoveryToken(token: string): Promise<User> {
    return Promise.resolve({
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
    });
  }
  getByToken(token: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  create(user: User): Promise<void> {
    return Promise.resolve();
  }

  getByUsername(username: string): Promise<User> {
    return Promise.resolve({
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
    });
  }

  updateByUsername(username: string, user: User): Promise<void> {
    return Promise.resolve();
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
  const userRepositoryStub = new UserRepositoryStub();
  const passwordEncryptStub = new PasswordEncryptStub();
  const createAuthenticationStub = new CreateAuthenticationStub();
  const sut = new NewPasswordDefinition(
    userRepositoryStub,
    passwordEncryptStub,
    createAuthenticationStub
  );

  return {
    userRepositoryStub,
    passwordEncryptStub,
    createAuthenticationStub,
    sut,
  };
};

describe("#NewPasswordDefinition", () => {
  test("Should call repository correctly to get user by passwordRecoveryToken", async () => {
    const { sut, userRepositoryStub } = makeSut();
    const spyGetByPasswordRecoveryToken = jest.spyOn(
      userRepositoryStub,
      "getByPasswordRecoveryToken"
    );
    await sut.execute(
      "any_passwordRecoveryToken",
      "other_password",
      "any_callback"
    );
    expect(spyGetByPasswordRecoveryToken).toBeCalledWith(
      "any_passwordRecoveryToken"
    );
  });
  test("Should fail case user be not found", async () => {
    const { sut, userRepositoryStub } = makeSut();
    const spyGetByPasswordRecoveryToken = jest.spyOn(
      userRepositoryStub,
      "getByPasswordRecoveryToken"
    );
    spyGetByPasswordRecoveryToken.mockReturnValue(Promise.resolve(null as any));
    try {
      await sut.execute(
        "any_passwordRecoveryToken",
        "other_password",
        "any_callback"
      );
      expect(false).toBe(true);
    } catch (err: any) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual("Unauthorized user");
    }
  });
  test("Should call the passwordEncrypt encrypt method correctly", async () => {
    const { sut, passwordEncryptStub } = makeSut();
    const spyEncrypt = jest.spyOn(passwordEncryptStub, "encrypt");
    await sut.execute(
      "any_passwordRecoveryToken",
      "other_password",
      "any_callback"
    );
    expect(spyEncrypt).toBeCalledWith("other_password");
  });
  test("Should call the createAuthentication create method", async () => {
    const { sut, createAuthenticationStub } = makeSut();
    const spyCreate = jest.spyOn(createAuthenticationStub, "create");
    await sut.execute(
      "any_passwordRecoveryToken",
      "other_password",
      "any_callback"
    );
    expect(spyCreate).toBeCalled();
  });
  test("Should call repository correctly to update user password", async () => {
    const { sut, createAuthenticationStub, userRepositoryStub } = makeSut();

    const spyCreate = jest.spyOn(createAuthenticationStub, "create");
    spyCreate.mockReturnValue({
      code: "other_code",
      codeExpiresIn: 2,
      token: "other_token",
      createdAt: "other_createdAt",
      updatedAt: "other_updatedAt",
      expiresIn: 2,
      isActive: true,
    });
    const spyUpdateByUsername = jest.spyOn(
      userRepositoryStub,
      "updateByUsername"
    );
    await sut.execute(
      "any_passwordRecoveryToken",
      "other_password",
      "any_callback"
    );
    expect(spyUpdateByUsername).toBeCalledWith("any_username", {
      username: "any_username",
      password: "any_encryptedPassword",
      email: "any_email",
      image: "any_image",
      createdAt: "any_createdAt",
      updatedAt: "any_updatedAt",
      authentication: {
        code: "other_code",
        codeExpiresIn: 2,
        token: "other_token",
        createdAt: "other_createdAt",
        updatedAt: "other_updatedAt",
        expiresIn: 2,
        isActive: true,
      },
    });
  });
  test("Should return code case authenticated", async () => {
    const { sut } = makeSut();
    const resultCode = await sut.execute(
      "any_passwordRecoveryToken",
      "other_password",
      "any_callback"
    );
    expect(resultCode).toEqual("any_callback?code=any_code");
  });
});
