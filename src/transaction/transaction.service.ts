import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Transaction } from './entities/transaction.entity'
import { UpdateTransactionDto } from './dto/update-transaction.dto'

@Injectable()
export class TransactionService {
	constructor(
		@InjectRepository(Transaction)
		private readonly transactionRepository: Repository<Transaction>,
	) {}

	async create(createTransactionDto: CreateTransactionDto, id: number) {
		const newTranscation = {
			title: createTransactionDto.title,
			amount: createTransactionDto.amount,
			type: createTransactionDto.type,
			category: {
				id: +createTransactionDto.category,
			},
			user: { id },
		}
		if (!newTranscation) throw new BadRequestException('Smt went wrong')

		return await this.transactionRepository.save(newTranscation)
	}

	async findAllByType(id: number, type: string) {
		const transaction = await this.transactionRepository.find({
			where: {
				user: { id },
				type,
			},
		})
		const total = transaction.reduce((acc, obj) => acc + obj.amount, 0)

		return total
	}

	async findAll(id: number) {
		const transactions = await this.transactionRepository.find({
			where: { user: { id } },
			// Новое будет сортироваться от нового к старому
			order: {
				createdAt: 'DESC',
			},
		})

		return transactions
	}

	async findOne(id: number) {
		const transaction = await this.transactionRepository.findOne({
			where: {
				id,
			},
			relations: {
				user: true,
				categories: true,
			},
		})
		if (!transaction) throw new BadRequestException('Doesnt see in db')

		return transaction
	}

	async update(id: number, updateTransactionDto: UpdateTransactionDto) {
		const transaction = await this.transactionRepository.findOne({
			where: { id },
		})
		if (!transaction) throw new BadRequestException('transaction not found')

		return await this.transactionRepository.update(id, updateTransactionDto)
	}

	async remove(id: number) {
		const transaction = await this.transactionRepository.findOne({
			where: { id },
		})
		if (!transaction) throw new BadRequestException('transaction not found')

		return await this.transactionRepository.delete(id)
	}

	async findAllWithPagination(id: number, page: number, limit: number) {
		const transactions = await this.transactionRepository.find({
			where: {
				user: { id },
			},
			// Ну это будет жопа если на фронте увижу это все снизу описанное
			// relations: {
			// 	categories: true,
			// 	user: true,
			// },
			order: {
				createdAt: 'DESC',
			},
			take: limit,
			skip: (page - 1) * limit,
		})
		return transactions
	}
}
