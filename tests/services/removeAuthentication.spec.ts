import { User } from "../../src/models/User";
import { Authentication } from "../../src/models/Authentication";
import { UserRepository } from "../../src/interfaces/repository";
import { CustomError } from "../../src/utils/errors";
import { InvalidateToken } from "../../src/interfaces/utils";
import { RemoveAuthentication } from "../../src/services/removeAuthentication";

interface SutTypes {
  sut: RemoveAuthentication;
  userRepositoryStub: UserRepository;
  invalidateTokenStub: InvalidateToken;
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

class InvalidateTokenStub implements InvalidateToken {
  invalidate(authentication: Authentication): Authentication {
    return {
      code: "other_code",
      codeExpiresIn: 1,
      token: "other_token",
      createdAt: "other_createdAt",
      updatedAt: "other_updatedAt",
      expiresIn: 1,
      isActive: false,
    };
  }
}

const makeSut = (): SutTypes => {
  const userRepositoryStub = new UserRepositoryStub();
  const invalidateTokenStub = new InvalidateTokenStub();
  const sut = new RemoveAuthentication(userRepositoryStub, invalidateTokenStub);

  return {
    sut,
    userRepositoryStub,
    invalidateTokenStub,
  };
};

describe("#RemoveAuthentication", () => {
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
  test("Should call invalidateToken correctly", async () => {
    const { sut, invalidateTokenStub } = makeSut();
    const spyInvalidate = jest.spyOn(invalidateTokenStub, "invalidate");
    await sut.execute("any_token");
    expect(spyInvalidate).toBeCalledWith({
      code: "any_code",
      codeExpiresIn: 1,
      token: "any_token",
      createdAt: "any_createdAt",
      updatedAt: "any_updatedAt",
      expiresIn: 1,
      isActive: true,
    });
  });
  test("Should call repository correctly to update user by username", async () => {
    const { sut, userRepositoryStub } = makeSut();
    const spyUpdateByUsername = jest.spyOn(
      userRepositoryStub,
      "updateByUsername"
    );
    await sut.execute("any_token");
    expect(spyUpdateByUsername).toBeCalledWith("any_username", {
      username: "any_username",
      password: "any_password",
      email: "any_email",
      image: "any_image",
      createdAt: "any_createdAt",
      updatedAt: "any_updatedAt",
      authentication: {
        code: "other_code",
        codeExpiresIn: 1,
        token: "other_token",
        createdAt: "other_createdAt",
        updatedAt: "other_updatedAt",
        expiresIn: 1,
        isActive: false,
      },
    });
  });
  test("Should resolve on success", async () => {
    const { sut } = makeSut();
    await sut.execute("any_token");
    expect(true).toBe(true);
  });
});
