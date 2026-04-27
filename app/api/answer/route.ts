import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, time } = body;

    // Tentukan lokasi file txt (akan tersimpan di folder paling luar/root)
    const dataFilePath = path.join(process.cwd(), 'answers.txt');

    // Format data yang disimpan
    const logEntry = `${name} | ${time}\n`;

    // Tulis ke file
    fs.appendFileSync(dataFilePath, logEntry, 'utf8');

    // Munculkan log di Terminal VS Code supaya kita tahu ini berhasil dipanggil
    console.log(`[SUKSES] Menyimpan jawaban dari: ${name}`);

    return NextResponse.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('[ERROR] Gagal menyimpan data:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}