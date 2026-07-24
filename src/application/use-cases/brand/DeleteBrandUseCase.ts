import { IBrandRepository } from "../../../domain/repositories/IBrandRepository";

export class DeleteBrandUseCase{
    constructor(private readonly brandRepository:IBrandRepository){}
    async execute(id:string):Promise<void>{
        const brand=await this.brandRepository.findById(id);
        if(!brand){
            throw new Error("Thương hiệu không tồn tại")
        }
        brand.delete();
        await this.brandRepository.save(brand);
    }
}