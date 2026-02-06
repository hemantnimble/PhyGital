import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
    const session = await auth();
    const userId = session?.user?.id;
    try {
        if (!userId) {
            return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
          }
      
          // Fetch addresses associated with the user
          const addresses = await prisma.address.findMany({
            where: {
              userId: userId,
            },
          });
      
          // Return the list of addresses
          return NextResponse.json({ addresses });
      
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
