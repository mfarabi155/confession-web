'use client';

import { useState, useEffect, useCallback, MouseEvent, TouchEvent, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// --- KOMPONEN UTAMA CONFESSION ---
function ConfessionContent() {
  const searchParams = useSearchParams();
  const partnerName = searchParams.get('name') || 'Manis';

  const [hasStarted, setHasStarted] = useState(false); // Halaman pembuka agar musik bisa jalan
  const [accepted, setAccepted] = useState(false);
  const [noPosition, setNoPosition] = useState<{ top: number; left: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const dodgingButtonRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const detectMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    detectMobile();
    window.addEventListener('resize', detectMobile);
    return () => window.removeEventListener('resize', detectMobile);
  }, []);

  const handleNoInteraction = useCallback((e: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>) => {
    if ('targetTouches' in e && e.type === 'touchstart') {
      e.preventDefault(); 
    }

    if (typeof window !== 'undefined') {
      const padding = 20; 
      const btn = dodgingButtonRef.current || noButtonRef.current;
      if (!btn) return;

      const buttonWidth = btn.offsetWidth;
      const buttonHeight = btn.offsetHeight;

      const maxX = Math.max(0, window.innerWidth - buttonWidth - (padding * 2));
      const maxY = Math.max(0, window.innerHeight - buttonHeight - (padding * 2));

      if (maxX > 0 && maxY > 0) {
        const newLeft = Math.random() * maxX + padding;
        const newTop = Math.random() * maxY + padding;
        setNoPosition({ left: newLeft, top: newTop });
      }
    }
  }, []);

  // Fungsi untuk memulai (Buka Pesan & Play Musik)
  const startConfession = () => {
    setHasStarted(true);
    if (audioRef.current) {
      audioRef.current.play().catch(error => console.log("Audio play failed:", error));
    }
  };

  const handleYesClick = () => {
    setAccepted(true);
  };

  return (
    <>
      {/* File MP3 ditarik langsung dari folder public */}
      <audio 
        ref={audioRef} 
        src="/mixkit-classical-vibes-2-682.mp3" 
        loop 
        hidden
      />

      {!hasStarted ? (
        /* 0. HALAMAN PEMBUKA (Wajib agar browser mengizinkan musik autoplay) */
        <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-rose-50 to-pink-100">
          <div className="bg-white/40 backdrop-blur-md p-10 rounded-[40px] shadow-xl text-center border border-white/50 animate-fade-in max-w-xs w-full">
            <span className="text-6xl mb-6 block animate-bounce">💌</span>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Ada sebuah pesan untukmu...</h2>
            <button 
              onClick={startConfession}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-10 rounded-full shadow-lg transition-transform transform hover:scale-110 active:scale-95"
            >
              Buka Pesan
            </button>
          </div>
        </main>
      ) : accepted ? (
        /* 1. TAMPILAN SUKSES (YES) */
        <main className="min-h-screen flex flex-col items-center justify-center p-6 relative bg-gradient-to-br from-pink-100 to-rose-200 overflow-hidden">
          <FloatingHearts />
          
          <div className="bg-white/60 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/20 text-center z-10 max-w-lg w-full animate-fade-in">
            <div className="relative flex items-center justify-center mx-auto mb-10 overflow-hidden rounded-full border-4 border-white shadow-xl bg-white w-48 h-48 md:w-56 md:h-56">
              <div className="absolute inset-0 bg-pink-300 rounded-full blur-3xl opacity-60 animate-pulse"></div>
              <div className="relative z-10 w-full h-full pointer-events-none scale-125">
                  {/* Iframe Tenor Pengganti Script - Super Aman di React */}
                  <iframe 
                    src="https://tenor.com/embed/5374424377596685042" 
                    className="w-full h-full" 
                    frameBorder="0" 
                    allowFullScreen
                  ></iframe>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-pink-700 mb-6 tracking-tighter leading-none animate-pulse">
              YAYYY! ❤️
            </h1>
            
            <div className="bg-white/80 py-5 px-8 rounded-full inline-flex items-center gap-3 shadow-sm border border-pink-100 mb-6 w-full justify-center">
              <span className="text-3xl">💖</span>
              <p className="text-xl md:text-2xl font-semibold text-gray-800">
                Aku seneng banget, {partnerName}!
              </p>
              <span className="text-3xl">💖</span>
            </div>
            
            <p className="text-lg text-gray-700 font-medium leading-relaxed max-w-sm mx-auto mb-4">
              Tunggu kejutan selanjutnya ya! ;)
            </p>
          </div>
        </main>
      ) : (
        /* 2. TAMPILAN UTAMA (NEMBAK) */
        <main className="min-h-screen flex flex-col items-center justify-center overflow-hidden font-sans relative p-6 bg-gradient-to-br from-rose-50 via-pink-100 to-rose-100 animate-fade-in">
          <FloatingHearts />

          <div className="bg-white/50 backdrop-blur-xl p-8 md:p-12 rounded-[32px] shadow-[-10px_10px_30px_rgba(0,0,0,0.05),10px_-10px_30px_rgba(255,255,255,0.5)] border border-white/30 text-center z-10 max-w-md w-full">
            
            <div className="relative flex items-center justify-center mx-auto mb-10 overflow-hidden rounded-full border-4 border-white shadow-xl bg-white w-44 h-44 md:w-52 md:h-52">
                <div className="absolute inset-0 bg-pink-200 rounded-full blur-2xl opacity-70"></div>
                <div className="relative z-10 w-full h-full pointer-events-none scale-125">
                    {/* Iframe Tenor Pengganti Script - Super Aman di React */}
                    <iframe 
                      src="https://tenor.com/embed/5695742536452074587" 
                      className="w-full h-full" 
                      frameBorder="0" 
                      allowFullScreen
                    ></iframe>
                </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tighter leading-tight">
              Hei {partnerName}, Aku Punya Satu Pertanyaan...
            </h1>
            
            <p className="text-lg text-gray-700 mb-12 font-medium leading-relaxed max-w-sm mx-auto">
              Sejak lama, aku diam-diam perhatiin kamu. Ada sesuatu yang ingin aku sampaikan langsung...<br/>
              <strong className="text-pink-700 font-bold block mt-3">Mau nggak jadi pacarku?</strong>
            </p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-6 relative min-h-[60px] w-full">
              <button 
                onClick={handleYesClick}
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-12 md:px-10 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg flex items-center gap-2 text-lg z-20 animate-pulse-gentle w-full md:w-auto justify-center"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                Yes, I Will!
              </button>
              
              {!noPosition && (
                <button 
                  ref={noButtonRef}
                  onMouseEnter={!isMobile ? handleNoInteraction : undefined}
                  onTouchStart={isMobile ? handleNoInteraction : undefined}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 px-7 rounded-full text-sm z-20 w-full md:w-auto md:min-w-[120px] justify-center flex items-center transition-colors"
                >
                  No, Sorry 💔
                </button>
              )}
            </div>
          </div>

          {/* TOMBOL NO MENGHINDAR */}
          {noPosition && (
            <button 
              ref={dodgingButtonRef}
              onMouseEnter={!isMobile ? handleNoInteraction : undefined}
              onTouchStart={isMobile ? handleNoInteraction : undefined}
              onClick={(e) => { e.preventDefault(); handleNoInteraction(e); }}
              style={{ 
                  position: 'fixed', 
                  top: `${noPosition.top}px`, 
                  left: `${noPosition.left}px`,
                  zIndex: 9999,
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 px-7 rounded-full text-sm shadow-2xl border border-gray-300 min-w-[120px] justify-center flex items-center transition-all duration-200 ease-out"
            >
              No, Sorry 💔
            </button>
          )}

          {/* Footer Watermark */}
          <div className="absolute bottom-4 text-center z-10 w-full px-4 pointer-events-none">
            <p className="text-xs text-pink-400 font-mono tracking-widest opacity-80 uppercase">
              Made with Love especially for you (Mas Abi ❤️)
            </p>
          </div>
        </main>
      )}
    </>
  );
}

// --- SUB-KOMPONEN ANIMASI HATI ---
const FloatingHearts = () => {
  const [hearts, setHearts] = useState<{ id: number; left: string; size: number; delay: string; duration: string }[]>([]);

  useEffect(() => {
    const generatedHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * (24 - 12) + 12,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * (15 - 7) + 7}s`,
    }));
    setHearts(generatedHearts);
  }, []);

  if (hearts.length === 0) return null;

  return (
    <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
      {hearts.map((heart) => (
        <svg
          key={heart.id}
          className="absolute animate-float text-pink-300 opacity-0"
          style={{
            left: heart.left,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            animationDelay: heart.delay,
            animationDuration: heart.duration,
            bottom: '-24px',
          }}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ))}
    </div>
  );
};

// --- RENDER UTAMA DENGAN SUSPENSE ---
export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="animate-pulse text-pink-400 font-bold">Loading...</div>
      </div>
    }>
      <ConfessionContent />
    </Suspense>
  );
}