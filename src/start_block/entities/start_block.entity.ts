import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'start_blocks' })
export class StartBlock {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at?: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at?: string;

  @Column()
  chain_id: string;

  @Column()
  event_name: string;

  @Column()
  block_number: number;

  @Column()
  contract_address: string;
}
