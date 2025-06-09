import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    currentUser: UserEntity,
  ): Promise<CategoryEntity> {
    const category = this.categoryRepository.create(createCategoryDto);
    category.addedBy = currentUser;
    return await this.categoryRepository.save(category);
  }

  async findAll() {
    // return await this.categoryRepository.find();
    return await this.categoryRepository.find({
      relations: { addedBy: true },
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
  }

  async findOne(id: number) {
    // return await this.categoryRepository.findOneBy({ id });
    return await this.categoryRepository.findOne({
      where: { id: id },
      relations: { addedBy: true },
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
  }

  async update(id: number, fields: Partial<UpdateCategoryDto>) {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException('category not found');
    Object.assign(category, fields);
    return await this.categoryRepository.save(category);
  }

  remove(id: number) {
    return this.categoryRepository.delete({ id });
  }
}
