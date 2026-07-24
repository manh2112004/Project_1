import { CreateBrandUseCase } from "../../application/use-cases/brand/CreateBrandUseCase"
import { Request, Response } from "express";
import { UpdateBrandUseCase } from "../../application/use-cases/brand/UpdateBrandUseCase";
import { DeleteBrandUseCase } from "../../application/use-cases/brand/DeleteBrandUseCase";
import { BrandResponseDto } from "../../application/dtos/brand/createBrandDto";
import { GetBrandByIdUseCase } from "../../application/use-cases/brand/GetBrandByIdUseCase";
import { GetAllBrandUseCase } from "../../application/use-cases/brand/GetAllBrandUseCase";

export class BrandController {
    constructor(private readonly createBrandUseCase: CreateBrandUseCase,
        private readonly updateBrandUseCase: UpdateBrandUseCase,
        private readonly deleteBrandUseCase: DeleteBrandUseCase,
        private readonly getBrandByIdUseCase: GetBrandByIdUseCase,
        private readonly getAllBrandUseCase: GetAllBrandUseCase
    ) { }
    async create(req: Request, res: Response): Promise<void> {
        try {
            const { name, logo, description, isActive } = req.body;
            const brand = await this.createBrandUseCase.execute({
                name,
                logo,
                description,
                isActive,
            });
            res.status(200).json({
                success: true,
                message: "Tạo thương hiệu thành công",
                data: brand
            })
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "lỗi không tạo được danh mục"
            })
        }
    }
    async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const { name, description, logo, isActive } = req.body;
            const updateBrand = await this.updateBrandUseCase.execute({
                id: String(id),
                name,
                description,
                logo,
                isActive
            })
            res.status(200).json({
                success: true,
                message: "cập nhật thương hiệu thành công",
                data: updateBrand
            })
        }
        catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "cập nhật thương hiệu không thành công",
            })
        }
    }
    async delete(req:Request,res:Response):Promise<void>{
        try{
            const {id}=req.params;
            await this.deleteBrandUseCase.execute(String(id));
            res.status(200).json({
                success:true,
                message:"xóa thương hiệu thành công"
            })
        }catch(error:any){
            res.status(400).json({
                success:false,
                message:error.message||"xóa thương hiệu không thành công"
            })
        }
    }
    async getById(req:Request,res:Response):Promise<void>{
        try{
            const {id}=req.params;
            const brand=await this.getBrandByIdUseCase.execute(String(id))
            if(!brand){
                throw new Error("Thương hiệu không tồn tại")
            }
            res.status(200).json({
                success:true,
                message:"Lấy thương hiệu thành công",
                data:brand
            })
        }catch(error:any){
            res.status(400).json({
                success:false,
                message:error.message||"Lấy thương hiệu không thành công",
            })
        }
    }
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const brands = await this.getAllBrandUseCase.execute();
            res.status(200).json({
                success: true,
                message: "Lấy danh sách thương hiệu thành công",
                data: brands
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || "Lấy danh sách thương hiệu không thành công"
            });
        }
    }
}