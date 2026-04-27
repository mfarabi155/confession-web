'use client';

import { useState, useEffect, useCallback, MouseEvent, TouchEvent, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// --- KOMPONEN KHUSUS TENOR EMBED ---
const TenorEmbed = ({ postId, ratio, href, text, searchHref, searchText }: any) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://tenor.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [postId]);

  return (
    <div className="w-full flex justify-center items-center pointer-events-none scale-110">
      <div 
        className="tenor-gif-embed" 
        data-postid={postId} 
        data-share-method="host" 
        data-aspect-ratio={ratio} 
        data-width="100%"
      >
        <a href={href}>{text}</a> from <a href={searchHref}>{searchText}</a>
      </div>
    </div>
  );
};

// --- KOMPONEN UTAMA CONFESSION ---
function ConfessionContent() {
  const searchParams = useSearchParams();
  const partnerName = searchParams.get('name') || 'Manis';

  const [hasStarted, setHasStarted] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [noPosition, setNoPosition] = useState<{ top: number; left: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
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
      const padding = 15; // Sedikit dikurangi agar ruang menghindar lebih luas di PC
      const btn = dodgingButtonRef.current || noButtonRef.current;
      const card = cardRef.current;
      
      if (!btn || !card) return;

      const buttonWidth = btn.offsetWidth;
      const buttonHeight = btn.offsetHeight;
      const cardRect = card.getBoundingClientRect();

      const maxX = Math.max(0, window.innerWidth - buttonWidth - (padding * 2));
      const maxY = Math.max(0, window.innerHeight - buttonHeight - (padding * 2));

      if (maxX > 0 && maxY > 0) {
        let newLeft = 0;
        let newTop = 0;
        let isOverlapping = true;
        let attempts = 0;

        while (isOverlapping && attempts < 50) {
          newLeft = Math.random() * maxX + padding;
          newTop = Math.random() * maxY + padding;

          const isIntersectingCard = !(
            newLeft + buttonWidth < cardRect.left - 10 || 
            newLeft > cardRect.right + 10 ||              
            newTop + buttonHeight < cardRect.top - 10 ||  
            newTop > cardRect.bottom + 10                 
          );

          if (!isIntersectingCard) {
            isOverlapping = false; 
          }
          attempts++;
        }

        if (isOverlapping) {
           newTop = newTop > window.innerHeight / 2 ? padding : maxY;
        }

        setNoPosition({ left: newLeft, top: newTop });
      }
    }
  }, []);

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
      <audio 
        ref={audioRef} 
        src="/mixkit-classical-vibes-2-682.mp3" 
        loop 
        hidden
      />

      {!hasStarted ? (
        /* 0. HALAMAN PEMBUKA */
        <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-rose-50 to-pink-100">
          <div className="bg-white/40 backdrop-blur-md p-10 rounded-[40px] shadow-xl text-center border border-white/50 animate-fade-in max-w-xs w-full max-h-[90vh] overflow-y-auto [scrollbar-width:none]">
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
        <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative bg-gradient-to-br from-pink-100 to-rose-200 overflow-hidden">
          <FloatingHearts />
          
          <div className="bg-white/60 backdrop-blur-lg p-6 md:p-10 rounded-[32px] shadow-2xl border border-white/20 z-10 max-w-[90vw] md:max-w-2xl w-full flex flex-col md:flex-row items-center gap-6 md:gap-10 max-h-[90vh] overflow-y-auto [scrollbar-width:none] animate-fade-in">
            
            {/* Kiri/Atas: GIF */}
            <div className="w-full md:w-1/2 flex justify-center shrink-0">
                <div className="relative flex items-center justify-center overflow-hidden rounded-full border-4 border-white shadow-xl bg-white w-48 h-48 md:w-56 md:h-56">
                <div className="absolute inset-0 bg-pink-300 rounded-full blur-3xl opacity-60 animate-pulse"></div>
                <div className="relative z-10 w-full h-full pointer-events-none scale-125">
                    <iframe 
                        src="https://tenor.com/embed/5374424377596685042" 
                        className="w-full h-full" 
                        frameBorder="0" 
                        allowFullScreen
                    ></iframe>
                </div>
                </div>
            </div>
            
            {/* Kanan/Bawah: Teks */}
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold text-pink-700 mb-6 tracking-tighter leading-none animate-pulse">
                YAYYY! ❤️
                </h1>
                
                <div className="bg-white/80 py-4 px-6 md:py-5 md:px-8 rounded-full inline-flex items-center gap-2 md:gap-3 shadow-sm border border-pink-100 mb-6 w-full justify-center md:justify-start">
                <span className="text-2xl md:text-3xl">💖</span>
                <p className="text-lg md:text-2xl font-semibold text-gray-800">
                    Aku seneng banget, {partnerName}!
                </p>
                <span className="text-2xl md:text-3xl">💖</span>
                </div>
                
                <p className="text-base md:text-lg text-gray-700 font-medium leading-relaxed">
                Tunggu kejutan selanjutnya ya! ;)
                </p>
            </div>
          </div>
        </main>
      ) : (
        /* 2. TAMPILAN UTAMA (NEMBAK) */
        <main className="min-h-screen flex flex-col items-center justify-center overflow-hidden font-sans relative p-4 md:p-6 bg-gradient-to-br from-rose-50 via-pink-100 to-rose-100 animate-fade-in">
          <FloatingHearts />

          {/* Menambahkan flex-col md:flex-row agar di laptop layarnya memanjang ke samping */}
          <div ref={cardRef} className="bg-white/50 backdrop-blur-xl p-6 md:p-10 rounded-[32px] shadow-[-10px_10px_30px_rgba(0,0,0,0.05),10px_-10px_30px_rgba(255,255,255,0.5)] border border-white/30 z-10 max-w-[90vw] md:max-w-3xl w-full flex flex-col md:flex-row items-center gap-6 md:gap-10 max-h-[90vh] overflow-y-auto [scrollbar-width:none]">
            
            {/* Kiri/Atas: Wadah GIF */}
            <div className="w-full md:w-1/2 flex justify-center shrink-0">
                <div className="relative flex items-center justify-center overflow-hidden rounded-full border-4 border-white shadow-xl bg-white w-44 h-44 md:w-60 md:h-60">
                    <div className="absolute inset-0 bg-pink-200 rounded-full blur-2xl opacity-70"></div>
                    <div className="relative z-10 w-full h-full pointer-events-none scale-125">
                        <iframe 
                        src="https://tenor.com/embed/5695742536452074587" 
                        className="w-full h-full" 
                        frameBorder="0" 
                        allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>
            
            {/* Kanan/Bawah: Teks & Tombol */}
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tighter leading-tight">
                Hei {partnerName},<br className="hidden md:block" /> Aku Punya Satu Pertanyaan...
                </h1>
                
                <p className="text-base md:text-lg text-gray-700 mb-8 font-medium leading-relaxed">
                Sejak lama, aku diam-diam perhatiin kamu. Ada sesuatu yang ingin aku sampaikan langsung...<br/>
                <strong className="text-pink-700 font-bold block mt-3">Mau nggak jadi pacarku?</strong>
                </p>

                <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4 relative w-full">
                <button 
                    onClick={handleYesClick}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 md:py-4 px-10 md:px-8 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg flex items-center justify-center gap-2 text-base md:text-lg z-20 animate-pulse-gentle w-full sm:w-auto"
                >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    Yes, I Will!
                </button>
                
                {!noPosition && (
                    <button 
                    ref={noButtonRef}
                    onMouseEnter={!isMobile ? handleNoInteraction : undefined}
                    onTouchStart={isMobile ? handleNoInteraction : undefined}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 px-7 rounded-full text-sm md:text-base z-20 w-full sm:w-auto md:min-w-[120px] justify-center flex items-center transition-colors"
                    >
                    No, Sorry 💔
                    </button>
                )}
                </div>
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
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 px-7 rounded-full text-sm md:text-base shadow-2xl border border-gray-300 min-w-[120px] justify-center flex items-center transition-all duration-200 ease-out"
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