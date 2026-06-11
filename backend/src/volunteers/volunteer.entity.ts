import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Signup } from '../signups/signup.entity';
import { Contribution } from '../contributions/contribution.entity';

@Entity()
export class Volunteer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: 'simple-array', nullable: true })
  skills?: string[];

  @Column({ default: 0 })
  points: number;

  @Column({ default: 1 })
  level: number;

  @OneToMany(() => Signup, signup => signup.volunteer)
  signups: Signup[];

  @OneToMany(() => Contribution, contribution => contribution.volunteer)
  contributions: Contribution[];
}
