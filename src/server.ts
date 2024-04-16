import express from "express";
import {
  makeAuthenticateService,
  makeCreateUserService,
  makeGetTokenByCodeService,
  makeAuthorizeService,
  makeRecoveryPasswordService,
  makeNewPasswordDefinitionService,
  makeGetUserByTokenService,
} from "./factories/servicesFactories";
import { errorHandlerExpressCbk } from "./helpers/errorHandlerExpressCbk";
const app = express();

app.use(express.json());

const createUserService = makeCreateUserService();
const getTokenByCodeService = makeGetTokenByCodeService();
const authenticateService = makeAuthenticateService();
const authorizeService = makeAuthorizeService();
const recoveryPasswordService = makeRecoveryPasswordService();
const newPasswordDefinitionService = makeNewPasswordDefinitionService();
const getUserByTokenService = makeGetUserByTokenService();

app.post(
  "/api/v1/register",
  errorHandlerExpressCbk(async (req, res) => {
    const result = await createUserService.execute(req.body, req.body.callback);
    return res.redirect(result);
  })
);

app.post(
  "/api/v1/token",
  errorHandlerExpressCbk(async (req, res) => {
    const result = await getTokenByCodeService.execute(req.body.code);
    return res.send(result);
  })
);

app.post(
  "/api/v1/logon",
  errorHandlerExpressCbk(async (req, res) => {
    const result = await authenticateService.execute(req.body);
    res.redirect(result);
  })
);

app.post(
  "/api/v1/auth",
  errorHandlerExpressCbk(async (req, res) => {
    await authorizeService.execute(req.headers.authorization);
    res.send();
  })
);

app.post(
  "/api/v1/password/recovery",
  errorHandlerExpressCbk(async (req, res) => {
    await recoveryPasswordService.execute(req.body.username);
    res.send();
  })
);

app.post(
  "/api/v1/password/:recoveryToken",
  errorHandlerExpressCbk(async (req, res) => {
    const result = await newPasswordDefinitionService.execute(
      req.params.recoveryToken,
      req.body.password,
      req.body.callback
    );
    res.redirect(result);
  })
);

app.post(
  "/api/v1/me",
  errorHandlerExpressCbk(async (req, res) => {
    const result = await getUserByTokenService.execute(
      req.headers.authorization
    );
    res.json(result);
  })
);

export default app;
