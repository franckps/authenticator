import { PasswordRecoveryGenerateImpl } from "../../src/utils/passwordRecoveryGenerateImpl";

interface SutTypes {
  sut: PasswordRecoveryGenerateImpl;
}

const makeSut = (): SutTypes => {
  const sut = new PasswordRecoveryGenerateImpl();

  return { sut };
};

describe("#PasswordRecoveryGenerateImpl", () => {
  test("Should return correct data", () => {
    const { sut } = makeSut();
    const result = sut.generateRecovery();
    const result2 = sut.generateRecovery();
    expect(result.passwordRecoveryToken).not.toEqual(
      result2.passwordRecoveryToken
    );
    expect(result.passwordRecoveryExpiresIn).toEqual(
      result2.passwordRecoveryExpiresIn
    );
    expect(result.passwordRecoveryExpiresIn).toEqual(300000);
  });
});
