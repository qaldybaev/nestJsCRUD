import { BadRequestException, Injectable, NotFoundException, OnModuleInit, UnauthorizedException } from "@nestjs/common";
import { PostgresService } from "src/database";
import { UserModel } from "./model/user-model";
import { ILogin, IRegister, IUpdateUser } from "./interface";
import * as bcrypt from 'bcryptjs';
import { GetAllUserDto } from "./dtos";



@Injectable()
export class UserService implements OnModuleInit {
    constructor(private readonly pg: PostgresService) { }

    async onModuleInit() {
        try {
            await this.pg.query(UserModel)
            console.log("Users table yaratildi✅")
        } catch (error) {
            console.log("Users table yaratishda xatolik❌")
        }
    }

    async getAllUser(query: GetAllUserDto) {
        const page = Number(query.page || 1);
        const limit = Number(query.limit || 10);
        const offset = (page - 1) * limit;
        const sortBy = query.sortBy || 'id';
        const order = query.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    
        const getUsers = `SELECT * FROM users ORDER BY ${sortBy} ${order} LIMIT ${limit} OFFSET ${offset}`;
        const countUsers = `SELECT COUNT(*) FROM users`;
    
        const users = await this.pg.query(getUsers);
        const total = await this.pg.query(countUsers);
    
        return {
            message: "success",
            page,
            limit,
            total: +total[0].count,
            data: users
        };
    }
    

    async register(payload: IRegister) {
        const foundedUser = await this.pg.query(`SELECT * FROM users WHERE email = $1`, [payload.email])

        if (foundedUser.length !== 0) {
            throw new BadRequestException("Bu email allaqachon mavjud!")
        }

        const hashedPassword = await bcrypt.hash(payload.password, 10);

        const newUser = await this.pg.query(
            `INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING *`,
            [payload.name, payload.email, hashedPassword]
        );


        return {
            message: "success",
            data: newUser
        }
    }

    async login(payload: ILogin) {
        const foundedUser = await this.pg.query(`SELECT * FROM users WHERE email = $1`, [payload.email])

        if (foundedUser.length === 0) {
            throw new NotFoundException("Foydalanuvchi topilmadi!!")
        }
        const user = foundedUser[0];

        const isCompare = await bcrypt.compare(payload.password, user.password);
        if (!isCompare) {
            throw new UnauthorizedException("Parol noto'g'ri!!");
        }


        return {
            message: "success",
            data: user
        }

    }
    async updateUser(id: number, payload: IUpdateUser) {
        const foundedUser = await this.pg.query('SELECT * FROM users WHERE id = $1', [id]);

        if (foundedUser.length === 0) {
            throw new NotFoundException("Id bo'yicha foydalanuvchi topilmadi!");
        }

        let hashedPassword: string | undefined = undefined;

        if (payload.password) {
            hashedPassword = await bcrypt.hash(payload.password, 10);
        }

        const updatedUser = await this.pg.query(
            `UPDATE users 
             SET 
                name = COALESCE($1, name),
                email = COALESCE($2, email),
                password = COALESCE($3, password)
             WHERE id = $4 RETURNING *`,
            [payload.name, payload.email, hashedPassword, id]
        );

        return {
            message: "success",
            data: updatedUser[0]
        };
    }

    async deleteUser(id:number){
        const foundedUser = await this.pg.query('SELECT * FROM users WHERE id = $1', [id]);

        if (foundedUser.length === 0) {
            throw new NotFoundException("Id bo'yicha foydalanuvchi topilmadi!");
        }

        const deleteUser = await this.pg.query(`DELETE FROM users WHERE id= $1 RETURNING *`,[id])

        return{
            message:"success",
            data:deleteUser
        }
    }
}