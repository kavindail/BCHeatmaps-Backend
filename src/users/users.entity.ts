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

@Entity('Users')
export class Users {
  @PrimaryGeneratedColumn()
  uuid: number;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  //TODO: Implement an expiry time for the jwt token
  @Column({ nullable: true })
  jwtToken: string | null;
}
