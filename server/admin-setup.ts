import bcrypt from "bcrypt";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function createAdminAccount() {
  try {
    // Check if admin account already exists by email
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, "admin@gmail.com"))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log("Admin account already exists");
      return;
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash("meowmeow123", 10);

    // Create the admin account with email
    const [adminUser] = await db
      .insert(users)
      .values({
        username: "admin",
        password: hashedPassword,
        email: "admin@gmail.com",
        firstName: "System",
        lastName: "Administrator",
        role: "admin",
        isActive: true,
      })
      .returning();

    console.log("Admin account created successfully:", adminUser.email);
  } catch (error) {
    console.error("Error creating admin account:", error);
  }
}