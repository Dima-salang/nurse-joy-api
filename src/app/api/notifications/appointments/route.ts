import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminMessaging } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
    const {userID, doctorID, appointmentTime} = await req.json();

    // push message to doctor

    try {
        const tokenDoc = await adminDb.collection('fcm-tokens').doc(doctorID).get();
        const token = tokenDoc.data()?.token;

        if (!token) {
            return NextResponse.json({ error: 'Doctor token not found' }, { status: 404 });
        }

        const message = {
            notification: {
                title: 'New Appointment',
                body: `You have a new appointment with ${userID} at ${appointmentTime}`,
            },
            token,
        };

        await adminMessaging.send(message);
        return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}