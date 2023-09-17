import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { Repository } from 'typeorm'
import { Category } from './entities/category.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class CategoryService {
	constructor(
		@InjectRepository(Category)
		private readonly categoryRepository: Repository<Category>,
	) {}

	async create(createCategoryDto: CreateCategoryDto, id: number) {
		const isExist = await this.categoryRepository.findBy({
			//Проверяем есть ли уже в бд такая категория, у этого юзера
			user: { id },
			title: createCategoryDto.title,
		})

		//Говорим что категория уже используется, выдай ошибку
		if (isExist.length)
			throw new BadRequestException('category already exist')

		//Если нету, то создаем мы новую категорию, у этого юзера
		const newCategory = {
			title: createCategoryDto.title,
			user: {
				id,
			},
		}

		//Возращаем сохранение этой новой категории у юзера
		return await this.categoryRepository.save(newCategory)
	}

	async findAll(id: number) {
		return await this.categoryRepository.find({
			where: {
				user: { id },
			},
			//По мимо категорий подхвати и транзакции у него
			relations: {
				transaction: true,
			},
		})
	}

	async findOne(id: number) {
		const category = await this.categoryRepository.findOne({
			where: { id },
			relations: {
				user: true,
				transaction: true,
			},
		})

		// Если нет, то отдаем ошибку
		if (!category) throw new NotFoundException('Category not found')

		// Если есть то отдаем
		return category
	}

	async update(id: number, updateCategoryDto) {
		// Для проверки, есть ли такое ваще в бд
		const isExist = await this.categoryRepository.findOne({
			where: { id },
		})
		// Если нету даем ошибку
		if (!isExist) throw new NotFoundException('Category not found')

		// Если нашли, то апдейтаем ее на тот айди, ее место, и значение новое даем
		return await this.categoryRepository.update(id, updateCategoryDto)
	}

	async remove(id: number) {
		const find = await this.categoryRepository.findOne({
			where: { id },
		})
		// Проверки ваще на существование
		if (!find) throw new NotFoundException('Not found this category')

		// В случае если да, то верху прокинет ошибку, если нет, не пустое поле, существует, то отдам ответ с делитом на бд
		return await this.categoryRepository.delete(id)
	}
}
