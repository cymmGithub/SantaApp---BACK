/* eslint-disable no-underscore-dangle */
import { FieldPacket } from 'mysql2';
import { v4 as uuid } from 'uuid';
import { GiftEntity } from '../types';
import { pool } from '../utils/db';
import { ValidationError } from '../utils/error';
type GiftRecordResult = [GiftRecord[], FieldPacket[]];

export class GiftRecord implements GiftEntity {
  public id?: string;
  public name: string;
  public count: number;

  constructor(public obj: GiftEntity) {
    this.id = obj.id;
    this.name = obj.name;
    this.count = obj.count;
    this._validate();
  }

  _validate(): void {
    if (this.name.trim().length < 3 || this.name.trim().length > 55 || !this.name) {
      throw new ValidationError('Gift name should be at least 3 chars long and 55 most');
    }

    if (this.count < 1 || this.count > 999999 || !this.count) {
      throw new ValidationError('Gifts count number should be betweeen 1 and 999 999');
    }
  }

  async insert(): Promise<string> {
    if (!this.id) {
      this.id = uuid();
    }

    await pool.execute('INSERT INTO `gifts` VALUES (:id, :name, :count)', {
      id: this.id,
      name: this.name,
      count: this.count,
    });
    return this.id;
  }

  async countGivenGifts(): Promise<number> {
    const [[{ count }]] = await pool.execute('SELECT COUNT(*) AS `count` FROM `children` WHERE `giftId` = :id', {
      id: this.id,
    }) as GiftRecordResult;

    return count;
  }

  static async listAll(): Promise<GiftRecord[]> {
    const [result] = await pool.execute('SELECT * FROM `gifts`') as GiftRecordResult;
    return result.map((obj) => new GiftRecord(obj));
  }

  static async getOne(id: string): Promise<GiftRecord | null> {
    const [result] = await pool.execute('SELECT * FROM `gifts` WHERE `id` = :id', {
      id,
    }) as GiftRecordResult;
    return result.length === 0 ? null : new GiftRecord(result[0]);
  }
  async delete(): Promise<void> {
    await pool.execute('DELETE FROM `gifts` WHERE `id` = :id', {
      id: this.id,
    }) as GiftRecordResult;

  }
}
