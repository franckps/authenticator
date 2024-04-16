import { errorHandlerExpressCbk } from "../../src/helpers/errorHandlerExpressCbk";

describe("errorHandlerExpressCbk", () => {
  test("Should call callback correctly", async () => {
    const cbk = jest.fn();
    errorHandlerExpressCbk(cbk)(
      "any_request" as any,
      "any_response" as any,
      "any_next" as any
    );
    expect(cbk).toHaveBeenCalledWith("any_request", "any_response", "any_next");
  });
  test("Should call response correctly case callback fail", async () => {
    const cbk = jest.fn();
    const spyStatus = jest.fn();
    const spyJson = jest.fn();
    cbk.mockImplementation(() => {
      throw new Error("any_error");
    });
    errorHandlerExpressCbk(cbk)(
      "any_request" as any,
      { status: spyStatus, json: spyJson } as any,
      "any_next" as any
    );
    expect(spyStatus).toHaveBeenCalledWith(400);
    expect(spyJson).toHaveBeenCalledWith({ message: "any_error" });
  });
});
