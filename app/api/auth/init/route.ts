import { NextResponse } from "next/server";
import { initializeDefaultAdmin } from "@/lib/initAdmin";

// This API route will be called on server startup to ensure a default admin exists
export async function GET() {
  try {
    const created = await initializeDefaultAdmin();
    
    if (created) {
      return NextResponse.json({ 
        success: true, 
        message: "Default admin user created successfully",
        credentials: {
          email: "admin@example.com",
          password: "admin123"
        }
      });
    } else {
      return NextResponse.json({ 
        success: true, 
        message: "Users already exist, no default admin created" 
      });
    }
  } catch (error) {
    console.error("Error in init API route:", error);
    return NextResponse.json(
      { success: false, message: "Failed to initialize admin user" },
      { status: 500 }
    );
  }
} 