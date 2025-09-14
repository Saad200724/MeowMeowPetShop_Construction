import bcrypt from "bcrypt";
import { User, Brand } from "@shared/models";

export async function createAdminAccount() {
  try {
    // Check if admin account already exists by email
    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });

    if (existingAdmin) {
      // Update existing admin password to ensure it matches current code
      const hashedPassword = await bcrypt.hash("meow123", 10);
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log("Admin account password updated");
      return;
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash("meow123", 10);

    // Create the admin account with email
    const adminUser = new User({
      username: "admin",
      password: hashedPassword,
      email: "admin@gmail.com",
      firstName: "System",
      lastName: "Administrator",
      role: "admin",
      isActive: true,
    });

    await adminUser.save();

    console.log("Admin account created successfully:", adminUser.email);

    // Create default brands
    const brands = [
      { name: 'Default Brand', slug: 'default-brand', description: 'Default brand for products without specific brand assignment' },
      { name: 'Nekko', slug: 'nekko', description: 'Premium cat food brand from Thailand' },
      { name: 'Purina', slug: 'purina', description: 'Trusted pet nutrition for over 90 years' },
      { name: 'Purina One', slug: 'purina-one', description: 'Purposeful nutrition for dogs and cats' },
      { name: 'Reflex', slug: 'reflex', description: 'Complete nutrition for pets' },
      { name: 'Reflex Plus', slug: 'reflex-plus', description: 'Enhanced nutrition with premium ingredients' },
      { name: 'Royal Canin', slug: 'royal-canin', description: 'Breed-specific and life-stage nutrition' },
      { name: 'Sheba', slug: 'sheba', description: 'Gourmet cat food with fine cuts' }
    ];

    for (const brandData of brands) {
      const existingBrand = await Brand.findOne({ slug: brandData.slug });
      if (!existingBrand) {
        const brand = new Brand(brandData);
        await brand.save();
        console.log(`Created brand: ${brandData.name}`);
      }
    }

  } catch (error) {
    console.error("Error creating admin account:", error);
  }
}
