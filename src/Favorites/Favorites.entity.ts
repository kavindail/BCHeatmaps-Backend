import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Favorite')
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userID: number;

  @Column({ type: 'double precision', nullable: false })
  latitude: Float32Array;

  @Column({ type: 'double precision', nullable: false })
  longitude: Float32Array;

  @Column({ type: 'double precision', nullable: false })
  zoomLevel: Float32Array;
}
