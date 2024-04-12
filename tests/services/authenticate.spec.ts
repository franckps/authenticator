import { User } from "../../src/models/User";
import { Authentication } from "../../src/models/Authentication";
import { UserRepository } from "../../src/interfaces/repository";
import { CustomError } from "../../src/utils/errors";
import {
  CallUrlCallback,
  CreateAuthentication,
  PasswordValidator,
} from "../../src/interfaces/utils";
import { Authenticate } from "../../src/services/authenticate";

interface SutTypes {
  sut: Authenticate;
  userRepositoryStub: UserRepository;
  passwordValidatorStub: PasswordValidator;
  createAuthenticationStub: CreateAuthentication;
  callUrlCallbackStub: CallUrlCallback;
}

const makeSut = (): SutTypes => {
  class UserRepositoryStub implements UserRepository {
    getByCode(token: string): Promise<User> {
      throw new Error("Method not implemented.");
    }
    getByPasswordRecoveryToken(token: string): Promise<User> {
      throw new Error("Method not implemented.");
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
          codeExpiresIn: "any_codeExpiresIn",
          token: "any_token",
          createdAt: "any_createdAt",
          expiresIn: "any_expiresIn",
          isActive: true,
        },
      });
    }

    updateByUsername(username: string, user: User): Promise<void> {
      return Promise.resolve();
    }
  }

  class PasswordValidatorStub implements PasswordValidator {
    isEqual(passwordToTest: string, userPassword: string): boolean {
      return true;
    }
  }

  class CallUrlCallbackStub implements CallUrlCallback {
    call(url: string, code: string): void {
      return;
    }
  }

  class CreateAuthenticationStub implements CreateAuthentication {
    create(): Authentication {
      return {
        code: "any_code",
        codeExpiresIn: "any_codeExpiresIn",
        token: "any_token",
        createdAt: "any_createdAt",
        expiresIn: "any_expiresIn",
        isActive: true,
      };
    }
  }

  const userRepositoryStub = new UserRepositoryStub();
  const passwordValidatorStub = new PasswordValidatorStub();
  const callUrlCallbackStub = new CallUrlCallbackStub();
  const createAuthenticationStub = new CreateAuthenticationStub();
  const sut = new Authenticate(
    userRepositoryStub,
    passwordValidatorStub,
    createAuthenticationStub,
    callUrlCallbackStub
  );

  return {
    userRepositoryStub,
    passwordValidatorStub,
    createAuthenticationStub,
    callUrlCallbackStub,
    sut,
  };
};

describe("#Authenticate", () => {
  test("Should call repository correctly to get user by username", async () => {
    const { sut, userRepositoryStub } = makeSut();
    const spyGetByUsername = jest.spyOn(userRepositoryStub, "getByUsername");
    await sut.execute({
      username: "any_username",
      password: "any_password",
      callback: "any_callback",
    });
    expect(spyGetByUsername).toBeCalledWith("any_username");
  });
  test("Should fail if no user be found", async () => {
    const { sut, userRepositoryStub } = makeSut();
    const spyGetByUsername = jest.spyOn(userRepositoryStub, "getByUsername");
    spyGetByUsername.mockReturnValue(Promise.resolve(null as any));
    try {
      await sut.execute({
        username: "any_username",
        password: "any_password",
        callback: "any_callback",
      });
      expect(false).toBe(true);
    } catch (err: any) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual("Invalid username or password");
    }
  });
  test("Should call password validation correctly", async () => {
    const { sut, passwordValidatorStub } = makeSut();
    const spyIsEqual = jest.spyOn(passwordValidatorStub, "isEqual");
    await sut.execute({
      username: "any_username",
      password: "any_password",
      callback: "any_callback",
    });
    expect(spyIsEqual).toBeCalledWith("any_password", "any_password");
  });
  test("Should fail if password be not valid", async () => {
    const { sut, passwordValidatorStub } = makeSut();
    const spyIsEqual = jest.spyOn(passwordValidatorStub, "isEqual");
    spyIsEqual.mockReturnValue(false);
    try {
      await sut.execute({
        username: "any_username",
        password: "any_password",
        callback: "any_callback",
      });
      expect(false).toBe(true);
    } catch (err: any) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual("Invalid username or password");
    }
  });
  test("Should call the createAuthentication create method", async () => {
    const { sut, createAuthenticationStub } = makeSut();
    const spyCreate = jest.spyOn(createAuthenticationStub, "create");
    await sut.execute({
      username: "any_username",
      password: "any_password",
      callback: "any_callback",
    });
    expect(spyCreate).toBeCalled();
  });
  test("Should call repository correctly to update user by username", async () => {
    const { sut, userRepositoryStub } = makeSut();
    const spyUpdateByUsername = jest.spyOn(
      userRepositoryStub,
      "updateByUsername"
    );
    await sut.execute({
      username: "any_username",
      password: "any_password",
      callback: "any_callback",
    });
    expect(spyUpdateByUsername).toBeCalledWith("any_username", {
      username: "any_username",
      password: "any_password",
      email: "any_email",
      image: "any_image",
      createdAt: "any_createdAt",
      updatedAt: "any_updatedAt",
      authentication: {
        code: "any_code",
        token: "any_token",
        createdAt: "any_createdAt",
        expiresIn: "any_expiresIn",
        isActive: true,
      },
    });
  });
  test("Should call the callback correctly case authenticated", async () => {
    const { sut, callUrlCallbackStub } = makeSut();
    const spyCall = jest.spyOn(callUrlCallbackStub, "call");
    await sut.execute({
      username: "any_username",
      password: "any_password",
      callback: "any_callback",
    });
    expect(spyCall).toBeCalledWith("any_callback", "any_code");
  });
});
