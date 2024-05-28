import express from "express";
import {
  makeAuthenticateService,
  makeCreateUserService,
  makeGetTokenByCodeService,
  makeAuthorizeService,
  makeRecoveryPasswordService,
  makeNewPasswordDefinitionService,
  makeGetUserByTokenService,
  makeEmailValidationService,
  makeRemoveAuthentication,
} from "./factories/servicesFactories";
import { errorHandlerExpressCbk } from "./helpers/errorHandlerExpressCbk";
import path from "path";
const app = express();

app.use(express.json());
app.use(express.urlencoded());

const createUserService = makeCreateUserService();
const getTokenByCodeService = makeGetTokenByCodeService();
const authenticateService = makeAuthenticateService();
const authorizeService = makeAuthorizeService();
const recoveryPasswordService = makeRecoveryPasswordService();
const newPasswordDefinitionService = makeNewPasswordDefinitionService();
const getUserByTokenService = makeGetUserByTokenService();
const emailValidationService = makeEmailValidationService();
const removeAuthenticationService = makeRemoveAuthentication();

app.post(
  "/api/v1/register",
  errorHandlerExpressCbk(async (req, res) => {
    console.log(req.body);
    await createUserService.execute(req.body, req.body.callback);
    return res.send();
  })
);

app.get(
  "/api/v1/register/validation/:validationToken",
  errorHandlerExpressCbk(async (req, res) => {
    const result = await emailValidationService.execute(
      req.params.validationToken,
      req.query.callback as any
    );
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
  "/api/v1/logout",
  errorHandlerExpressCbk(async (req, res) => {
    const result = await removeAuthenticationService.execute(
      req.headers.authorization,
      req.body
    );
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
    await recoveryPasswordService.execute(req.body.username, req.body.callback);
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
