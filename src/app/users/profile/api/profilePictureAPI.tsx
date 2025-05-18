import { NextResponse, NextRequest } from "next/server";
import fs, { write } from "fs";
import path from "path";

// disable body parser
export const config = {
    api: {
        bodyParser: false,
    },
};


// ensure that the public/uploads/profile-picture dir exists
const uploadDir = path.join(process.cwd(), "public", "uploads", "profile-picture");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req: NextRequest) {
  // Read request body as a buffer

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const userID = formData.get("userID") as string;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Save file to disk
  const fileName = `${userID}${path.extname(file.name)}`;

  const filePath = path.join(uploadDir, fileName);
  const writeStream = fs.createWriteStream(filePath);
  
  writeStream.write(Buffer.from(await file.arrayBuffer()));
  writeStream.end();

  return NextResponse.json({url: `/uploads/profile-picture/${fileName}`}, {status: 200});
}


export async function GET(req: NextRequest) {
  const userID = req.nextUrl.searchParams.get("userID");
  const filePath = path.join(uploadDir, `${userID}.jpg`);
  return NextResponse.json({url: `/uploads/profile-picture/${userID}.jpg`}, {status: 200});
}