import { User } from "../../src/models/User";
import { Authentication } from "../../src/models/Authentication";
import { UserRepository } from "../../src/interfaces/repository";
import { CustomError } from "../../src/utils/errors";
import { CodeValidator } from "../../src/interfaces/utils";
import { GetTokenByCode } from "../../src/services/getTokenByCode";
import {
  createAuthenticationMockedModel,
  createUserWithAuthenticationMockedModel,
} from "../factories/models";

interface SutTypes {
  sut: GetTokenByCode;
  userRepositoryStub: UserRepository;
  codeValidatorStub: CodeValidator;
}

class UserRepositoryStub implements UserRepository {
  getByEmailValidationToken(token: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  getByCode(token: string): Promise<User> {
    return Promise.resolve(createUserWithAuthenticationMockedModel());
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

class CodeValidatorStub implements CodeValidator {
  validateCode(authentication: Authentication): boolean {
    return true;
  }
}

const makeSut = (): SutTypes => {
  const userRepositoryStub = new UserRepositoryStub();
  const codeValidatorStub = new CodeValidatorStub();
  const sut = new GetTokenByCode(userRepositoryStub, codeValidatorStub);

  return {
    sut,
    userRepositoryStub,
    codeValidatorStub,
  };
};

describe("GetTokenByCode", () => {
  test("Should call repository correctly to get user by code", async () => {
    const { sut, userRepositoryStub } = makeSut();
    const spyGetByCode = jest.spyOn(userRepositoryStub, "getByCode");
    await sut.execute("any_code");
    expect(spyGetByCode).toBeCalledWith("any_code");
  });
  test("Should fail case user be not found", async () => {
    const { sut, userRepositoryStub } = makeSut();
    const spyGetByCode = jest.spyOn(userRepositoryStub, "getByCode");
    spyGetByCode.mockReturnValue(Promise.resolve(null as any));
    try {
      await sut.execute("any_code");
      expect(false).toBe(true);
    } catch (err: any) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual("Unauthorized user");
    }
  });
  test("Should call codeValidator correctly", async () => {
    const { sut, codeValidatorStub } = makeSut();
    const spyValidateCode = jest.spyOn(codeValidatorStub, "validateCode");
    await sut.execute("any_code");
    expect(spyValidateCode).toBeCalledWith(createAuthenticationMockedModel());
  });
  test("Should fail case code be not valid", async () => {
    const { sut, codeValidatorStub } = makeSut();
    const spyValidateCode = jest.spyOn(codeValidatorStub, "validateCode");
    spyValidateCode.mockReturnValue(false);
    try {
      await sut.execute("any_code");
      expect(false).toBe(true);
    } catch (err: any) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual("Unauthorized user");
    }
  });
  test("Should return token on success", async () => {
    const { sut } = makeSut();
    const result = await sut.execute("any_code");
    expect(result).toEqual({
      token: "any_token",
      createdAt: "any_createdAt",
      expiresIn: 1,
    });
  });
});
