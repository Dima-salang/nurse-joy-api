import admin from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { userID, token } = await req.json();

    try {
        await admin.firestore().collection('fcm-tokens').doc(userID).set({ token }, { merge: true });
        return NextResponse.json({ message: 'Token saved successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error saving token:', error);
        return NextResponse.json({ error: 'Failed to save token' }, { status: 500 });
    }
}