import { User } from "../../src/models/User";
import { Authentication } from "../../src/models/Authentication";
import { UserRepository } from "../../src/interfaces/repository";
import { CustomError } from "../../src/utils/errors";
import {
  PasswordRecoveryGenerate,
  SendRecoveryToken,
} from "../../src/interfaces/utils";
import { RecoveryPassword } from "../../src/services/recoveryPassword";
import { createUserWithAuthenticationMockedModel } from "../factories/models";

interface SutTypes {
  sut: RecoveryPassword;
  userRepositoryStub: UserRepository;
  passwordRecoveryGenerateStub: PasswordRecoveryGenerate;
  sendRecoveryTokenStub: SendRecoveryToken;
}

class UserRepositoryStub implements UserRepository {
  getByEmailValidationToken(token: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  getByCode(token: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  getByPasswordRecoveryToken(token: string): Promise<User> {
    return Promise.resolve(createUserWithAuthenticationMockedModel());
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

class PasswordRecoveryGenerateStub implements PasswordRecoveryGenerate {
  generateRecovery(): {
    passwordRecoveryToken: string;
    passwordRecoveryExpiresIn: number;
  } {
    return {
      passwordRecoveryToken: "any_passwordRecoveryToken",
      passwordRecoveryExpiresIn: 1,
    };
  }
}

class SendRecoveryTokenStub implements SendRecoveryToken {
  sendRecovery(user: User, passwordRecoveryToken: string): Promise<void> {
    return Promise.resolve();
  }
}

const makeSut = (): SutTypes => {
  const userRepositoryStub = new UserRepositoryStub();
  const passwordRecoveryGenerateStub = new PasswordRecoveryGenerateStub();
  const sendRecoveryTokenStub = new SendRecoveryTokenStub();
  const sut = new RecoveryPassword(
    userRepositoryStub,
    passwordRecoveryGenerateStub,
    sendRecoveryTokenStub
  );

  return {
    sut,
    userRepositoryStub,
    passwordRecoveryGenerateStub,
    sendRecoveryTokenStub,
  };
};

describe("#RecoveryPassword", () => {
  test("Should call repository correctly to get user by username", async () => {
    const { sut, userRepositoryStub } = makeSut();
    const spyGetByUsername = jest.spyOn(userRepositoryStub, "getByUsername");
    await sut.execute("any_username");
    expect(spyGetByUsername).toBeCalledWith("any_username");
  });
  test("Should fail case user be not found", async () => {
    const { sut, userRepositoryStub } = makeSut();
    const spyGetByUsername = jest.spyOn(userRepositoryStub, "getByUsername");
    spyGetByUsername.mockReturnValue(Promise.resolve(null as any));
    try {
      await sut.execute("any_username");
      expect(false).toBe(true);
    } catch (err: any) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual("User not found");
    }
  });
  test("Should call passwordRecoveryGenerate", async () => {
    const { sut, passwordRecoveryGenerateStub } = makeSut();
    const spyGenerateRecovery = jest.spyOn(
      passwordRecoveryGenerateStub,
      "generateRecovery"
    );
    await sut.execute("any_username");
    expect(spyGenerateRecovery).toBeCalled();
  });
  test("Should call repository correctly to update user passwordRecoveryToken", async () => {
    const { sut, userRepositoryStub } = makeSut();
    const spyUpdateByUsername = jest.spyOn(
      userRepositoryStub,
      "updateByUsername"
    );
    await sut.execute("any_username");
    expect(spyUpdateByUsername).toBeCalledWith(
      "any_username",
      createUserWithAuthenticationMockedModel()
    );
  });
  test("Should call sendRecoveryToken correctly", async () => {
    const { sut, sendRecoveryTokenStub } = makeSut();
    const spySendRecovery = jest.spyOn(sendRecoveryTokenStub, "sendRecovery");
    await sut.execute("any_username", undefined);
    expect(spySendRecovery).toBeCalledWith(
      {
        username: "any_username",
        password: "any_password",
        email: "any_email",
        image: "any_image",
        createdAt: "any_createdAt",
        updatedAt: "any_updatedAt",
      },
      "any_passwordRecoveryToken",
      undefined
    );
  });
  test("Should call sendRecoveryToken correctly with callback", async () => {
    const { sut, sendRecoveryTokenStub } = makeSut();
    const spySendRecovery = jest.spyOn(sendRecoveryTokenStub, "sendRecovery");
    await sut.execute("any_username", "any_callback");
    expect(spySendRecovery).toBeCalledWith(
      {
        username: "any_username",
        password: "any_password",
        email: "any_email",
        image: "any_image",
        createdAt: "any_createdAt",
        updatedAt: "any_updatedAt",
      },
      "any_passwordRecoveryToken",
      "any_callback"
    );
  });
});
