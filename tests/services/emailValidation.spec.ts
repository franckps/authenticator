import { User } from "../../src/models/User";
import { Authentication } from "../../src/models/Authentication";
import { UserRepository } from "../../src/interfaces/repository";
import { CustomError } from "../../src/utils/errors";
import { CreateAuthentication } from "../../src/interfaces/utils";
import { EmailValidation } from "../../src/services/emailValidation";
import {
  createAuthenticationMockedModel,
  createOtherAuthenticationMockedModel,
  createUserMockedModel,
  createUserWithAuthenticationMockedModel,
} from "../factories/models";

interface SutTypes {
  sut: EmailValidation;
  userRepositoryStub: UserRepository;
  createAuthenticationStub: CreateAuthentication;
}

class UserRepositoryStub implements UserRepository {
  getByEmailValidationToken(token: string): Promise<User> {
    return Promise.resolve(createUserWithAuthenticationMockedModel());
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

class CreateAuthenticationStub implements CreateAuthentication {
  create(): Authentication {
    return createAuthenticationMockedModel();
  }
}

const makeSut = (): SutTypes => {
  const userRepositoryStub = new UserRepositoryStub();
  const createAuthenticationStub = new CreateAuthenticationStub();
  const sut = new EmailValidation(userRepositoryStub, createAuthenticationStub);

  return {
    userRepositoryStub,
    createAuthenticationStub,
    sut,
  };
};

describe("#EmailValidation", () => {
  test("Should call repository correctly to get user by emailValidationToken", async () => {
    const { sut, userRepositoryStub } = makeSut();
    const spyGetByEmailValidationToken = jest.spyOn(
      userRepositoryStub,
      "getByEmailValidationToken"
    );
    await sut.execute("any_emailValidationToken", "any_callback");
    expect(spyGetByEmailValidationToken).toBeCalledWith(
      "any_emailValidationToken"
    );
  });
  test("Should fail case user be not found", async () => {
    const { sut, userRepositoryStub } = makeSut();
    const spyGetByEmailValidationToken = jest.spyOn(
      userRepositoryStub,
      "getByEmailValidationToken"
    );
    spyGetByEmailValidationToken.mockReturnValue(Promise.resolve(null as any));
    try {
      await sut.execute("any_emailValidationToken", "any_callback");
      expect(false).toBe(true);
    } catch (err: any) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual("Unauthorized user");
    }
  });
  test("Should call the createAuthentication create method", async () => {
    const { sut, createAuthenticationStub } = makeSut();
    const spyCreate = jest.spyOn(createAuthenticationStub, "create");
    await sut.execute("any_emailValidationToken", "any_callback");
    expect(spyCreate).toBeCalled();
  });
  test("Should call repository correctly to update user is active", async () => {
    const { sut, createAuthenticationStub, userRepositoryStub } = makeSut();

    const spyCreate = jest.spyOn(createAuthenticationStub, "create");
    spyCreate.mockReturnValue(createOtherAuthenticationMockedModel());
    const spyUpdateByUsername = jest.spyOn(
      userRepositoryStub,
      "updateByUsername"
    );
    await sut.execute("any_emailValidationToken", "any_callback");
    expect(spyUpdateByUsername).toBeCalledWith("any_username", {
      ...createUserMockedModel(),
      updatedAt: expect.any(String),
      authentication: createOtherAuthenticationMockedModel(),
    });
  });
  test("Should return code case email validated", async () => {
    const { sut } = makeSut();
    const resultCode = await sut.execute(
      "any_emailValidationToken",
      "any_callback"
    );
    expect(resultCode).toEqual("any_callback?code=any_code");
  });
});
