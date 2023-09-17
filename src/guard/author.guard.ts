/* eslint-disable prettier/prettier */
import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { CategoryService } from 'src/category/category.service'
import { TransactionService } from 'src/transaction/transaction.service'

@Injectable()
export class authorGuard implements CanActivate {
	constructor(
		private readonly transactionService: TransactionService,
		private readonly categoryService: CategoryService,
	) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const { id, type } = request.params
		let entity

			switch (type) {
				case 'transcation':
					entity = await this.transactionService.findOne(id)
					break
				case 'category':
					entity = await this.categoryService.findOne(id)
					break
				default:
					throw new NotFoundException('Smt went wrong...')
			}

		const user = request.user

		if (entity && user && entity.user.id === user.id) return true
		console.log(entity)
		throw new BadRequestException('Daun chet ne pravilno')
	}
}
