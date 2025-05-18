import { RtcTokenBuilder, RtcRole } from "agora-access-token";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { channelName, uid } = await req.json();

  if (!channelName || !uid) {
    return NextResponse.json({ error: "Channel name and uid are required" }, { status: 400 });
  }


  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = currentTime + 60 * 60 * 2; // 2 hours

  const token = RtcTokenBuilder.buildTokenWithUid(
    process.env.AGORA_APP_ID!,
    process.env.AGORA_APP_CERTIFICATE!,
    channelName,
    uid,
    RtcRole.PUBLISHER,
    expirationTime
  );

  return NextResponse.json({ token }, { status: 200 });
}
