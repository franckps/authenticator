import { UserValidator } from "../../src/utils/userValidator";

interface SutTypes {
  sut: UserValidator;
}

const makeSut = (): SutTypes => {
  const sut = new UserValidator();
  return { sut };
};

describe("#UserValidator", () => {
  test("Should fail case username be not present", () => {
    const { sut } = makeSut();
    try {
      sut.validate({
        username: "",
        password: "any_password",
        email: "any_email",
      });
      expect(false).toBeTruthy();
    } catch (err: any) {
      expect(err.message).toEqual("username can't be empty");
    }
  });
  test("Should fail case password be not present", () => {
    const { sut } = makeSut();
    try {
      sut.validate({
        username: "any_username",
        password: "",
        email: "any_email",
      });
      expect(false).toBeTruthy();
    } catch (err: any) {
      expect(err.message).toEqual("password can't be empty");
    }
  });
  test("Should fail case email be not present", () => {
    const { sut } = makeSut();
    try {
      sut.validate({
        username: "any_username",
        password: "any_password",
        email: "",
      });
      expect(false).toBeTruthy();
    } catch (err: any) {
      expect(err.message).toEqual("email can't be empty");
    }
  });
  test("Should return true case everithing be ok", () => {
    const { sut } = makeSut();
    const result = sut.validate({
      username: "any_username",
      password: "any_password",
      email: "any_email",
    });
    expect(result).toBeTruthy();
  });
});
