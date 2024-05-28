import { NextFunction, Request, Response } from "express";

export const errorHandlerExpressCbk =
  (
    cbk: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ): ((req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cbk(req, res, next);
    } catch (err: any) {
      console.log(err);
      res.status(400);
      if (!!req.query?.error_callback)
        return res.redirect(
          req.query.error_callback + "?message=" + err.message
        );
      res.json({ message: err.message });
    }
  };
