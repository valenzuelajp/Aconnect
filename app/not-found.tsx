import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-[#300511] via-[#120206] to-[#050002] text-white p-6 relative overflow-hidden select-none">
      {/* Decorative gradient glowing circles in background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle,_rgba(139,21,56,0.15)_0%,_rgba(0,0,0,0)_70%)] blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle,_rgba(212,165,116,0.1)_0%,_rgba(0,0,0,0)_70%)] blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="max-w-md w-full bg-[#1e070e]/40 backdrop-blur-xl border border-white/10 p-10 rounded-2xl shadow-2xl text-center z-10 flex flex-col items-center">
        {/* Animated Icon / Number Container */}
        <div className="relative mb-6">
          <h1 className="text-8xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gold via-accent to-maroon-dark animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 bg-gradient-to-r from-gold via-accent to-maroon-dark blur-2xl opacity-30 -z-10 scale-110" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white mb-3">
          Page Not Found
        </h2>
        
        <p className="text-[#c7a7b2] text-sm leading-relaxed mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Back Home Button */}
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-[#120206] bg-gold hover:bg-[#ebd0b4] active:scale-95 transition-all duration-200 rounded-xl shadow-lg shadow-gold/20 w-full gap-2 focus:outline-none focus:ring-2 focus:ring-gold/50"
        >
          <i className="fas fa-home text-xs" />
          Back to Safety
        </Link>
      </div>
    </div>
  );
}
