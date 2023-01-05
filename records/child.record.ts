/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import { FieldPacket } from 'mysql2';
import { v4 as uuid } from 'uuid';
import { ChildEntity } from '../types';
import { pool } from '../utils/db';
import { ValidationError } from '../utils/error';

export class ChildRecord implements ChildEntity {
  public id?: string;
  public name: string;
  public giftId: string;

  constructor(
    public obj: ChildEntity
  ) {
    this.id = obj.id;
    this.name = obj.name;
    this.giftId = obj.giftId;
    this.validate();


  }

  private validate(): void {
    if (Number(this.name) || this.name.trim().length < 3 || this.name.trim().length > 25 || !this.name) {
      throw new ValidationError('Child name should be at least 3 chars long and 25 most');
    }
  }

  async insert(): Promise<string> {
    if (!this.id) {
      this.id = uuid();
    }

    await pool.execute('INSERT INTO `children`(`id`, `name`) VALUES (:id, :name)', {
      id: this.id,
      name: this.name,

    });
    return this.id;
  }

  async update(): Promise<void> {
    await pool.execute('UPDATE `children` SET `name`= :name, `giftId` = :giftId WHERE `id` = :id', {
      id: this.id,
      name: this.name,
      giftId: this.giftId,

    });
  }

  static async listAll(): Promise<ChildRecord[]> {
    const [result] = await pool.execute('SELECT * FROM `children` ORDER BY `name` ASC') as [ChildRecord[], FieldPacket[]];

    return result.map((obj) => new ChildRecord(obj));
  }

  static async getOne(id: string): Promise<ChildRecord | null> {
    const [result] = await pool.execute('SELECT * FROM `children` WHERE `id` = :id', {
      id,
    }) as [ChildRecord[], FieldPacket[]];
    return result.length === 0 ? null : new ChildRecord(result[0]);
  }
}

