import { User } from "../../src/models/User";
import { Authentication } from "../../src/models/Authentication";
import { UserRepository } from "../../src/interfaces/repository";
import { CustomError } from "../../src/utils/errors";
import { TokenValidator } from "../../src/interfaces/utils";
import { Authorize } from "../../src/services/authorize";
import {
  createAuthenticationMockedModel,
  createUserMockedModel,
  createUserWithAuthenticationMockedModel,
} from "../factories/models";

interface SutTypes {
  sut: Authorize;
  userRepositoryStub: UserRepository;
  tokenValidatorStub: TokenValidator;
}

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
  create(user: User): Promise<void> {
    return Promise.resolve();
  }

  getByUsername(username: string): Promise<User> {
    return Promise.resolve(createUserWithAuthenticationMockedModel());
  }

  getByToken(token: string): Promise<User> {
    return Promise.resolve(createUserWithAuthenticationMockedModel());
  }

  updateByUsername(username: string, user: User): Promise<void> {
    return Promise.resolve();
  }
}

class TokenValidatorStub implements TokenValidator {
  validateTokenData(authentication: Authentication): boolean {
    return true;
  }
}

const makeSut = (): SutTypes => {
  const userRepositoryStub = new UserRepositoryStub();
  const tokenValidatorStub = new TokenValidatorStub();
  const sut = new Authorize(userRepositoryStub, tokenValidatorStub);

  return {
    sut,
    userRepositoryStub,
    tokenValidatorStub,
  };
};

describe("#Authorize", () => {
  test("Should fail case no token sent", async () => {
    const { sut } = makeSut();
    try {
      await sut.execute();
      expect(false).toBe(true);
    } catch (err: any) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual("Unauthorized user");
    }
  });
  test("Should call repository correctly to get user by access token", async () => {
    const { sut, userRepositoryStub } = makeSut();
    const spyGetByToken = jest.spyOn(userRepositoryStub, "getByToken");
    await sut.execute("any_token");
    expect(spyGetByToken).toBeCalledWith("any_token");
  });
  test("Should fail case user be not found", async () => {
    const { sut, userRepositoryStub } = makeSut();
    const spyGetByToken = jest.spyOn(userRepositoryStub, "getByToken");
    spyGetByToken.mockReturnValue(Promise.resolve(null as any));
    try {
      await sut.execute("any_token");
      expect(false).toBe(true);
    } catch (err: any) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual("Unauthorized user");
    }
  });
  test("Should fail case authentication be not found", async () => {
    const { sut, userRepositoryStub } = makeSut();
    const spyGetByToken = jest.spyOn(userRepositoryStub, "getByToken");
    spyGetByToken.mockReturnValue(Promise.resolve(createUserMockedModel()));
    try {
      await sut.execute("any_token");
      expect(false).toBe(true);
    } catch (err: any) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual("Unauthorized user");
    }
  });
  test("Should call tokenValidator correctly", async () => {
    const { sut, tokenValidatorStub } = makeSut();
    const spyValidateTokenData = jest.spyOn(
      tokenValidatorStub,
      "validateTokenData"
    );
    await sut.execute("any_token");
    expect(spyValidateTokenData).toBeCalledWith(
      createAuthenticationMockedModel()
    );
  });
  test("Should fail case token be invalid", async () => {
    const { sut, tokenValidatorStub } = makeSut();
    const spyValidateTokenData = jest.spyOn(
      tokenValidatorStub,
      "validateTokenData"
    );
    spyValidateTokenData.mockReturnValue(false);
    try {
      await sut.execute("any_token");
      expect(false).toBe(true);
    } catch (err: any) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual("Unauthorized user");
    }
  });
});
