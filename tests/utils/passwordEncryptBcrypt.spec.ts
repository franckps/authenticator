import { PasswordEncryptBcrypt } from "../../src/utils/passwordEncryptBcrypt";
import bcrypt from "bcrypt";
const spyGenSalt = jest.spyOn(bcrypt, "genSalt");
const spyHash = jest.spyOn(bcrypt, "hash");

interface SutTypes {
  sut: PasswordEncryptBcrypt;
}

const makeSut = (): SutTypes => {
  const sut = new PasswordEncryptBcrypt();
  return {
    sut,
  };
};

describe("#PasswordEncryptBcrypt", () => {
  test("Should call bcrypt genSalt correctly", async () => {
    const { sut } = makeSut();
    await sut.encrypt("any_password");
    expect(spyGenSalt).toBeCalledWith(10, "a", expect.any(Function));
  });
  test("Should call bcrypt hash correctly", async () => {
    const { sut } = makeSut();
    spyGenSalt.mockImplementation(
      (
        rounds: number,
        minor: "a" | "b",
        cbk: (err: Error | undefined, result: string) => any
      ) => cbk(undefined, "$2b$10$nknO4.Ev1XOOVncVFhHGW.")
    );
    await sut.encrypt("any_password");
    expect(spyHash).toBeCalledWith(
      "any_password",
      "$2b$10$nknO4.Ev1XOOVncVFhHGW.",
      expect.any(Function)
    );
  });
  test("Should reject case bcrypt genSalt return error", async () => {
    const { sut } = makeSut();
    spyGenSalt.mockImplementation(
      (
        rounds: number,
        minor: "a" | "b",
        cbk: (err: Error | undefined, result: string) => any
      ) => cbk(new Error("any_error"), "")
    );
    try {
      await sut.encrypt("any_password");
      expect(false).toBeTruthy();
    } catch (err: any) {
      expect(err.message).toEqual("any_error");
    }
  });
  test("Should return hash", async () => {
    const { sut } = makeSut();
    spyGenSalt.mockImplementation(
      (
        rounds: number,
        minor: "a" | "b",
        cbk: (err: Error | undefined, result: string) => any
      ) => cbk(undefined, "$2b$10$nknO4.Ev1XOOVncVFhHGW.")
    );
    spyHash.mockImplementation(
      (
        data: string | Buffer,
        salt: string | number,
        cbk: (err: Error | undefined, result: string) => any
      ) => cbk(undefined, "any_hash")
    );
    const result = await sut.encrypt("any_password");
    expect(result).toEqual("any_hash");
  });
  test("Should reject case hash return error", async () => {
    const { sut } = makeSut();
    spyGenSalt.mockImplementation(
      (
        rounds: number,
        minor: "a" | "b",
        cbk: (err: Error | undefined, result: string) => any
      ) => cbk(undefined, "$2b$10$nknO4.Ev1XOOVncVFhHGW.")
    );
    spyHash.mockImplementation(
      (
        data: string | Buffer,
        salt: string | number,
        cbk: (err: Error | undefined, result: string) => any
      ) => cbk(new Error("any_error"), "any_hash")
    );
    try {
      await sut.encrypt("any_password");
      expect(false).toBeTruthy();
    } catch (err: any) {
      expect(err.message).toEqual("any_error");
    }
  });
});
