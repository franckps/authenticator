import { createTransport } from "nodemailer";
import { User } from "../models/User";
import { SendRecoveryToken } from "../interfaces/utils";

export class SendRecoveryTokenEmail implements SendRecoveryToken {
  constructor(config: {
    service: string;
    authUser: string;
    authPassword: string;
    from: string;
  }) {
    this.mailConfig = {
      service: config.service,
      auth: {
        user: config.authUser,
        pass: config.authPassword,
      },
    };
    this.from = config.from;
  }

  private mailConfig:
    | {
        service: string;
        auth: {
          user: string;
          pass: string;
        };
      }
    | undefined;
  private from: string | undefined;
  private subject: string = "Password recovery";

  sendRecovery(user: User, passwordRecoveryToken: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(createTransport);
      const transporter = createTransport(this.mailConfig);
      const mailOptions = {
        from: this.from,
        to: user.email,
        subject: this.subject,
        text: passwordRecoveryToken,
      };
      transporter.sendMail(mailOptions, (err, _) => {
        if (!!err) return reject(err);

        return resolve();
      });
    });
  }
}