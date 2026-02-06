import { NextResponse, NextRequest } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_PAYMENT_PUBLIC!,
    key_secret: process.env.PAYMENT_SECRET,
});

export async function POST(req: NextRequest) {
    try {
        const { amount } = await req.json();
        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: "order_rcptid_1234567890",
        });
        return NextResponse.json({ order}, { status: 200 });
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ status: 500 });
    }

}
