import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { PostgresService } from "src/database";
import { CategoryTableModel } from "./models";
import { ICategoryResponse, ICreateCategory, IUpdateCategory } from "./interface/category.interface";
import { error } from "console";
import { GetAllCategoryDto } from "./dtos/get-allCategory.dto";
import { FsHelper } from "src/helper";


@Injectable()

export class CategoryServise implements OnModuleInit {
    constructor(private readonly pg: PostgresService, private fs: FsHelper) { }

    async onModuleInit() {
        try {
            await this.pg.query(CategoryTableModel)
            console.log('Category table yaratildi✅')
        } catch (error) {
            console.log("Table yaratishda xatolik❌")
        }
    }

    async getAllCategories(query: GetAllCategoryDto): Promise<ICategoryResponse> {
        const page = Number(query.page || 1);
        const limit = Number(query.limit || 10);
        const offset = (page - 1) * limit;
        const sortBy = query.sortBy || 'name';
        const order = query.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        const categories = await this.pg.query(`SELECT p.id,
            p.name,
            p.image,
            json_agg(json_build_object('id', c.id, 'name', c.name)) as subcategories
            FROM categories p
            LEFT JOIN categories c ON c.category_id = p.id
            GROUP BY p.id, p.name
            HAVING p.category_id IS NULL
            ORDER BY ${sortBy} ${order} LIMIT $1 OFFSET $2
    `, [limit, offset]);

        return {
            message: "success",
            limit,
            page,
            count: categories.length,
            data: categories
        }
    }

    async createCategory(payload: ICreateCategory, image: Express.Multer.File): Promise<ICategoryResponse> {
        const categoryImage = await this.fs.uploadFile(image)
        console.log(image)
        const category = await this.pg.query('INSERT INTO categories(name,category_id,image) VALUES ($1,$2,$3) RETURNING *',
            [payload.name, payload.category_id, categoryImage.fileUrl])

        return {
            message: "success",
            data: category
        }
    }

    async updateCategory(id: number, payload: IUpdateCategory, image?: Express.Multer.File): Promise<ICategoryResponse> {
        const foundedCategory = await this.pg.query(
            `SELECT * FROM categories WHERE id = $1`,
            [id]
        );
    
        if (foundedCategory.length === 0) {
            throw new NotFoundException("Category not found!");
        }
    
        let imageUrl = foundedCategory[0].image;
    
        
        if (image) {
            if (imageUrl) {
                await this.fs.deleteFile(imageUrl);
            }
            const uploadedImage = await this.fs.uploadFile(image);
            imageUrl = uploadedImage.fileUrl;
        }
    
        const updatedCategory = await this.pg.query(
            `UPDATE categories SET 
                name = COALESCE($1, name),
                image = COALESCE($2, image)
            WHERE id = $3 RETURNING *`,
            [payload.name, imageUrl, id]
        );
    
        return {
            message: "success",
            data: updatedCategory[0],
        };
    }
    

    async deleteCategory(id: number): Promise<ICategoryResponse> {
        const foundedCategory = await this.pg.query('SELECT * FROM categories WHERE id = $1', [id]);

        if (foundedCategory.length === 0) {
            throw new NotFoundException("Category not found!");
        }

        const categoryImage = foundedCategory[0].image;

        if (categoryImage) {
            await this.fs.deleteFile(categoryImage);
        }

        const category = await this.pg.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);

        return {
            message: "success",
            data: category
        };
    }



}