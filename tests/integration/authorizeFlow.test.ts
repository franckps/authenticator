import request from "supertest";
import app from "../../src/server";
import { SendRecoveryTokenEmail } from "../../src/utils/sendRecoveryTokenEmail";

const spySendRecovery = jest.spyOn(
  SendRecoveryTokenEmail.prototype,
  "sendRecovery"
);

let code: string = "";
let token: string = "";
let passwordRecoveryLink: string = "";

describe("Integration", () => {
  describe("Authorize flow", () => {
    test("Should create user correctly", async () => {
      const result = await request(app)
        .post("/api/v1/register")
        .send({
          username: "any_username5",
          password: "any_encryptedPassword",
          email: "any_email",
          image: "any_image",
          createdAt: "any_createdAt",
          updatedAt: "any_updatedAt",
          authentication: {
            code: "any_code",
            codeExpiresIn: 1,
            token: "any_token",
            createdAt: "any_createdAt",
            expiresIn: 1,
            isActive: true,
          },
          callback: "/callback",
        })
        .set("Accept", "application/json");
      expect(result.status).toEqual(302);
      expect(result.header.location).toMatch("/callback?code=");
    });

    test("Should authenticate user correctly", async () => {
      const result = await request(app)
        .post("/api/v1/logon")
        .send({
          username: "any_username5",
          password: "any_encryptedPassword",
          callback: "/callback",
        })
        .set("Accept", "application/json");
      code = result.header.location.replace("/callback?code=", "");
      expect(result.status).toEqual(302);
      expect(result.header.location).toMatch("/callback?code=");
    });

    test("Should get token correctly", async () => {
      console.log({ code });
      const result = await request(app)
        .post("/api/v1/token")
        .set("Content-Type", "application/json")
        .send({
          code: code,
        })
        .set("Accept", "application/json");
      token = result.body.token;
      console.log({ token });
      expect(result.status).toEqual(200);
      expect(result.body.token).not.toBeNull();
      expect(result.body.createdAt).not.toBeNull();
      expect(result.body.expiresIn).not.toBeNull();
    });

    test("Should authorize correctly", async () => {
      console.log({ code });
      const result = await request(app)
        .post("/api/v1/auth")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .send()
        .set("Accept", "application/json");

      expect(result.status).toEqual(200);
    });

    test("Should get user correctly by token", async () => {
      const result = await request(app)
        .post("/api/v1/me")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .send()
        .set("Accept", "application/json");

      expect(result.status).toEqual(200);

      expect(result.body.username).toEqual("any_username5");
      expect(result.body.email).toEqual("any_email");
      expect(result.body.image).toEqual("any_image");
      expect(result.body.password).toBeNull();
    });
  });
  describe("Password recovery flow", () => {
    test("should send password recovery link correctly", async () => {
      spySendRecovery.mockImplementation(
        (data: any, passwordRecovery: string) => {
          passwordRecoveryLink = passwordRecovery;
          return Promise.resolve();
        }
      );
      const result = await request(app)
        .post("/api/v1/password/recovery")
        .send({
          username: "any_username5",
        })
        .set("Accept", "application/json");
      console.log({ passwordRecoveryLink });
      expect(result.status).toEqual(200);
    });

    test("should do password recovery correctly", async () => {
      const result = await request(app)
        .post("/api/v1/password/" + passwordRecoveryLink)
        .send({
          callback: "/callback",
          password: "any_encryptedPassword",
        })
        .set("Accept", "application/json");
      code = result.header.location.replace("/callback?code=", "");
      expect(result.status).toEqual(302);
      expect(result.header.location).toMatch("/callback?code=");
    });
  });
});
