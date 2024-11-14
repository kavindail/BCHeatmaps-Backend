import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Users')
export class Users {
  @PrimaryGeneratedColumn()
  uuid: number;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ nullable: true })
  jwtToken: string | null;
}
