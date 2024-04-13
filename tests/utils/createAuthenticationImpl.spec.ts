import { CreateAuthenticationImpl } from "../../src/utils/createAuthenticationImpl";

interface SutTypes {
  sut: CreateAuthenticationImpl;
}

const makeSut = (): SutTypes => {
  const sut = new CreateAuthenticationImpl();

  return { sut };
};

describe("#CreateAuthenticationImpl", () => {
  test("Should return correct data", () => {
    const { sut } = makeSut();
    const result = sut.create();
    const result2 = sut.create();
    expect(result.code).not.toEqual(result2.code);
    expect(result.codeExpiresIn).toEqual(result2.codeExpiresIn);
    expect(result.token).not.toEqual(result2.token);
    expect(result.expiresIn).toEqual(result2.expiresIn);
    expect(result.isActive).toEqual(result2.isActive);

    expect(result.expiresIn).toEqual(259200000);
    expect(result.codeExpiresIn).toEqual(30000);
    expect(result.isActive).toBeTruthy();
  });
});
