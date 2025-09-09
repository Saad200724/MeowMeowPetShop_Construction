import bcrypt from "bcrypt";
import { db } from "./db";
import { users, brands } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function createAdminAccount() {
  try {
    // Check if admin account already exists by email
    const existingAdmin = await db.select().from(users).where(eq(users.email, "admin@gmail.com"));

    if (existingAdmin.length > 0) {
      console.log("Admin account already exists");
      return;
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash("meowmeow123", 10);

    // Create the admin account with email
    const adminUser = await db.insert(users).values({
      username: "admin",
      password: hashedPassword,
      email: "admin@gmail.com",
      firstName: "System",
      lastName: "Administrator",
      role: "admin",
      isActive: true,
    }).returning();

    console.log("Admin account created successfully:", adminUser[0].email);

    // Create default brands
    const brandsData = [
      { name: 'Default Brand', slug: 'default-brand', description: 'Default brand for products without specific brand assignment' },
      { name: 'Nekko', slug: 'nekko', description: 'Premium cat food brand from Thailand' },
      { name: 'Purina', slug: 'purina', description: 'Trusted pet nutrition for over 90 years' },
      { name: 'Purina One', slug: 'purina-one', description: 'Purposeful nutrition for dogs and cats' },
      { name: 'Reflex', slug: 'reflex', description: 'Complete nutrition for pets' },
      { name: 'Reflex Plus', slug: 'reflex-plus', description: 'Enhanced nutrition with premium ingredients' },
      { name: 'Royal Canin', slug: 'royal-canin', description: 'Breed-specific and life-stage nutrition' },
      { name: 'Sheba', slug: 'sheba', description: 'Gourmet cat food with fine cuts' }
    ];

    for (const brandData of brandsData) {
      const existingBrand = await db.select().from(brands).where(eq(brands.slug, brandData.slug));
      if (existingBrand.length === 0) {
        await db.insert(brands).values(brandData);
        console.log(`Created brand: ${brandData.name}`);
      }
    }

  } catch (error) {
    console.error("Error creating admin account:", error);
  }
}
