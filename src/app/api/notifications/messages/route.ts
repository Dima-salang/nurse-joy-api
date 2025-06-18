import { adminMessaging, adminFirestore } from "@/utils/firebase";
import { NextRequest, NextResponse } from "next/server";

export async function OPTIONS() {
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return new NextResponse(null, { status: 200, headers });
}


export async function POST(req: NextRequest) {
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    try {
        const { senderID, receiverID, message } = await req.json();
        
        const tokenDoc = await adminFirestore.collection('fcm_tokens').doc(receiverID).get();
        const token = tokenDoc.data()?.fcm_token;  

        if (!token) {
            return NextResponse.json(
                { error: 'Receiver token not found' }, 
                { status: 404, headers }
            );
        }

        const notificationMessage = {
            notification: {
                title: `${senderID} sent you a message`,
                body: message,
            },
            token,
        };

        await adminMessaging.send(notificationMessage);
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