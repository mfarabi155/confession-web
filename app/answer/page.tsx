import fs from 'fs';
import path from 'path';

// Paksa Next.js untuk merender halaman ini secara dinamis (tidak di-cache statis)
export const dynamic = 'force-dynamic';

export default function AnswerDashboard() {
  const dataFilePath = path.join(process.cwd(), 'answers.txt');
  let answerLogs: { name: string; time: string }[] = [];

  // Proses membaca file lokal
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, 'utf8');
      
      // Pecah string berdasarkan baris baru, hapus yang kosong
      const lines = fileContent.split('\n').filter(line => line.trim() !== '');
      
      answerLogs = lines.map(line => {
        const [name, time] = line.split(' | ');
        return { name: name?.trim(), time: time?.trim() };
      });
    }
  } catch (error) {
    console.error("Gagal membaca file data:", error);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-800 font-sans">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 text-pink-600 border-b-2 border-pink-200 pb-4">
          Confession Dashboard 💌
        </h1>

        {answerLogs.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">Belum ada jawaban yang tersimpan di server.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-pink-50 text-pink-800 border-b border-pink-100">
                  <th className="py-4 px-6 font-semibold">No</th>
                  <th className="py-4 px-6 font-semibold">Nama Pasangan</th>
                  <th className="py-4 px-6 font-semibold">Waktu Klik "Yes"</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {answerLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-gray-500">{index + 1}</td>
                    <td className="py-4 px-6 font-medium text-gray-900">{log.name}</td>
                    <td className="py-4 px-6 text-gray-600">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}