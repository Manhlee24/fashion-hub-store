import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./entities/User.js";
import { Category } from "./entities/Category.js";
import { Product } from "./entities/Product.js";
import { ProductVariant } from "./entities/ProductVariant.js";
import { Order } from "./entities/Order.js";
import { OrderItem } from "./entities/OrderItem.js";
import { Hero } from "./entities/Hero.js";
import { Banner } from "./entities/Banner.js";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "123456",
    database: process.env.DB_NAME || "fashion_hub",
    synchronize: true, 
    logging: false,
    entities: [User, Category, Product, ProductVariant, Order, OrderItem, Hero, Banner],
    migrations: [],
    subscribers: [],
});
