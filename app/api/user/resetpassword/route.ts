import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function POST(req: NextRequest,) {
    const session = await auth();
    const sessionEmail = session?.user?.email;
    const { otp, newPassword,bodyEmail } = await req.json();
    const email = bodyEmail || sessionEmail;


    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({ message: 'User not found' });
        }
        if (!user.otpExpiry) {
            return NextResponse.json({ message: 'no otp found' });
        }

        if (user.otp !== otp || new Date() > user.otpExpiry) {
            return NextResponse.json({ message: 'Invalid or expired OTP' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { email },
            data: {
                hashedPassword: hashedPassword,
                otp: null,
                otpExpiry: null,
            },
        });

        return NextResponse.json({ message: 'Password reset successful' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }


}
