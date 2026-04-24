import { AppDataSource } from "./src/data-source.js";

const fashionImages = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    "https://images.unsplash.com/photo-1434389678278-be5740f84728?w=800&q=80",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
];

AppDataSource.initialize().then(async () => {
    console.log("Database connected for seeding...");

    const products = await AppDataSource.query("SELECT id FROM products WHERE image_url IS NULL OR image_url = ''");
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const randomImage = fashionImages[i % fashionImages.length];
        await AppDataSource.query("UPDATE products SET image_url = ? WHERE id = ?", [randomImage, product.id]);
    }
    console.log(`Updated ${products.length} products with placeholder images.`);

    // Also update heroes if needed
    const heroes = await AppDataSource.query("SELECT id FROM heroes WHERE image_url IS NULL OR image_url = ''");
    if (heroes.length > 0) {
        for (let i = 0; i < heroes.length; i++) {
            await AppDataSource.query("UPDATE heroes SET image_url = ? WHERE id = ?", [fashionImages[0], heroes[i].id]);
        }
        console.log(`Updated ${heroes.length} heroes with placeholder images.`);
    }

    // Default banners
    const banners = await AppDataSource.query("SELECT id FROM banners");
    if (banners.length === 0) {
        await AppDataSource.query("INSERT INTO banners (image_url, is_active, sort_order) VALUES (?, 1, 1)", [fashionImages[1]]);
        console.log("Added 1 default banner.");
    }

    console.log("Seeding complete!");
    process.exit(0);
}).catch(console.error);
