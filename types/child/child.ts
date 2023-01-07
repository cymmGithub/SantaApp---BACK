import { GiftEntity } from "../gift";
import { ChildEntity } from "./child.entity";

export interface GetAllChildRes {
  childrenList: ChildEntity[];
  giftList: GiftEntity[];
}

export type CreateChildReq = Omit<ChildEntity, "id">;

export interface SetGiftForChildReq {
  giftId: string;
}
