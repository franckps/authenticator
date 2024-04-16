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
const app = express();

app.use(express.json());

const createUserService = makeCreateUserService();
const getTokenByCodeService = makeGetTokenByCodeService();
const authenticateService = makeAuthenticateService();
const authorizeService = makeAuthorizeService();
const recoveryPasswordService = makeRecoveryPasswordService();
const newPasswordDefinitionService = makeNewPasswordDefinitionService();
const getUserByTokenService = makeGetUserByTokenService();

app.post("/api/v1/register", async (req, res) => {
  const result = await createUserService.execute(req.body, req.body.callback);
  return res.redirect(result);
});

app.post("/api/v1/token", async (req, res) => {
  const result = await getTokenByCodeService.execute(req.body.code);
  return res.send(result);
});

app.post("/api/v1/logon", async (req, res) => {
  const result = await authenticateService.execute(req.body);
  res.redirect(result);
});

app.post("/api/v1/auth", async (req, res) => {
  await authorizeService.execute(req.headers.authorization);
  res.send();
});

app.post("/api/v1/password/recovery", async (req, res) => {
  await recoveryPasswordService.execute(req.body.username);
  res.send();
});

app.post("/api/v1/password/:recoveryToken", async (req, res) => {
  const result = await newPasswordDefinitionService.execute(
    req.params.recoveryToken,
    req.body.password,
    req.body.callback
  );
  res.redirect(result);
});

app.post("/api/v1/me", async (req, res) => {
  const result = await getUserByTokenService.execute(req.headers.authorization);
  res.json(result);
});

export default app;
