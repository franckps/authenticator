import { User } from "../../src/models/User";
import { Authentication } from "../../src/models/Authentication";
import { UserRepository } from "../../src/interfaces/repository";
import { CustomError } from "../../src/utils/errors";
import { TokenValidator } from "../../src/interfaces/utils";
import { GetUserByToken } from "../../src/services/getUserByToken";

interface SutTypes {
  sut: GetUserByToken;
  userRepositoryStub: UserRepository;
  tokenValidatorStub: TokenValidator;
}

class UserRepositoryStub implements UserRepository {
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

class TokenValidatorStub implements TokenValidator {
  validateTokenData(authentication: Authentication): boolean {
    return true;
  }
}

const makeSut = (): SutTypes => {
  const userRepositoryStub = new UserRepositoryStub();
  const tokenValidatorStub = new TokenValidatorStub();
  const sut = new GetUserByToken(userRepositoryStub, tokenValidatorStub);

  return {
    sut,
    userRepositoryStub,
    tokenValidatorStub,
  };
};

describe("#GetUserByToken", () => {
  test("Should fail case no token provided", async () => {
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
  test("Should call tokenValidator correctly", async () => {
    const { sut, tokenValidatorStub } = makeSut();
    const spyValidateTokenData = jest.spyOn(
      tokenValidatorStub,
      "validateTokenData"
    );
    await sut.execute("any_token");
    expect(spyValidateTokenData).toBeCalledWith({
      code: "any_code",
      codeExpiresIn: 1,
      token: "any_token",
      createdAt: "any_createdAt",
      updatedAt: "any_updatedAt",
      expiresIn: 1,
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
  test("Should return user data on success", async () => {
    const { sut } = makeSut();
    const user = await sut.execute("any_token");
    expect(user).toEqual({
      username: "any_username",
      password: null,
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
  });
});
