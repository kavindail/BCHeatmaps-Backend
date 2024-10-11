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
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  jwtToken: string | null;
}
