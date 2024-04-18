import { EmailVerificationImpl } from "../../src/utils/emailVerificationImpl";

import nodemailer from "nodemailer";
const spyCreateTransport = jest.spyOn(nodemailer, "createTransport");
const sendMail = jest.fn();
sendMail.mockImplementation((config: any, cbk: (err: any, data: any) => void) =>
  cbk(undefined, { response: "success" })
);
spyCreateTransport.mockImplementation(
  (config: any) =>
    ({
      sendMail,
    } as any)
);

interface SutTypes {
  sut: EmailVerificationImpl;
}

const makeSut = (): SutTypes => {
  const sut = new EmailVerificationImpl(
    {
      service: "any_service",
      authUser: "any_email",
      authPassword: "any_password",
      from: "any_email",
    },
    "any_url"
  );

  return { sut };
};

describe("#EmailVerificationImpl", () => {
  test("Should call createTransport correctly", async () => {
    const { sut } = makeSut();

    await sut.verify(
      {
        username: "any_username",
        email: "other_email",
        image: "any_image",
        createdAt: "any_createdAt",
        updatedAt: "any_updatedAt",
      },
      "any_passwordRecoveryToken",
      "any_callback"
    );
    expect(spyCreateTransport).toBeCalledWith({
      auth: {
        user: "any_email",
        pass: "any_password",
      },
      host: "any_service",
      port: 587,
      tls: {
        minVersion: "TLSv1.2",
        rejectUnauthorized: true,
      },
    });
  });
  test("Should call sendMail correctly", async () => {
    const { sut } = makeSut();
    await sut.verify(
      {
        username: "any_username",
        email: "other_email",
        image: "any_image",
        createdAt: "any_createdAt",
        updatedAt: "any_updatedAt",
      },
      "any_passwordRecoveryToken",
      "any_callback"
    );
    expect(sendMail).toBeCalledWith(
      {
        from: "any_email",
        to: "other_email",
        subject: "Password recovery",
        text: "any_urlany_passwordRecoveryToken?callback=any_callback",
      },
      expect.any(Function)
    );
  });
  test("Should reject case sendMail return error", async () => {
    const { sut } = makeSut();
    sendMail.mockImplementationOnce(
      (config: any, cbk: (err: any, data: any) => void) =>
        cbk(new Error("any_error"), "")
    );
    try {
      await sut.verify(
        {
          username: "any_username",
          email: "other_email",
          image: "any_image",
          createdAt: "any_createdAt",
          updatedAt: "any_updatedAt",
        },
        "any_passwordRecoveryToken",
        "any_callback"
      );
      expect(false).toBeTruthy();
    } catch (err: any) {
      expect(err.message).toEqual("any_error");
    }
  });
  test("Should resolve on success", async () => {
    const { sut } = makeSut();
    const promise = sut.verify(
      {
        username: "any_username",
        email: "other_email",
        image: "any_image",
        createdAt: "any_createdAt",
        updatedAt: "any_updatedAt",
      },
      "any_passwordRecoveryToken",
      "any_callback"
    );
    expect(promise).resolves;
  });
});
