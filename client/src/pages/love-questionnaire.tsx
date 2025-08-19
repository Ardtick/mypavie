import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Music, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Floating background emojis component
const FloatingEmojis = ({ count = 18 }: { count?: number }) => {
  const items = useMemo(() => {
    const emojis = ["❤️", "💖", "💕", "💘", "✨", "💝", "💞", "🌸", "🌺"];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      left: Math.random() * 100,
      duration: 8 + Math.random() * 8,
      delay: Math.random() * 5,
      size: 16 + Math.random() * 16,
    }));
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{ y: -80, opacity: 1 }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            repeatType: "loop"
          }}
          style={{
            left: `${item.left}%`,
            fontSize: item.size
          }}
          className="absolute floating-emoji"
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
};

// Background decorative hearts
const BackgroundHearts = () => (
  <div className="fixed inset-0 pointer-events-none z-0">
    <div className="absolute top-10 left-10 text-pink-200 text-2xl animate-pulse-heart">💕</div>
    <div className="absolute top-20 right-20 text-rose-200 text-xl animate-pulse-heart" style={{ animationDelay: "0.5s" }}>💖</div>
    <div className="absolute bottom-20 left-20 text-pink-200 text-lg animate-pulse-heart" style={{ animationDelay: "1s" }}>💗</div>
    <div className="absolute bottom-10 right-10 text-rose-200 text-2xl animate-pulse-heart" style={{ animationDelay: "1.5s" }}>💓</div>
    <div className="absolute top-1/2 left-5 text-pink-100 text-sm animate-pulse-heart" style={{ animationDelay: "2s" }}>🌸</div>
    <div className="absolute top-1/3 right-5 text-rose-100 text-sm animate-pulse-heart" style={{ animationDelay: "2.5s" }}>🌺</div>
  </div>
);

// Music controls component
const MusicControls = ({ musicPlaying, toggleMusic }: { musicPlaying: boolean; toggleMusic: () => void }) => (
  <div className="fixed top-5 right-5 z-50">
    <Button
      onClick={toggleMusic}
      size="icon"
      className="bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/90 transition-all duration-300 hover:scale-105"
      data-testid="button-toggle-music"
    >
      {musicPlaying ? (
        <Pause className="w-5 h-5 text-pink-500" />
      ) : (
        <Music className="w-5 h-5 text-pink-500" />
      )}
    </Button>
  </div>
);

// Progress bar component
const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="fixed top-0 left-0 right-0 z-40 bg-white/10 backdrop-blur-sm">
    <motion.div
      className="h-1 bg-gradient-to-r from-pink-500 to-rose-500"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    />
  </div>
);

// Step wrapper with animations
const StepWrapper = ({ children, keyName }: { children: React.ReactNode; keyName: string }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={keyName}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -24, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 120, damping: 16 }}
      className="w-full"
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

