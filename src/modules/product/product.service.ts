import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { PostgresService } from "src/database";
import { ProductTableModel } from "./model";
import { IGetAllProductsResponse, IProductCreate, IProductUpdate } from "./interface";
import { GetAllProductDto } from "./dtos";
import { FsHelper } from "src/helper";

@Injectable()
export class ProductService implements OnModuleInit {
  constructor(private readonly pg: PostgresService, private fs:FsHelper) { }

  async onModuleInit() {
    try {
      await this.pg.query(ProductTableModel)
      console.log("Product table yaratildi✅")
    } catch (error) {
      console.log("Product table yaratishda xatolik❌")
    }
  }

  async getAllProduct(query: GetAllProductDto): Promise<IGetAllProductsResponse> {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);
    const offset = (page - 1) * limit;
    const sortBy = query.sortBy || 'category_id';
    const order = query.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const products = await this.pg.query(`SELECT 
            c.id AS category_id,
            c.name AS category_name,
            json_agg(
                json_build_object(
                    'id', p.id,
                    'name', p.name,
                    'price', p.price,
                    'images',p.images
                )
            ) AS products
        FROM categories c
        LEFT JOIN products p ON p.category_id = c.id
        GROUP BY c.id, c.name 
        ORDER BY ${sortBy} ${order} LIMIT $1 OFFSET $2`, [limit, offset]);

    return {
      message: "success",
      limit,
      page,
      count: products.length,
      data: products
    }
  }
  async createProduct(payload: IProductCreate, images?: Express.Multer.File[]) {
    let imageUrls: string[] = [];

    const category = await this.pg.query("SELECT * FROM categories WHERE id = $1",[payload.category_id])
    if(category.length === 0){
      throw new NotFoundException("Kategoriya topilmadi!")
    }

    if (images && images.length > 0) {
        for (const image of images) {
            const uploadedImage = await this.fs.uploadFile(image);
            imageUrls.push(uploadedImage.fileUrl);
        }
    }

    const product = await this.pg.query(
        `INSERT INTO products(name, price, category_id, images) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [payload.name, payload.price, payload.category_id, JSON.stringify(imageUrls)]
    );

    return {
        message: "success",
        data: product[0],
    };
}

async updateProduct(id: number, payload: IProductUpdate, images?: Express.Multer.File[]) {
  const found = await this.pg.query('SELECT * FROM products WHERE id = $1', [id]);
  if (!found.length) {
      throw new NotFoundException('Product not found!');
  }

  let imageUrls: string[] = [];
  if (found[0].images) {
      if (typeof found[0].images === 'string') {
          imageUrls = JSON.parse(found[0].images); 
      } else {
          imageUrls = found[0].images; 
      }
  }
  if (images && images.length > 0) {
      for (const oldImagePath of imageUrls) {
          await this.fs.deleteFile(oldImagePath);
      }
      imageUrls = [];
      for (const image of images) {
          const uploaded = await this.fs.uploadFile(image);
          imageUrls.push(uploaded.fileUrl);
      }
  }
  const product = await this.pg.query(
      `UPDATE products
          SET 
              name = COALESCE($1, name),
              price = COALESCE($2, price),
              category_id = COALESCE($3, category_id),
              images = COALESCE($4, images)
          WHERE id = $5 RETURNING *`,
      [payload.name, payload.price, payload.category_id, JSON.stringify(imageUrls), id]
  );

  return {
      message: "success",
      data: product[0],
  };
}

async deleteProduct(id: number) {
  const found = await this.pg.query('SELECT * FROM products WHERE id = $1', [id]);
  if (!found.length) {
      throw new NotFoundException('Product not found!');
  }
  let imageUrls: string[] = [];
  if (found[0].images) {
      if (typeof found[0].images === 'string') {
          imageUrls = JSON.parse(found[0].images); 
      } else {
          imageUrls = found[0].images;
      }
      for (const imagePath of imageUrls) {
          await this.fs.deleteFile(imagePath); 
      }
  }
  const product = await this.pg.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

  return {
      message: "success",
      data: product[0],
  };
}


}
