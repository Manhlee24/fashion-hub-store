import { AppDataSource } from "./src/data-source.js";

AppDataSource.initialize().then(async () => {
    const products = await AppDataSource.query("SELECT id, image_url, name, status FROM products LIMIT 5;");
    console.log("Products:", JSON.stringify(products, null, 2));
    
    const heroes = await AppDataSource.query("SELECT id, image_url FROM hero_sections LIMIT 5;");
    console.log("Heroes:", JSON.stringify(heroes, null, 2));

    const banners = await AppDataSource.query("SELECT id, image_url FROM banners LIMIT 5;");
    console.log("Banners:", JSON.stringify(banners, null, 2));
    
    process.exit(0);
}).catch(console.error);
