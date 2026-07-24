import {UUID} from "node:crypto";
import { Column, CreateDateColumn, Entity, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany, DeleteDateColumn } from "typeorm";
@Entity({name:"brands"})
export class BrandOrmEntity{
    @PrimaryGeneratedColumn("uuid")
    id!:string;
    @Column({type:"varchar",length:255})
    name!:string

    @Column({type:"text",nullable:true})
    description!:string|null

    @Column({type:"varchar",length:500,nullable:true})
    logo!:string|null

    @Column({name:"is_active",type:"boolean",default:true})
    isActive!:boolean

    @CreateDateColumn({name:"created_at",type:"timestamp"})
    createdAt!:Date

    @UpdateDateColumn({name:"updated_at",type:"timestamp"})
    updatedAt!:Date

    @DeleteDateColumn({name:"deleted_at",type:"timestamp",nullable: true })
    deletedAt!:Date|null
    // @OneToMany(()=>ProductOrmEntity,(product)=>product.brand)
    // products!:ProductOrmEntity[];
}