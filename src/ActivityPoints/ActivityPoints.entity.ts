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
  constructor(latitude: Float32Array, longitude: Float32Array) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'double precision', nullable: false })
  latitude: Float32Array;

  @Column({ type: 'double precision', nullable: false })
  longitude: Float32Array;
}