// Confetti animation
const ConfettiAnimation = ({ show }: { show: boolean }) => {
  const confettiItems = useMemo(() => {
    const emojis = ['🎉', '💖', '✨', '🌸', '💕', '🎊'];
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 100,
      delay: i * 100,
    }));
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confettiItems.map((item) => (
        <motion.div
          key={item.id}
          className="absolute text-2xl"
          style={{ left: `${item.left}%`, top: "-50px" }}
          initial={{ y: -50, opacity: 0, rotate: 0 }}
          animate={{ 
            y: window.innerHeight + 50, 
            opacity: 1, 
            rotate: Math.random() * 360 
          }}
          transition={{
            duration: 5,
            delay: item.delay / 1000,
            ease: "easeOut"
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default function LoveQuestionnaire() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [partner, setPartner] = useState("");
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noMoves, setNoMoves] = useState(0);
  const [error, setError] = useState("");
  const [loveValue, setLoveValue] = useState(50);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [music, setMusic] = useState<HTMLAudioElement | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Valid names and partners for validation
  const validNames = [
    "pavita", "papita", "pavita rheanne", "papita rheanne",
    "pavita rheanne alastair", "papita rheanne alastair",
    "riona", "gienka", "irish", "jolene"
  ];

  const validPartners = [
    "heru", "heiu", "heru dewanto", "heiu dewanto",
    "stiven", "stiven cullen", "gohyong", "gohyong hotteok",
    "kang deni mujaer", "juned"
  ];

  // Initialize background music when reaching step 2
  useEffect(() => {
    if (step === 2 && !music) {
      const audio = new Audio("https://files.catbox.moe/l3gi5l.m4a");
      audio.loop = true;
      audio.volume = 0.3;
      audio.play().catch(() => {
        console.log("Could not play audio");
      });
      setMusic(audio);
      setMusicPlaying(true);
    }
  }, [step, music]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (music) {
        music.pause();
        music.src = "";
      }
    };
  }, [music]);

  const progress = Math.round(((step) / 5) * 100);

  const toggleMusic = () => {
    if (music) {
      if (musicPlaying) {
        music.pause();
      } else {
        music.play().catch(() => {
          console.log("Could not play audio");
        });
      }
      setMusicPlaying(!musicPlaying);
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("JWB!!");
      return;
    }
    if (validNames.includes(name.toLowerCase())) {
      setError("");
      setStep(2);
    } else {
      setError("Trverifkasi BKAN LUKH ORGNA!!!");
    }
  };

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner.trim()) {
      setError("JWB!!");
      return;
    }
    if (validPartners.includes(partner.toLowerCase())) {
      setError("");
      setStep(3);
    } else {
      setError("SAPA ITU?!! ITU BUKAN PACAL KM😤");
    }
  };

  const dodgeButton = () => {
    const maxX = 160;
    const maxY = 120;
    const nx = (Math.random() * maxX - maxX / 2) | 0;
    const ny = (Math.random() * maxY - maxY / 2) | 0;
    setNoPos({ x: nx, y: ny });
    setNoMoves((c) => c + 1);
  };

  const getLoveMessage = (value: number) => {
    if (value < 30) return "Hmm... bisa lebih sayang lagi 🤔";
    if (value < 60) return "Lumayan sayang nih 😊";
    if (value < 80) return "Cinta yang mendalam! 💕";
    return "Cinta sejati! 💖✨";
  };

  const handleContinue = () => {
    setStep(5);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Love Test Results',
        text: `${name} dan ${partner} memiliki tingkat cinta ${loveValue}%!`,
        url: window.location.href
      });
    } else {
      const text = `${name} dan ${partner} memiliki tingkat cinta ${loveValue}%!`;
      navigator.clipboard.writeText(text).then(() => {
        alert('Hasil telah disalin ke clipboard!');
      });
    }
  };

  const restartQuiz = () => {
    setStep(1);
    setName("");
    setPartner("");
    setNoPos({ x: 0, y: 0 });
    setNoMoves(0);
    setError("");
    setLoveValue(50);
    setShowConfetti(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-100 to-pink-200 text-gray-800 font-sans overflow-x-hidden relative">
      <FloatingEmojis count={22} />
      <BackgroundHearts />
      <MusicControls musicPlaying={musicPlaying} toggleMusic={toggleMusic} />
      <ProgressBar progress={progress} />
      <ConfettiAnimation show={showConfetti} />

      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center relative">
          
          {step === 1 && (
            <StepWrapper keyName="step1">
              <div className="mb-6">
                <div className="text-pink-500 text-4xl mb-4 animate-bounce-gentle">💝</div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                  Sp nmamu?
                </h1>
                <p className="text-gray-600 text-sm">msukan dngn bnar</p>
              </div>

              <form onSubmit={handleNameSubmit} className="space-y-4">
                <div className="mb-4">
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ketik namamu di sini..."
                    className="w-full border-2 border-pink-200 focus:border-pink-400 focus:outline-none p-3 rounded-xl mb-3 text-center font-medium transition-all duration-300 hover:border-pink-300 focus:ring-2 focus:ring-pink-200"
                    data-testid="input-name"
                  />
                  {error && <p className="text-red-500 text-sm" data-testid="text-name-error">{error}</p>}
                </div>

                <Button
                  type="submit"
                  className="btn-primary text-white px-8 py-3 rounded-full shadow-lg font-medium w-full sm:w-auto"
                  data-testid="button-submit-name"
                >
                  Neks ➝
                </Button>
              </form>
            </StepWrapper>
          )}

          {step === 2 && (
            <StepWrapper keyName="step2">
              <div className="mb-6">
                <div className="text-4xl mb-4 animate-bounce-gentle">😍</div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                  {name} pacalna siapa nii?
                </h1>
                <p className="text-gray-600 text-sm">
                  sebutkan nama si tamvan n pemberani itu ✨
                </p>
              </div>

              <form onSubmit={handlePartnerSubmit} className="space-y-4">
                <div className="mb-4">
                  <Input
                    type="text"
                    value={partner}
                    onChange={(e) => setPartner(e.target.value)}
                    placeholder="Nama pacarmu..."
                    className="w-full border-2 border-pink-200 focus:border-pink-400 focus:outline-none p-3 rounded-xl mb-3 text-center font-medium transition-all duration-300 hover:border-pink-300 focus:ring-2 focus:ring-pink-200"
                    data-testid="input-partner"
                  />
                  {error && <p className="text-red-500 text-sm" data-testid="text-partner-error">{error}</p>}
                </div>

                <Button
                  type="submit"
                  className="btn-primary text-white px-8 py-3 rounded-full shadow-lg font-medium w-full sm:w-auto"
                  data-testid="button-submit-partner"
                >
                  Next ➝
                </Button>
              </form>
            </StepWrapper>
          )}

          {step === 3 && (
            <StepWrapper keyName="step3">
              <div className="mb-8">
                <div className="text-4xl mb-4 animate-bounce-gentle">❓</div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                  {name} sayang {partner} gak?
                </h1>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
                <Button
                  onClick={() => setStep(4)}
                  className="btn-primary text-white px-8 py-3 rounded-full shadow-lg font-medium flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                  data-testid="button-yes"
                >
                  <Heart className="w-5 h-5" fill="currentColor" />
                  YA 💖
                </Button>

                <motion.div
                  style={{ translateX: noPos.x, translateY: noPos.y }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                >
                  <Button
                    variant="secondary"
                    className="bg-white/80 hover:bg-white text-gray-900 px-8 py-3 rounded-full shadow-lg font-medium transition-all duration-200 hover:scale-105"
                    onMouseEnter={dodgeButton}
                    onTouchStart={dodgeButton}
                    onClick={dodgeButton}
                    data-testid="button-no"
                  >
                    TIDAK 🙈
                  </Button>
                </motion.div>
              </div>

              {noMoves > 0 && (
                <p className="text-gray-600 text-sm mt-4" data-testid="text-dodge-message">
                  Hehe… tombol "Tidak" suka malu-malu kucing 😆
                </p>
              )}
            </StepWrapper>
          )}

          {step === 4 && (
            <StepWrapper keyName="step4">
              <div className="mb-8">
                <div className="text-4xl mb-4 animate-bounce-gentle">💓</div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                  Seberapa sayang {name} sama {partner}?
                </h1>
              </div>

              <div className="mb-8">
                <div className="relative mb-6">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={loveValue}
                    onChange={(e) => setLoveValue(parseInt(e.target.value))}
                    className="love-slider w-full cursor-pointer"
                    data-testid="slider-love"
                  />
                </div>

                <div className="text-center">
                  <span className="text-4xl font-bold text-pink-500" data-testid="text-love-value">
                    {loveValue}
                  </span>
                  <span className="text-2xl text-pink-400">%</span>
                  <div className="mt-2 text-gray-600">
                    <span data-testid="text-love-message">{getLoveMessage(loveValue)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleContinue}
                className="btn-primary text-white px-8 py-3 rounded-full shadow-lg font-medium w-full sm:w-auto"
                data-testid="button-continue"
              >
                Lanjut ➝
              </Button>
            </StepWrapper>
          )}

          {step === 5 && (
            <StepWrapper keyName="step5">
              <div className="mb-6">
                <div className="text-6xl mb-4 animate-bounce-gentle">🎉</div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                  Hasil Test Cinta!
                </h1>
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 mb-6">
                <div className="text-lg text-gray-700 mb-4">
                  <span className="font-semibold text-pink-600" data-testid="text-result-name">{name}</span> dan{" "}
                  <span className="font-semibold text-pink-600" data-testid="text-result-partner">{partner}</span>
                </div>
                
                <div className="text-5xl font-bold text-pink-500 mb-2">
                  <span data-testid="text-result-percentage">{loveValue}</span>%
                </div>
                
                <div className="text-xl text-gray-600 mb-4" data-testid="text-final-message">
                  {getLoveMessage(loveValue)}
                </div>
                
                <div className="text-sm text-gray-500">
                  Tingkat kompatibilitas kalian sangat tinggi! ✨
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={shareResults}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full shadow-lg font-medium w-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                  data-testid="button-share"
                >
                  Share Hasil 📱
                </Button>
                
                <Button
                  onClick={restartQuiz}
                  className="btn-primary text-white px-8 py-3 rounded-full shadow-lg font-medium w-full"
                  data-testid="button-restart"
                >
                  Test Lagi 🔄
                </Button>
              </div>
            </StepWrapper>
          )}

        </div>
      </div>
    </div>
  );
}
