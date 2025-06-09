import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity({ name: 'categories' })
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @CreateDateColumn()
  createdAt: Timestamp;
  @CreateDateColumn()
  updatedAt: Timestamp;

  //   many category to one user
  @ManyToOne(() => UserEntity, (user) => user.categories)
  addedBy: UserEntity;
}
