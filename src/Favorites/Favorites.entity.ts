import {
  JoinTable,
  ManyToMany,
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

//Each entry will be one favorite for a specified user at their user id
@Entity('Favorite')
export class Favorite {
  @PrimaryColumn()
  userId: Number;

  @Column({ nullable: false })
  latitude: Number;

  @Column({ nullable: false })
  longitude: Number;

  @Column({ nullable: false })
  zoomLevel: Number;
}
