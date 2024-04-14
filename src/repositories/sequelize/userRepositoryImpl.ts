import { User } from "../../models/User";
import { UserRepository } from "../../interfaces/repository";
import { ModelDefined } from "sequelize";
import { Authentication } from "../../models/Authentication";
import { randomUUID } from "crypto";

export class UserRepositoryImpl implements UserRepository {
  constructor(
    private readonly user: ModelDefined<User, User>,
    private readonly authentication: ModelDefined<
      Authentication,
      Authentication
    >
  ) {}

  async create(user: User): Promise<void> {
    user.userId = randomUUID();
    const userData = await this.user.create({
      userId: user.userId,
      username: user.username,
      password: user.password,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
    if (!userData || !userData.dataValues.userId)
      throw Error("Failure trying create user");
    let authentication = user.authentication as any;
    authentication.userId = userData.dataValues.userId;
    authentication.id = userData.dataValues.userId;
    await this.authentication.create(authentication);
  }
  async getByUsername(username: string): Promise<User> {
    const result = (await this.user.findAll({
      where: {
        username,
      },
    })) as any;

    if (!result.at(0)) return null as any;

    const authenticate = (await this.authentication.findAll({
      where: {
        userId: result.at(0).dataValues.userId,
      },
    })) as any;

    return {
      ...(result.at(0).dataValues as any),
      authentication: {
        code: authenticate.at(0).dataValues.code,
        codeExpiresIn: authenticate.at(0).dataValues.codeExpiresIn,
        token: authenticate.at(0).dataValues.token,
        createdAt: authenticate.at(0).dataValues.createdAt,
        updatedAt: authenticate.at(0).dataValues.updatedAt,
        expiresIn: authenticate.at(0).dataValues.expiresIn,
        isActive: authenticate.at(0).dataValues.isActive,
      },
    };
  }
  async updateByUsername(username: string, user: User): Promise<void> {
    const userData = (await this.user.findAll({
      where: {
        username,
      },
    })) as any;

    if (!userData || !userData.at(0)) return;

    await this.user.update(
      {
        password: user.password,
        email: user.email,
        image: user.image,
      },
      {
        where: {
          username,
        },
      }
    );

    if (!!user.authentication)
      await this.authentication.update(
        {
          code: user.authentication.code,
          codeExpiresIn: user.authentication.codeExpiresIn,
          token: user.authentication.token,
          createdAt: user.authentication.createdAt,
          updatedAt: user.authentication.updatedAt,
          expiresIn: user.authentication.expiresIn,
          isActive: user.authentication.isActive,
        },
        {
          where: {
            userId: userData.at(0).dataValues.userId,
          },
        }
      );
  }
  async getByToken(token: string): Promise<User> {
    const result = (await this.authentication.findAll({
      where: {
        token,
      },
    })) as any;

    if (!result.at(0)) return null as any;

    const userData = (await this.user.findAll({
      where: {
        userId: result.at(0).dataValues.userId,
      },
    })) as any;

    return {
      ...(userData.at(0).dataValues as any),
      authentication: {
        code: result.at(0).dataValues.code,
        codeExpiresIn: result.at(0).dataValues.codeExpiresIn,
        token: result.at(0).dataValues.token,
        createdAt: result.at(0).dataValues.createdAt,
        updatedAt: result.at(0).dataValues.updatedAt,
        expiresIn: result.at(0).dataValues.expiresIn,
        isActive: result.at(0).dataValues.isActive,
      },
    };
  }
  async getByPasswordRecoveryToken(token: string): Promise<User> {
    const result = (await this.user.findAll({
      where: {
        passwordRecoveryToken: token,
      },
    })) as any;

    if (!result.at(0)) return null as any;
    const authenticate = (await this.authentication.findAll({
      where: {
        userId: result.at(0).dataValues.userId,
      },
    })) as any;

    return {
      ...result.at(0).dataValues,
      authentication: {
        code: authenticate.at(0).dataValues.code,
        codeExpiresIn: authenticate.at(0).dataValues.codeExpiresIn,
        token: authenticate.at(0).dataValues.token,
        createdAt: authenticate.at(0).dataValues.createdAt,
        updatedAt: authenticate.at(0).dataValues.updatedAt,
        expiresIn: authenticate.at(0).dataValues.expiresIn,
        isActive: authenticate.at(0).dataValues.isActive,
      },
    };
  }
  async getByCode(code: string): Promise<User> {
    const result = await this.authentication.findAll({
      where: {
        code,
      },
    });

    if (!result.at(0)) return null as any;
    const authResult = result.at(0) as any;
    const userData = (await this.user.findAll({
      where: {
        userId: authResult.dataValues.userId,
      },
    })) as any;

    return {
      ...userData.at(0).dataValues,
      authentication: {
        code: authResult.dataValues.code,
        codeExpiresIn: authResult.dataValues.codeExpiresIn,
        token: authResult.dataValues.token,
        createdAt: authResult.dataValues.createdAt,
        updatedAt: authResult.dataValues.updatedAt,
        expiresIn: authResult.dataValues.expiresIn,
        isActive: authResult.dataValues.isActive,
      },
    };
  }
}
