import { User as UserModel } from "../../../src/models/User";
import { Authentication as AuthenticationModel } from "../../../src/models/Authentication";
import { UserRepositoryImpl } from "../../../src/repositories/sequelize/userRepositoryImpl";
import {
  createAuthenticationMockedModel,
  createUserMockedModel,
  createUserWithAuthenticationMockedModel,
} from "../../factories/models";

const userData: UserModel = createUserMockedModel();

const authenticationData: AuthenticationModel =
  createAuthenticationMockedModel();

interface User {
  create(model: UserModel): Promise<{ dataValues: UserModel }>;

  update(
    data: { status: string },
    filter: {
      where: {
        username: string;
      };
    }
  ): Promise<{ dataValues: UserModel }>;

  findAll(fiter: {
    where: {
      userId: string;
      username: string;
      passwordRecoveryToken: string;
    };
  }): Promise<{
    at: (ky: number) => { dataValues: UserModel };
    map: (elm: { dataValues: UserModel }) => UserModel[];
  }>;
}

interface Authentication {
  create(
    model: AuthenticationModel
  ): Promise<{ dataValues: AuthenticationModel }>;

  update(
    data: { status: string },
    filter: {
      where: {
        userId: string;
      };
    }
  ): Promise<{ dataValues: AuthenticationModel }>;

  findAll(fiter: {
    where: {
      userId: string;
      code: string;
      token: string;
    };
  }): Promise<{
    at: (ky: number) => { dataValues: AuthenticationModel };
    map: (elm: { dataValues: AuthenticationModel }) => AuthenticationModel[];
  }>;
}

class UserStub implements User {
  findAll(fiter: {
    where: {
      username: string;
      passwordRecoveryToken: string;
    };
  }): Promise<{
    at: (ky: number) => { dataValues: UserModel };
    map: (elm: { dataValues: UserModel }) => UserModel[];
  }> {
    return Promise.resolve({
      at: (ky) => ({
        dataValues: userData,
      }),
      map: (elm: { dataValues: UserModel }) => [userData],
    });
  }

  update(
    data: { status: string },
    filter: { where: { username: string } }
  ): Promise<{ dataValues: UserModel }> {
    return Promise.resolve({ dataValues: userData });
  }

  async create(model: UserModel): Promise<{ dataValues: UserModel }> {
    return Promise.resolve({ dataValues: userData });
  }
}

class AuthenticationStub implements Authentication {
  findAll(fiter: {
    where: {
      code: string;
      token: string;
    };
  }): Promise<{
    at: (ky: number) => { dataValues: AuthenticationModel };
    map: (elm: { dataValues: AuthenticationModel }) => AuthenticationModel[];
  }> {
    return Promise.resolve({
      at: (ky) => ({
        dataValues: authenticationData,
      }),
      map: (elm: { dataValues: AuthenticationModel }) => [authenticationData],
    });
  }

  update(
    data: { status: string },
    filter: { where: { userId: string } }
  ): Promise<{ dataValues: AuthenticationModel }> {
    return Promise.resolve({ dataValues: authenticationData });
  }

  async create(
    model: AuthenticationModel
  ): Promise<{ dataValues: AuthenticationModel }> {
    return Promise.resolve({ dataValues: authenticationData });
  }
}

interface SutTypes {
  sut: UserRepositoryImpl;
  userStub: User;
  authenticationStub: Authentication;
}

const makeSut = (): SutTypes => {
  const userStub: User = new UserStub();
  const authenticationStub: Authentication = new AuthenticationStub();
  const sut = new UserRepositoryImpl(
    userStub as any,
    authenticationStub as any
  );

  return { userStub, authenticationStub, sut };
};

