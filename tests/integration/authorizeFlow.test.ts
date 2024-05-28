//import "dotenv/config";
import request from "supertest";
import app from "../../src/server";
import { SendRecoveryTokenEmail } from "../../src/utils/sendRecoveryTokenEmail";
import { EmailVerificationImpl } from "../../src/utils/emailVerificationImpl";

const spySendRecovery = jest.spyOn(
  SendRecoveryTokenEmail.prototype,
  "sendRecovery"
);
const spyVerify = jest.spyOn(EmailVerificationImpl.prototype, "verify");

let code: string = "";
let token: string = "";
let passwordRecoveryLink: string = "";
let emailRecoveryLink: string = "";

describe("Integration", () => {
  describe("Authorize flow", () => {
    test("Should create user correctly", async () => {
      spyVerify.mockImplementation(
        (user: any, token: string, callback: string) => {
          emailRecoveryLink = token;
          return Promise.resolve();
        }
      );
      const result = await request(app)
        .post("/api/v1/register")
        .set("Accept", "application/json")
        .send({
          username: "any_username5",
          password: "any_encryptedPassword",
          email: "any_email",
          image: "any_image",
          createdAt: "any_createdAt",
          updatedAt: "any_updatedAt",
          callback: "/callback",
        });
      expect(result.status).toEqual(200);
    });

    test("Should activate email correctly", async () => {
      const result = await request(app)
        .get(
          "/api/v1/register/validation/" +
            emailRecoveryLink +
            "?callback=/callback" +
            code
        )
        .set("Accept", "application/json");
      code = result.header.location.replace("/callback?code=", "");
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
      const result = await request(app)
        .post("/api/v1/token")
        .set("Content-Type", "application/json")
        .send({
          code: code,
        })
        .set("Accept", "application/json");
      token = result.body.token;
      expect(result.status).toEqual(200);
      expect(result.body.token).not.toBeNull();
      expect(result.body.createdAt).not.toBeNull();
      expect(result.body.expiresIn).not.toBeNull();
    });

    test("Should authorize correctly", async () => {
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
      expect(result.body.password).toBeUndefined();
    });

    test("Should remove authentication correctly", async () => {
      const result = await request(app)
        .post("/api/v1/logout")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .send({
          callback: "/callback",
        })
        .set("Accept", "application/json");

      const result2 = await request(app)
        .post("/api/v1/me")
        .set("Content-Type", "application/json")
        .set("Authorization", token)
        .send()
        .set("Accept", "application/json");

      expect(result.status).toEqual(302);
      expect(result.header.location).toMatch("/callback");
      expect(result2.status).toEqual(400);
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
  describe("Errors", () => {
    test("Should redirect to errorCallback on register error", async () => {
      spyVerify.mockImplementation(
        (user: any, token: string, callback: string) => {
          emailRecoveryLink = token;
          return Promise.resolve();
        }
      );
      const result = await request(app)
        .post("/api/v1/register?error_callback=error_callback")
        .set("Accept", "application/json")
        .send({
          username: "any_username5",
          password: "any_encryptedPassword",
          email: "any_email",
          image: "any_image",
          createdAt: "any_createdAt",
          updatedAt: "any_updatedAt",
          callback: "/callback",
        });
      expect(result.status).toEqual(302);
      expect(result.header.location).toMatch(
        "error_callback?message=User%20already%20registered"
      );
    });

    test("Should redirect to errorCallback on logon error", async () => {
      const result = await request(app)
        .post("/api/v1/logon?error_callback=error_callback")
        .send({
          username: "invalid_username5",
          password: "any_encryptedPassword",
          callback: "/callback",
        })
        .set("Accept", "application/json");
      expect(result.status).toEqual(302);
      expect(result.header.location).toMatch(
        "error_callback?message=Invalid%20username%20or%20password"
      );
    });

    test("Should return error on logon error when no callback be provided", async () => {
      const result = await request(app)
        .post("/api/v1/logon")
        .send({
          username: "invalid_username5",
          password: "any_encryptedPassword",
          callback: "/callback",
        })
        .set("Accept", "application/json");
      expect(result.status).toEqual(400);
      expect(result.body.message).toMatch("Invalid username or password");
    });
  });
});
