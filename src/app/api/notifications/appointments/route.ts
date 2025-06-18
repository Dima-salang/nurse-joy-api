import { NextRequest, NextResponse } from "next/server";
import { adminFirestore, adminMessaging } from "@/utils/firebase";

export async function POST(req: NextRequest) {
    // Add CORS headers
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');


    try {
        const { userID, doctorID, appointmentDateTime } = await req.json();

        // Fix the collection name to match where you're storing tokens
        const tokenDoc = await adminFirestore.collection('fcm_tokens').doc(doctorID).get();
        const token = tokenDoc.data()?.fcm_token;  // Changed from token to fcm_token

        if (!token) {
            return NextResponse.json(
                { error: 'Doctor token not found' }, 
                { status: 404, headers }
            );
        }

        const message = {
            notification: {
                title: 'New Appointment',
                body: `You have a new appointment with user ${userID} at ${new Date(appointmentDateTime).toLocaleString()}`,
            },
            token,
        };

        await adminMessaging.send(message);
        return NextResponse.json(
            { message: 'Message sent successfully' }, 
            { status: 200, headers }
        );
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json(
            { error: 'Failed to send message', details: error }, 
            { status: 500, headers }
        );
    }
}