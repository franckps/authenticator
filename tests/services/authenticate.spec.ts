import { User } from "../../src/models/User";
import { Authentication } from "../../src/models/Authentication";
import { UserRepository } from "../../src/interfaces/repository";
import { CustomError } from "../../src/utils/errors";
import {
  CreateAuthentication,
  PasswordValidator,
} from "../../src/interfaces/utils";
import { Authenticate } from "../../src/services/authenticate";
import {
  createAuthenticationMockedModel,
  createUserWithAuthenticationMockedModel,
} from "../factories/models";

interface SutTypes {
  sut: Authenticate;
  userRepositoryStub: UserRepository;
  passwordValidatorStub: PasswordValidator;
  createAuthenticationStub: CreateAuthentication;
}

const makeSut = (): SutTypes => {
  class UserRepositoryStub implements UserRepository {
    getByEmailValidationToken(token: string): Promise<User> {
      throw new Error("Method not implemented.");
    }
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
      return Promise.resolve(createUserWithAuthenticationMockedModel());
    }

    updateByUsername(username: string, user: User): Promise<void> {
      return Promise.resolve();
    }
  }

  class PasswordValidatorStub implements PasswordValidator {
    isEqual(passwordToTest: string, userPassword: string): Promise<boolean> {
      return Promise.resolve(true);
    }
  }

  class CreateAuthenticationStub implements CreateAuthentication {
    create(): Authentication {
      return createAuthenticationMockedModel();
    }
  }

  const userRepositoryStub = new UserRepositoryStub();
  const passwordValidatorStub = new PasswordValidatorStub();
  const createAuthenticationStub = new CreateAuthenticationStub();
  const sut = new Authenticate(
    userRepositoryStub,
    passwordValidatorStub,
    createAuthenticationStub
  );

  return {
    userRepositoryStub,
    passwordValidatorStub,
    createAuthenticationStub,
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
  test("Should fail if no user be not valid", async () => {
    const { sut, userRepositoryStub } = makeSut();
    const spyGetByUsername = jest.spyOn(userRepositoryStub, "getByUsername");
    spyGetByUsername.mockReturnValue(
      Promise.resolve(createUserWithAuthenticationMockedModel(false))
    );
    try {
      await sut.execute({
        username: "any_username",
        password: "any_password",
        callback: "any_callback",
      });
      expect(false).toBe(true);
    } catch (err: any) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual("Invalid user");
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
    spyIsEqual.mockReturnValue(Promise.resolve(false));
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
      ...createUserWithAuthenticationMockedModel(),
      updatedAt: expect.any(String),
    });
  });
  test("Should return the code", async () => {
    const { sut } = makeSut();
    const resultCode = await sut.execute({
      username: "any_username",
      password: "any_password",
      callback: "any_callback",
    });
    expect(resultCode).toEqual("any_callback?code=any_code");
  });
});
