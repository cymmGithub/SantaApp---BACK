import { Request, Response, Router } from "express";
import { GiftRecord } from "../records/gift.record";
import { CreateGiftReq, GetSingleGiftRes, GiftEntity } from "../types";
import { ValidationError } from "../utils/error";

export const giftRouter = Router();

giftRouter

  .get("/", async (req: Request, res: Response): Promise<void> => {
    const giftList = await GiftRecord.listAll();

    res.json({
      giftList,
    });
  })

  .get("/:giftId", async (req: Request, res: Response): Promise<void> => {
    const gift = await GiftRecord.getOne(req.params.giftId);
    const givenCount = await gift.countGivenGifts();

    res.json({
      gift,
      givenCount,
    } as GetSingleGiftRes);
  })
  .delete("/:id", async (req, res) => {
    const gift = await GiftRecord.getOne(req.params.id);
    const givenCount = await gift.countGivenGifts();

    if (!gift) {
      throw new ValidationError("There is no such gift in stock!");
    }

    if ((await gift.countGivenGifts()) > 0) {
      throw new ValidationError(
        "Selected gift is already given, You can not remove it!"
      );
    }
    await gift.delete();
    res.end();
  })
  .post("/", async (req: Request, res: Response): Promise<void> => {
    const newGift = new GiftRecord(req.body as CreateGiftReq);
    await newGift.insert();

    res.json(newGift);
  });
