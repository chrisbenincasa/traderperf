import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Execution } from './Execution';

@Entity()
export class Trade {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() symbol: string;

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
