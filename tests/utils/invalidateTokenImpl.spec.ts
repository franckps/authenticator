import { InvalidateTokenImpl } from "../../src/utils/invalidateTokenImpl";

interface SutTypes {
  sut: InvalidateTokenImpl;
}

const makeSut = (): SutTypes => {
  const sut = new InvalidateTokenImpl();

  return { sut };
};

describe("#InvalidateTokenImpl", () => {
  test("Should return correct data", () => {
    const { sut } = makeSut();
    const data = {
      userId: "any_userId",
      code: "1234",
      codeExpiresIn: 1,
      token: "321",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresIn: 10000,
      isActive: true,
    };
    const result = sut.invalidate(data);
    expect(result.code).toEqual(data.code);
    expect(result.codeExpiresIn).toEqual(data.codeExpiresIn);
    expect(result.createdAt).toEqual(data.createdAt);
    expect(result.updatedAt).toEqual(data.updatedAt);
    expect(result.token).toEqual(data.token);
    expect(result.expiresIn).toEqual(data.expiresIn);
    expect(result.isActive).not.toEqual(data.isActive);
    expect(result.isActive).toBeFalsy();
  });
});
