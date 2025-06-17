import { NextRequest, NextResponse } from "next/server";
import { initializeApp } from "firebase-admin";
import admin from "firebase-admin";

initializeApp();

export async function POST(req: NextRequest) {
    const {userID, doctorID, appointmentTime} = await req.json();

    // push message to doctor

    try {
        const tokenDoc = await admin.firestore().collection('fcm-tokens').doc(doctorID).get();
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

        await admin.messaging().send(message);
        return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}