describe("#UserRepositoryImpl", () => {
  describe("#create", () => {
    test("should call User.create and Authentication.create correctly", async () => {
      const { sut, userStub, authenticationStub } = makeSut();
      const createSpy = jest.spyOn(userStub, "create");
      const createAuthenticateSpy = jest.spyOn(authenticationStub, "create");
      await sut.create({ ...userData, authentication: authenticationData });

      expect(createSpy).toBeCalledWith({
        ...userData,
        userId: expect.any(String),
      });
      expect(createAuthenticateSpy).toBeCalledWith({
        ...authenticationData,
        userId: "any_userId",
      });
    });

    test("should fail case User.create fail", async () => {
      const { sut, userStub } = makeSut();
      const createSpy = jest.spyOn(userStub, "create");
      createSpy.mockReturnValue(Promise.resolve(null as any));
      try {
        await sut.create({ ...userData, authentication: authenticationData });
        expect(false).toBeTruthy();
      } catch (err: any) {
        expect(err.message).toEqual("Failure trying create user");
      }
    });
  });

  describe("#updateByUsername", () => {
    test("should call User.findAll, User.update and Authentication.update correctly", async () => {
      const { sut, userStub, authenticationStub } = makeSut();
      const findAllSpy = jest.spyOn(userStub, "findAll");
      const updateSpy = jest.spyOn(userStub, "update");
      const updateAuthenticateSpy = jest.spyOn(authenticationStub, "update");
      await sut.updateByUsername("any_username", {
        ...userData,
        authentication: authenticationData,
      });
      expect(findAllSpy).toBeCalledWith({
        where: {
          username: "any_username",
        },
      });
      expect(updateSpy).toBeCalledWith(
        {
          password: userData.password,
          email: userData.email,
          image: userData.image,
          emailValidationExpiresIn: userData.emailValidationExpiresIn,
          emailValidationToken: userData.emailValidationToken,
          isActive: userData.isActive,
          passwordRecoveryExpiresIn: userData.passwordRecoveryExpiresIn,
          passwordRecoveryToken: userData.passwordRecoveryToken,
        },
        {
          where: {
            username: "any_username",
          },
        }
      );
      expect(updateAuthenticateSpy).toBeCalledWith(
        {
          code: authenticationData?.code,
          codeExpiresIn: authenticationData?.codeExpiresIn,
          token: authenticationData?.token,
          createdAt: authenticationData?.createdAt,
          updatedAt: authenticationData?.updatedAt,
          expiresIn: authenticationData?.expiresIn,
          isActive: authenticationData?.isActive,
        },
        {
          where: {
            userId: "any_userId",
          },
        }
      );
    });

    test("should not call User.update and Authentication.update case User.findAll fail", async () => {
      const { sut, userStub, authenticationStub } = makeSut();
      const findAllSpy = jest.spyOn(userStub, "findAll");
      const updateSpy = jest.spyOn(userStub, "update");
      const updateAuthenticateSpy = jest.spyOn(authenticationStub, "update");
      findAllSpy.mockReturnValue(Promise.resolve(null as any));
      await sut.updateByUsername("any_username", {
        ...userData,
        authentication: authenticationData,
      });
      expect(updateSpy).not.toBeCalled();
      expect(updateAuthenticateSpy).not.toBeCalled();
    });
  });

  describe("#findByUsername", () => {
    test("should call User.findAll and Authentication.findAll correctly", async () => {
      const { sut, userStub, authenticationStub } = makeSut();
      const findAllSpy = jest.spyOn(userStub, "findAll");
      const findAllAuthenticationSpy = jest.spyOn(
        authenticationStub,
        "findAll"
      );
      await sut.getByUsername("any_username");

      expect(findAllSpy).toBeCalledWith({
        where: {
          username: "any_username",
        },
      });
      expect(findAllAuthenticationSpy).toBeCalledWith({
        where: {
          userId: "any_userId",
        },
      });
    });

    test("should return null case User doesn't find", async () => {
      const { sut, userStub } = makeSut();
      const findAllSpy = jest.spyOn(userStub, "findAll");
      findAllSpy.mockReturnValue(
        Promise.resolve({
          at: (ky) => null as any,
          map: (elm: { dataValues: UserModel }) => [],
        })
      );

      const result = await sut.getByUsername("any_username");
      expect(result).toBeNull();
    });

    test("should return user on success", async () => {
      const { sut } = makeSut();
      const result = await sut.getByUsername("any_username");
      expect(result).toEqual(createUserWithAuthenticationMockedModel());
    });
  });

  describe("#getByPasswordRecoveryToken", () => {
    test("should call User.findAll and Authentication.findAll correctly", async () => {
      const { sut, userStub, authenticationStub } = makeSut();
      const findAllSpy = jest.spyOn(userStub, "findAll");
      const findAllAuthenticationSpy = jest.spyOn(
        authenticationStub,
        "findAll"
      );
      await sut.getByPasswordRecoveryToken("any_passwordRecoveryToken");

      expect(findAllSpy).toBeCalledWith({
        where: {
          passwordRecoveryToken: "any_passwordRecoveryToken",
        },
      });
      expect(findAllAuthenticationSpy).toBeCalledWith({
        where: {
          userId: "any_userId",
        },
      });
    });

    test("should return null case User doesn't find", async () => {
      const { sut, userStub } = makeSut();
      const findAllSpy = jest.spyOn(userStub, "findAll");
      findAllSpy.mockReturnValue(
        Promise.resolve({
          at: (ky) => null as any,
          map: (elm: { dataValues: UserModel }) => [],
        })
      );

      const result = await sut.getByPasswordRecoveryToken(
        "any_passwordRecoveryToken"
      );
      expect(result).toBeNull();
    });

    test("should return user on success", async () => {
      const { sut } = makeSut();
      const result = await sut.getByPasswordRecoveryToken(
        "any_passwordRecoveryToken"
      );
      expect(result).toEqual(createUserWithAuthenticationMockedModel());
    });
  });

  describe("#getByCode", () => {
    test("should call User.findAll and Authentication.findAll correctly", async () => {
      const { sut, userStub, authenticationStub } = makeSut();
      const findAllSpy = jest.spyOn(userStub, "findAll");
      const findAllAuthenticationSpy = jest.spyOn(
        authenticationStub,
        "findAll"
      );
      await sut.getByCode("any_code");

      expect(findAllAuthenticationSpy).toBeCalledWith({
        where: {
          code: "any_code",
        },
      });
      expect(findAllSpy).toBeCalledWith({
        where: {
          userId: "any_userId",
        },
      });
    });

    test("should return null case User doesn't find", async () => {
      const { sut, authenticationStub } = makeSut();
      const findAllSpy = jest.spyOn(authenticationStub, "findAll");
      findAllSpy.mockReturnValue(
        Promise.resolve({
          at: (ky) => null as any,
          map: (elm: { dataValues: AuthenticationModel }) => [],
        })
      );

      const result = await sut.getByCode("any_code");
      expect(result).toBeNull();
    });

    test("should return user on success", async () => {
      const { sut } = makeSut();
      const result = await sut.getByCode("any_code");
      expect(result).toEqual(createUserWithAuthenticationMockedModel());
    });
  });

  describe("#getByToken", () => {
    test("should call User.findAll and Authentication.findAll correctly", async () => {
      const { sut, userStub, authenticationStub } = makeSut();
      const findAllSpy = jest.spyOn(userStub, "findAll");
      const findAllAuthenticationSpy = jest.spyOn(
        authenticationStub,
        "findAll"
      );
      await sut.getByToken("any_token");

      expect(findAllAuthenticationSpy).toBeCalledWith({
        where: {
          token: "any_token",
        },
      });
      expect(findAllSpy).toBeCalledWith({
        where: {
          userId: "any_userId",
        },
      });
    });

    test("should return null case User doesn't find", async () => {
      const { sut, authenticationStub } = makeSut();
      const findAllSpy = jest.spyOn(authenticationStub, "findAll");
      findAllSpy.mockReturnValue(
        Promise.resolve({
          at: (ky) => null as any,
          map: (elm: { dataValues: AuthenticationModel }) => [],
        })
      );

      const result = await sut.getByToken("any_token");
      expect(result).toBeNull();
    });

    test("should return user on success", async () => {
      const { sut } = makeSut();
      const result = await sut.getByToken("any_token");
      expect(result).toEqual(createUserWithAuthenticationMockedModel());
    });
  });

  describe("#getByEmailValidationToken", () => {
    test("should call User.findAll and Authentication.findAll correctly", async () => {
      const { sut, userStub, authenticationStub } = makeSut();
      const findAllSpy = jest.spyOn(userStub, "findAll");
      const findAllAuthenticationSpy = jest.spyOn(
        authenticationStub,
        "findAll"
      );
      await sut.getByEmailValidationToken("any_emailValidationToken");

      expect(findAllSpy).toBeCalledWith({
        where: {
          emailValidationToken: "any_emailValidationToken",
        },
      });
      expect(findAllAuthenticationSpy).toBeCalledWith({
        where: {
          userId: "any_userId",
        },
      });
    });

    test("should return null case User doesn't find", async () => {
      const { sut, userStub } = makeSut();
      const findAllSpy = jest.spyOn(userStub, "findAll");
      findAllSpy.mockReturnValue(
        Promise.resolve({
          at: (ky) => null as any,
          map: (elm: { dataValues: UserModel }) => [],
        })
      );

      const result = await sut.getByEmailValidationToken(
        "any_emailValidationToken"
      );
      expect(result).toBeNull();
    });

    test("should return user on success", async () => {
      const { sut } = makeSut();
      const result = await sut.getByEmailValidationToken(
        "any_emailValidationToken"
      );
      expect(result).toEqual(createUserWithAuthenticationMockedModel());
    });
  });
});
