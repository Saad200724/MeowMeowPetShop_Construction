import bcrypt from "bcrypt";
import { User, Brand } from "@shared/models";

export async function createAdminAccount() {
  try {
    // Check if admin account already exists by email
    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });

    if (existingAdmin) {
      console.log("Admin account already exists");
      // Still run cleanup even if admin exists
      await cleanupCorruptedBrands();
      return;
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash("meowmeow123", 10);

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

    await cleanupCorruptedBrands();

  } catch (error) {
    console.error("Error creating admin account:", error);
  }
}

async function cleanupCorruptedBrands() {
  try {
    console.log('Running cleanup for corrupted brands...');
    
    // List all brands first
    const allBrands = await Brand.find({});
    console.log('Found', allBrands.length, 'total brands');
    
    // Find corrupted brands with ObjectId patterns as names or the specific problematic brand
    const corruptedBrands = await Brand.find({
      $or: [
        { name: { $regex: /^[0-9a-fA-F]{24}$/ } }, // ObjectId pattern
        { slug: { $regex: /^[0-9a-fA-F]{24}$/ } }, // ObjectId pattern
        { name: '68a571911833638a216fa865' }, // Specific problematic brand
        { slug: '68a571911833638a216fa865' }  // Specific problematic brand
      ]
    });

    if (corruptedBrands.length > 0) {
      console.log('Found corrupted brands:', corruptedBrands.map(b => `${b._id}: ${b.name}`));
      
      const deleteResult = await Brand.deleteMany({
        $or: [
          { name: { $regex: /^[0-9a-fA-F]{24}$/ } },
          { slug: { $regex: /^[0-9a-fA-F]{24}$/ } },
          { name: '68a571911833638a216fa865' },
          { slug: '68a571911833638a216fa865' }
        ]
      });
      
      console.log('Cleanup result:', deleteResult);
      console.log('Successfully removed', deleteResult.deletedCount, 'corrupted brands');
    } else {
      console.log('No corrupted brands found to clean up');
    }
  } catch (error) {
    console.error('Error during brand cleanup:', error);
  }
}
