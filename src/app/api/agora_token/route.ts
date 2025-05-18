import { RtcTokenBuilder, RtcRole } from "agora-token";
import { NextRequest, NextResponse } from "next/server";
import { firestore} from "@/utils/firebase";
import { doc, setDoc, collection } from "firebase/firestore/lite";

export async function POST(req: NextRequest) {
  const { chatRoomId, channelName, uid } = await req.json();

  if (!channelName || !uid) {
    return NextResponse.json({ error: "Channel name and uid are required" }, { status: 400 });
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = currentTime + 60 * 60 * 2; // 2 hours
  const privilegeExpiredTs = currentTime + 60 * 60 * 2;

  const token = RtcTokenBuilder.buildTokenWithUid(
    process.env.AGORA_APP_ID!,
    process.env.AGORA_APP_CERTIFICATE!,
    channelName,
    uid,
    RtcRole.PUBLISHER,
    expirationTime,
    privilegeExpiredTs,
  );

  await storeTokenFireStore(chatRoomId, channelName, uid, token, privilegeExpiredTs);

  return NextResponse.json({ token }, { status: 200 });
}

async function storeTokenFireStore(chatRoomId: string, channelName: string, uid: number, token: string, expiresAt: number) {
    // store the token in video-call collection in firestore
    
    const videoCallRef = collection(firestore, 'video-call');
    const docRef = doc(videoCallRef, channelName);
    await setDoc(docRef, {
        'chatRoomId': chatRoomId,
        'channelName': channelName,
        'uid': uid,
        'token': token,
        'expiresAt': expiresAt,
        'createdAt': new Date(),
    });
}