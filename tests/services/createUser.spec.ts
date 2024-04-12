import { User } from "../../src/models/User";
import { Authentication } from "../../src/models/Authentication";
import { UserRepository } from "../../src/interfaces/repository";
import { CustomError } from "../../src/utils/errors";
import {
  CallUrlCallback,
  CreateAuthentication,
  Validator,
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
  createAuthenticationStub: CreateAuthentication;
  callUrlCallbackStub: CallUrlCallback;
}

class UserRepositoryStub implements UserRepository {
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

class CallUrlCallbackStub implements CallUrlCallback {
  call(url: string, code: string): void {
    return;
  }
}

class CreateAuthenticationStub implements CreateAuthentication {
  create(): Authentication {
    return {
      code: "any_code",
      token: "any_token",
      createdAt: "any_createdAt",
      expiresIn: "any_expiresIn",
      isActive: true,
    };
  }
}

const makeSut = (): SutTypes => {
  const userValidatorStub = new UserValidatorStub();
  const userRepositoryStub = new UserRepositoryStub();
  const createAuthenticationStub = new CreateAuthenticationStub();
  const callUrlCallbackStub = new CallUrlCallbackStub();
  const sut = new CreateUser(
    userValidatorStub,
    userRepositoryStub,
    createAuthenticationStub,
    callUrlCallbackStub
  );

  return {
    sut,
    userValidatorStub,
    userRepositoryStub,
    createAuthenticationStub,
    callUrlCallbackStub,
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
          token: "any_token",
          createdAt: "any_createdAt",
          expiresIn: "any_expiresIn",
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
    await sut.execute(userData, "any_callback");
    expect(spyCall).toBeCalledWith("any_callback", "any_code");
  });
});
