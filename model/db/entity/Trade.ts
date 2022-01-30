import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Platform } from '../..';
import { Execution } from './Execution';

@Entity()
export class Trade {
  @PrimaryGeneratedColumn() userId?: number;

  @PrimaryColumn() symbol: string;

  @PrimaryColumn() opened: Date;

  @PrimaryColumn({
    type: 'enum',
    enum: Platform,
    enumName: 'platform',
  })
  platform: Platform;

  @Column() closed?: Date;

  @OneToMany(() => Execution, (execution) => execution.trade)
  executions: Execution[];

  @Column() quantity: number;

  @Column('bool') isOpen: boolean;

  @Column('bool') isShort: boolean;

  @Column('money') closedPl: number;
  @Column('int') closedPlScale: number;

  @Column('money') outflow: number;
  @Column('int') outflowScale: number;

  @Column() currency: string;
}
