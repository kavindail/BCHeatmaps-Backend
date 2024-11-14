import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('Favorite')
export class Favorite {
  @PrimaryColumn()
  userID: number;

  @Column({ nullable: false })
  latitude: number;

  @Column({ nullable: false })
  longitude: number;

  @Column({ nullable: false })
  zoomLevel: number;
}
