import { User } from "../../src/models/User";
import { Authentication } from "../../src/models/Authentication";
import { UserRepository } from "../../src/interfaces/repository";
import { CustomError } from "../../src/utils/errors";
import { InvalidateToken } from "../../src/interfaces/utils";
import { RemoveAuthentication } from "../../src/services/removeAuthentication";
import {
  createAuthenticationMockedModel,
  createOtherAuthenticationMockedModel,
  createUserMockedModel,
  createUserWithAuthenticationMockedModel,
} from "../factories/models";

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
    return Promise.resolve(createUserWithAuthenticationMockedModel());
  }

  getByToken(token: string): Promise<User> {
    return Promise.resolve(createUserWithAuthenticationMockedModel());
  }

  updateByUsername(username: string, user: User): Promise<void> {
    return Promise.resolve();
  }
}

class InvalidateTokenStub implements InvalidateToken {
  invalidate(authentication: Authentication): Authentication {
    return {
      ...createOtherAuthenticationMockedModel(),
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
    spyGetByToken.mockReturnValue(Promise.resolve(createUserMockedModel()));
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
    expect(spyInvalidate).toBeCalledWith(createAuthenticationMockedModel());
  });
  test("Should call repository correctly to update user by username", async () => {
    const { sut, userRepositoryStub } = makeSut();
    const spyUpdateByUsername = jest.spyOn(
      userRepositoryStub,
      "updateByUsername"
    );
    await sut.execute("any_token");
    expect(spyUpdateByUsername).toBeCalledWith("any_username", {
      ...createUserMockedModel(),
      authentication: createOtherAuthenticationMockedModel(false),
    });
  });
  test("Should resolve on success", async () => {
    const { sut } = makeSut();
    await sut.execute("any_token");
    expect(true).toBe(true);
  });
});
