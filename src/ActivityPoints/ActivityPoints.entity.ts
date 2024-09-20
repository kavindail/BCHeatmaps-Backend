import {
  JoinTable,
  ManyToMany,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('ActivityPoints')
export class ActivityPoints {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  latitude: number;

  @Column({ nullable: false })
  longitude: number;
}
