import { User } from "../../src/models/User";
import { Authentication } from "../../src/models/Authentication";
import { UserRepository } from "../../src/interfaces/repository";
import { CustomError } from "../../src/utils/errors";
import {
  CallUrlCallback,
  CreateAuthentication,
} from "../../src/interfaces/utils";
import { NewPasswordDefinition } from "../../src/services/newPasswordDefinition";

interface SutTypes {
  sut: NewPasswordDefinition;
  userRepositoryStub: UserRepository;
  createAuthenticationStub: CreateAuthentication;
  callUrlCallbackStub: CallUrlCallback;
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
        codeExpiresIn: "any_codeExpiresIn",
        token: "any_token",
        createdAt: "any_createdAt",
        expiresIn: "any_expiresIn",
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

const makeSut = (): SutTypes => {
  const userRepositoryStub = new UserRepositoryStub();
  const callUrlCallbackStub = new CallUrlCallbackStub();
  const createAuthenticationStub = new CreateAuthenticationStub();
  const sut = new NewPasswordDefinition(
    userRepositoryStub,
    createAuthenticationStub,
    callUrlCallbackStub
  );

  return {
    userRepositoryStub,
    createAuthenticationStub,
    callUrlCallbackStub,
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
      codeExpiresIn: "other_codeExpiresIn",
      token: "other_token",
      createdAt: "other_createdAt",
      expiresIn: "other_expiresIn",
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
      password: "other_password",
      email: "any_email",
      image: "any_image",
      createdAt: "any_createdAt",
      updatedAt: "any_updatedAt",
      authentication: {
        code: "other_code",
        codeExpiresIn: "other_codeExpiresIn",
        token: "other_token",
        createdAt: "other_createdAt",
        expiresIn: "other_expiresIn",
        isActive: true,
      },
    });
  });
  test("Should call the callback correctly case authenticated", async () => {
    const { sut, callUrlCallbackStub } = makeSut();
    const spyCall = jest.spyOn(callUrlCallbackStub, "call");
    await sut.execute(
      "any_passwordRecoveryToken",
      "other_password",
      "any_callback"
    );
    expect(spyCall).toBeCalledWith("any_callback", "any_code");
  });
});
