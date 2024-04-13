import { User } from "../../models/User";
import { UserRepository } from "../../interfaces/repository";
import { ModelDefined } from "sequelize";
import { Authentication } from "../../models/Authentication";

export class UserRepositoryImpl implements UserRepository {
  constructor(
    private readonly user: ModelDefined<User, User>,
    private readonly authentication: ModelDefined<
      Authentication,
      Authentication
    >
  ) {}

  async create(user: User): Promise<void> {
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
    let authentication = user.authentication;
    if (!authentication)
      authentication = {
        code: "",
        codeExpiresIn: 0,
        token: "",
        createdAt: new Date().toISOString(),
        expiresIn: 0,
        isActive: false,
      };
    authentication.userId = userData.dataValues.userId;
    await this.authentication.create(authentication);
  }
  async getByUsername(username: string): Promise<User> {
    const result = await this.user.findAll({
      where: {
        username,
      },
    });

    if (!result.at(0)) return null as any;

    const authenticate = await this.authentication.findAll({
      where: {
        userId: result.at(0)?.dataValues.userId,
      },
    });

    return {
      ...(result.at(0)?.dataValues as any),
      authentication: {
        code: authenticate.at(0)?.dataValues.code,
        codeExpiresIn: authenticate.at(0)?.dataValues.codeExpiresIn,
        token: authenticate.at(0)?.dataValues.token,
        createdAt: authenticate.at(0)?.dataValues.createdAt,
        expiresIn: authenticate.at(0)?.dataValues.expiresIn,
        isActive: authenticate.at(0)?.dataValues.isActive,
      },
    };
  }
  async updateByUsername(username: string, user: User): Promise<void> {
    const userData = await this.user.findAll({
      where: {
        username,
      },
    });

    if (!userData || !userData.at(0)) return null as any;

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

    await this.authentication.update(
      {
        code: user.authentication?.code,
        codeExpiresIn: user.authentication?.codeExpiresIn,
        token: user.authentication?.token,
        createdAt: user.authentication?.createdAt,
        expiresIn: user.authentication?.expiresIn,
        isActive: user.authentication?.isActive,
      },
      {
        where: {
          userId: userData.at(0)?.dataValues.userId,
        },
      }
    );
  }
  async getByToken(token: string): Promise<User> {
    const result = await this.authentication.findAll({
      where: {
        token,
      },
    });

    if (!result.at(0)) return null as any;

    const userData = await this.user.findAll({
      where: {
        userId: result.at(0)?.dataValues.userId,
      },
    });

    return {
      ...(userData.at(0)?.dataValues as any),
      authentication: {
        code: result.at(0)?.dataValues.code,
        codeExpiresIn: result.at(0)?.dataValues.codeExpiresIn,
        token: result.at(0)?.dataValues.token,
        createdAt: result.at(0)?.dataValues.createdAt,
        expiresIn: result.at(0)?.dataValues.expiresIn,
        isActive: result.at(0)?.dataValues.isActive,
      },
    };
  }
  async getByPasswordRecoveryToken(token: string): Promise<User> {
    const result = await this.user.findAll({
      where: {
        passwordRecoveryToken: token,
      },
    });

    if (!result.at(0)) return null as any;

    const authenticate = await this.authentication.findAll({
      where: {
        userId: result.at(0)?.dataValues.userId,
      },
    });

    return {
      ...(result.at(0)?.dataValues as any),
      authentication: {
        code: authenticate.at(0)?.dataValues.code,
        codeExpiresIn: authenticate.at(0)?.dataValues.codeExpiresIn,
        token: authenticate.at(0)?.dataValues.token,
        createdAt: authenticate.at(0)?.dataValues.createdAt,
        expiresIn: authenticate.at(0)?.dataValues.expiresIn,
        isActive: authenticate.at(0)?.dataValues.isActive,
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

    const userData = await this.user.findAll({
      where: {
        userId: result.at(0)?.dataValues.userId,
      },
    });

    return {
      ...(userData.at(0)?.dataValues as any),
      authentication: {
        code: result.at(0)?.dataValues.code,
        codeExpiresIn: result.at(0)?.dataValues.codeExpiresIn,
        token: result.at(0)?.dataValues.token,
        createdAt: result.at(0)?.dataValues.createdAt,
        expiresIn: result.at(0)?.dataValues.expiresIn,
        isActive: result.at(0)?.dataValues.isActive,
      },
    };
  }
}
