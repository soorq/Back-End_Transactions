"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorGuard = void 0;
const common_1 = require("@nestjs/common");
const category_service_1 = require("../category/category.service");
const transaction_service_1 = require("../transaction/transaction.service");
let authorGuard = class authorGuard {
    constructor(transactionService, categoryService) {
        this.transactionService = transactionService;
        this.categoryService = categoryService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const { id, type } = request.params;
        let entity;
        switch (type) {
            case 'transcation':
                entity = await this.transactionService.findOne(id);
                break;
            case 'category':
                entity = await this.categoryService.findOne(id);
                break;
            default:
                throw new common_1.NotFoundException('Smt went wrong...');
        }
        const user = request.user;
        if (entity && user && entity.user.id === user.id)
            return true;
        console.log(entity);
        throw new common_1.BadRequestException('Daun chet ne pravilno');
    }
};
exports.authorGuard = authorGuard;
exports.authorGuard = authorGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transaction_service_1.TransactionService,
        category_service_1.CategoryService])
], authorGuard);
//# sourceMappingURL=author.guard.js.map