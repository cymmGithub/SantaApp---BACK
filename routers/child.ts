import { Router } from 'express';
import { ChildRecord } from '../records/child.record';
import { GiftRecord } from '../records/gift.record';
import { CreateChildReq, GetAllChildRes, SetGiftForChildReq } from '../types';
import { ValidationError } from '../utils/error';

export const childRouter = Router();

childRouter

  .get('/', async (req, res) => {

    const childrenList = await ChildRecord.listAll();


    const giftList = await GiftRecord.listAll();

    res.json({
      childrenList,
      giftList,
    } as GetAllChildRes);
  })
  .post('/', async (req, res) => {
    const data = req.body;
    const newChild = new ChildRecord(data as CreateChildReq);
    await newChild.insert();
    res.json(newChild);
  })
  .patch('/gift/:childId', async (req, res) => {
    const { body }: {
      body: SetGiftForChildReq;
    } = req;

    const foundChild = await ChildRecord.getOne(req.params.childId);
    if (foundChild === null) {
      throw new ValidationError('Child with given id was not found');
    }
    const gift = body.giftId === '' ? null : await GiftRecord.getOne(body.giftId);

    foundChild.giftId = gift === null ? null : gift.id;
    await foundChild.update();

    if (gift && gift.count < await gift.countGivenGifts()) {
      throw new ValidationError('This gift is out of stock');
    }

    res.json(foundChild);
  });

