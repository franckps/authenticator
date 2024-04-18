import { createTransport } from "nodemailer";
import { User } from "../models/User";
import { EmailVerification } from "../interfaces/utils";

export class EmailVerificationImpl implements EmailVerification {
  constructor(
    config: {
      service: string;
      authUser: string;
      authPassword: string;
      from: string;
    },
    serviceURL: string
  ) {
    this.mailConfig = {
      host: config.service,
      port: 587,
      tls: {
        rejectUnauthorized: true,
        minVersion: "TLSv1.2",
      },
      auth: {
        user: config.authUser,
        pass: config.authPassword,
      },
    };
    this.from = config.from;
    this.serviceURL = serviceURL;
  }

  private mailConfig:
    | {
        host: string;
        port: number;
        tls: {
          rejectUnauthorized: boolean;
          minVersion: string;
        };
        auth: {
          user: string;
          pass: string;
        };
      }
    | undefined;
  private from: string | undefined;
  private subject: string = "Password recovery";
  private serviceURL: string = "";

  verify(
    user: User,
    passwordRecoveryToken: string,
    callback: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const transporter = createTransport(this.mailConfig as any);
      const mailOptions = {
        from: this.from,
        to: user.email,
        subject: this.subject,
        text: this.serviceURL + passwordRecoveryToken + "?callback=" + callback,
      };
      transporter.sendMail(mailOptions, (err, _) => {
        if (!!err) return reject(err);

        return resolve();
      });
    });
  }
}
