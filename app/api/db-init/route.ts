import { NextResponse } from "next/server";
import { initializeDefaultAdmin } from "@/lib/initAdmin";

// This route is called to initialize the database
export async function GET() {
  try {
    await initializeDefaultAdmin();
    
    return NextResponse.json({ 
      success: true, 
      message: "Database initialized successfully" 
    });
  } catch (error) {
    console.error("Error initializing database:", error);
    return NextResponse.json(
      { success: false, message: "Failed to initialize database" },
      { status: 500 }
    );
  }
} 