import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { PostgresService } from "src/database";
import { CategoryTableModel } from "./models";
import { ICategoryResponse, ICreateCategory, IUpdateCategory } from "./interface/category.interface";
import { error } from "console";
import { GetAllCategoryDto } from "./dtos/get-allCategory.dto";


@Injectable()

export class CategoryServise implements OnModuleInit {
    constructor(private readonly pg: PostgresService) { }

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

    async createCategory(payload: ICreateCategory): Promise<ICategoryResponse> {
        const category = await this.pg.query('INSERT INTO categories(name,category_id) VALUES ($1,$2) RETURNING *',
            [payload.name, payload.category_id])

        return {
            message: "success",
            data: category
        }
    }

    async updateCategory(id: number, payload: IUpdateCategory): Promise<ICategoryResponse> {
        const foundedCategory = await this.pg.query(
            `SELECT * FROM categories WHERE id = $1`,
            [id]
        );

        if (foundedCategory.length === 0) {
            throw new NotFoundException("Category not found!");
        }

        const updatedCategory = await this.pg.query(
            `UPDATE categories SET name = $1 WHERE id = $2 RETURNING *`,
            [payload.name, id]
        );

        return {
            message: "success",
            data: updatedCategory[0],
        };
    }
    async deleteCategory(id: number): Promise<ICategoryResponse> {
        const category = await this.pg.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id])
        return {
            message: "success",
            data: category
        }
    }


}