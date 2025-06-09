import { CategoryEntity } from 'src/categories/entities/category.entity';
import { Roles } from 'src/utility/common/user-roles.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Column({ select: false })
  password: string;
  @Column({ type: 'enum', enum: Roles, array: true, default: [Roles.USER] })
  roles: Roles[];
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Timestamp;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Timestamp;

  // one to many
  @OneToMany(() => CategoryEntity, (cat) => cat.addedBy)
  categories: CategoryEntity[];
}
