import { TokenValidatorImpl } from "../../src/utils/tokenValidatorImpl";

interface SutTypes {
  sut: TokenValidatorImpl;
}

const createSut = (): SutTypes => {
  const sut = new TokenValidatorImpl();

  return { sut };
};

describe("#TokenValidatorImpl", () => {
  test("Should return false case is active status be false", () => {
    const { sut } = createSut();

    const result = sut.validateTokenData({
      code: "1234",
      codeExpiresIn: 1,
      token: "321",
      createdAt: new Date().toISOString(),
      expiresIn: 10000,
      isActive: false,
    });

    expect(result).toBeFalsy();
  });
  test("Should return false case expiresIn be less than creation date minus current date", () => {
    const { sut } = createSut();

    const result = sut.validateTokenData({
      code: "1234",
      codeExpiresIn: 1,
      token: "321",
      createdAt: new Date().toISOString(),
      expiresIn: -10000,
      isActive: true,
    });

    expect(result).toBeFalsy();
  });
  test("Should return true case everithing ok", () => {
    const { sut } = createSut();

    const result = sut.validateTokenData({
      code: "1234",
      codeExpiresIn: 1,
      token: "321",
      createdAt: new Date().toISOString(),
      expiresIn: 10000,
      isActive: true,
    });

    expect(result).toBeTruthy();
  });
});
