import { User } from "../../src/models/User";
import { Authentication } from "../../src/models/Authentication";
import { UserRepository } from "../../src/interfaces/repository";
import { CustomError } from "../../src/utils/errors";
import { TokenValidator } from "../../src/interfaces/utils";
import { Authorize } from "../../src/services/authorize";

interface SutTypes {
  sut: Authorize;
  userRepositoryStub: UserRepository;
  tokenValidatorStub: TokenValidator;
}

class UserRepositoryStub implements UserRepository {
  getByPasswordRecoveryToken(token: string): Promise<User> {
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
        token: "any_token",
        createdAt: "any_createdAt",
        expiresIn: "any_expiresIn",
        isActive: true,
      },
    });
  }

  getByToken(token: string): Promise<User> {
    return Promise.resolve({
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
    spyGetByToken.mockReturnValue(
      Promise.resolve({
        username: "any_username",
        password: "any_password",
        email: "any_email",
        image: "any_image",
        createdAt: "any_createdAt",
        updatedAt: "any_updatedAt",
      })
    );
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
    expect(spyValidateTokenData).toBeCalledWith({
      code: "any_code",
      token: "any_token",
      createdAt: "any_createdAt",
      expiresIn: "any_expiresIn",
      isActive: true,
    });
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