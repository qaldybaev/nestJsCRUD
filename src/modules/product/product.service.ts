import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { PostgresService } from "src/database";
import { ProductTableModel } from "./model";
import { IGetAllProductsResponse, IProductCreate, IProductUpdate } from "./interface";

@Injectable()
export class ProductService implements OnModuleInit {
    constructor(private readonly pg: PostgresService) { }

    async onModuleInit() {
        try {
            await this.pg.query(ProductTableModel)
            console.log("Product table yaratildi✅")
        } catch (error) {
            console.log("Product table yaratishda xatolik❌")
        }
    }

    async getAllProduct():Promise<IGetAllProductsResponse> {
        const products = await this.pg.query(`SELECT 
            c.id AS category_id,
            c.name AS category_name,
            json_agg(
                json_build_object(
                    'id', p.id,
                    'name', p.name,
                    'price', p.price
                )
            ) AS products
        FROM categories c
        LEFT JOIN products p ON p.category_id = c.id
        GROUP BY c.id, c.name ORDER BY category_id asc
        
        `)

        return {
            message: "success",
            count: products.length,
            data: products
        }
    }
    async createProduct(payload:IProductCreate) {
        const product = await this.pg.query(`INSERT INTO products(name,price,category_id) VALUES
        ($1,$2,$3) RETURNING *`, [payload.name, payload.price, payload.category_id])

        return {
            message: "success",
            data: product
        }
    }
    async updateProduct(id: number, payload:IProductUpdate) {
        const found = await this.pg.query('SELECT * FROM products WHERE id = $1', [id]);
        if (!found.length) {
          throw new NotFoundException('Product not found!');
        }
      
        const product = await this.pg.query(
          `UPDATE products
           SET 
             name = COALESCE($1, name),
             price = COALESCE($2, price),
             category_id = COALESCE($3, category_id)
           WHERE id = $4 RETURNING *`,
          [payload.name, payload.price, payload.category_id, id]
        );
      
        return {
          message: "success",
          data: product,
        };
      }
      async deleteProduct(id: number) {
        const found = await this.pg.query('SELECT * FROM products WHERE id = $1', [id]);
        if (!found.length) {
          throw new NotFoundException('Product not found!');
        }
      
        const product = await this.pg.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
      
        return {
          message: "success",
          data: product,
        };
      }
      

}
