import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, time } = body;

    // Tentukan lokasi file txt di root folder project
    const dataFilePath = path.join(process.cwd(), 'answers.txt');

    // Format log yang akan disimpan: "Nama | Tanggal & Waktu"
    const logEntry = `${name} | ${time}\n`;

    // Tulis ke file (append agar tidak menimpa data sebelumnya)
    fs.appendFileSync(dataFilePath, logEntry, 'utf8');

    return NextResponse.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}