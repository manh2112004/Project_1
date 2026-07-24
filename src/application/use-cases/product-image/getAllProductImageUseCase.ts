import { IProductImageRepository } from "../../../domain/repositories/IProductImageRepository";
import { ProductImageResponseDto } from "../../dtos/product-image/CreateProductImageDto";
export class getAllProductImageUseCase{
    constructor(private readonly productImageRepository:IProductImageRepository){}
    async execute():Promise<ProductImageResponseDto[]>{
        const productImages=await this.productImageRepository.findAll();
        return productImages.map(images=>({
            id:images.id,
            productId:images.productId,
            imageUrl:images.imageUrl,
            isThumbnail:images.isThumbnail,
            sortOrder:images.sortOrder,
            createdAt:images.createdAt.toISOString()
        }))
    }
}