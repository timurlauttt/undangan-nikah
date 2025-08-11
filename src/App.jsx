import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [showInvitation, setShowInvitation] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const carouselRef = useRef(null);

  // Wedding date
  const weddingDate = new Date('2025-12-25T07:00:00');

  const stories = [
    {
      src: "story1.jpg",
      quote:
        `"A hundred hearts would be too few to carry all my love for you" — Unknown`,
    },
    {
      src: "story2.jpg",
      quote:
        `"Gravitation is not responsible for people falling in love" — Albert Einstein`,
    },
    {
      src: "story3.jpg",
      quote:
        `"If we look at the world with a love of life, the world will reveal its beauty to us" — Daisaku Ikeda`,
    },
    {
      src: "story4.jpg",
      quote:
        `"You are every reason, every hope and every dream I've ever had" — Nicholas Sparks`,
    },
  ];

  // Auto infinite scroll
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stories.length]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate.getTime() - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [weddingDate]);

  const handleOpenInvitation = () => {
    setIsTransitioning(true);

    // Delay untuk menampilkan animasi transisi
    setTimeout(() => {
      setShowInvitation(true);
      setIsTransitioning(false);
    }, 1000);
  };

  /** COVER PAGE */
  if (!showInvitation) {
    return (
      <div className="bg-white">
        {/* Transition Overlay */}
        <div className={`fixed inset-0 bg-white z-50 transition-all duration-1000 ${isTransitioning
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-0 pointer-events-none'
          }`}>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600 animate-pulse">Loading...</p>
            </div>
          </div>
        </div>

        {/* Cover Content */}
        <div className={`relative w-full h-screen max-w-md mx-auto transition-all duration-1000 ${isTransitioning
          ? 'opacity-0 transform scale-95'
          : 'opacity-100 transform scale-100'
          }`}>
          <img
            src="cover.jpg"
            alt="Wedding Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <div className="animate-fade-in-up">
              <p className="text-sm italic font-light tracking-wide">
                The wedding of
              </p>
              <h1 className="font-[Great_Vibes] text-4xl md:text-5xl font-bold mt-2 animate-fade-in-up animation-delay-200">
                John & Jane
              </h1>
              <h2 className="mt-2 text-sm md:text-base animate-fade-in-up animation-delay-400">
                Thursday, December 25th, 2025
              </h2>
            </div>
            <div className="mt-16 py-10 text-center animate-fade-in-up animation-delay-600">
              <button
                onClick={handleOpenInvitation}
                disabled={isTransitioning}
                className="px-8 py-3 bg-black text-white text-sm rounded-full shadow-lg hover:bg-gray-800 hover:shadow-xl hover:scale-105 transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTransitioning ? 'Opening...' : 'Open Invitation'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /** INVITATION PAGE */
  return (
    <div className={`bg-white text-gray-800 transition-all duration-1000 ${showInvitation
      ? 'opacity-100 transform translate-y-0'
      : 'opacity-0 transform translate-y-10'
      }`}>
      {/* HEADER */}
      <div className="relative w-full animate-fade-in">
        <img
          src="cover1.jpg"
          alt="Wedding Landscape"
          className="w-full h-64 md:h-96 object-cover"
        />
        <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center text-white drop-shadow-lg animate-fade-in-up animation-delay-300">
          <p className="text-sm italic font-light">The Wedding of</p>
          <h1 className="font-[Great_Vibes] text-xl md:text-5xl font-bold">
            John & Jane
          </h1>
          <p className="text-xs md:text-sm">Thursday, December 25th, 2025</p>
        </div>
      </div>

      {/* LOVE STORY */}
      <section className="py-8 bg-gradient-to-b from-gray-100 to-gray-200 animate-fade-in animation-delay-500">
        <h2 className="text-center text-xl md:text-2xl font-bold text-gray-900 mb-6 px-4">
          Our Love Story
        </h2>

        {/* SLIDER */}
        <div className="relative max-w-xs md:max-w-2xl mx-auto px-4">
          <div className="overflow-hidden rounded-2xl">
            <div
              ref={carouselRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {stories.map((story, idx) => (
                <div
                  key={idx}
                  className="relative flex-shrink-0 w-full"
                >
                  {/* Unified Layout - Same size for mobile and desktop */}
                  <div className="relative w-full">
                    <div className="aspect-[3/4] md:aspect-[4/3] w-full">
                      <img
                        src={story.src}
                        alt={`Story ${idx + 1}`}
                        className="w-full h-full object-cover rounded-xl shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl"></div>
                      <div className="absolute inset-0 flex items-end justify-center p-4 md:p-6">
                        <div className="text-center max-w-full">
                          <p className="text-white text-sm md:text-base leading-relaxed font-light drop-shadow-lg">
                            {story.quote}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - Desktop Only */}
          <div className="hidden md:block">
            <button
              onClick={() => setCurrentIndex((prev) => prev === 0 ? stories.length - 1 : prev - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200 z-10"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % stories.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200 z-10"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* PAGINATION */}
        <div className="mt-6 flex justify-center gap-1">
          {stories.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`rounded-full transition-all duration-300 ${idx === currentIndex
                ? "w-2 h-2 bg-gray-800"
                : "w-2 h-2 bg-gray-400 hover:bg-gray-600"
                }`}
            ></button>
          ))}
        </div>
      </section>

      {/* GROOM & BRIDE */}
      <section className="py-10 bg-gradient-to-b from-gray-200 to-white animate-fade-in animation-delay-700">
        <div className="grid grid-cols-2 gap-4 md:gap-8 max-w-sm md:max-w-2xl mx-auto px-4 md:px-6">
          {/* GROOM */}
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg bg-white flex items-center justify-center">
              <img
                src="groom.png"
                alt="Groom"
                className="w-full h-full object-cover grayscale"
              />
            </div>
            <p className="mt-3 md:mt-4 font-semibold text-gray-800 text-sm md:text-lg">
              John
            </p>
            <a
              href="https://instagram.com/username"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 text-xs md:text-base hover:text-black transition mt-1"
            >
              <i className="fas fa-instagram mr-1 text-black opacity-100"></i>
              @john
            </a>
          </div>

          {/* BRIDE */}
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg bg-white flex items-center justify-center">
              <img
                src="bride.jpg"
                alt="Bride"
                className="w-full h-full object-cover grayscale"
              />
            </div>
            <p className="mt-3 md:mt-4 font-semibold text-gray-800 text-sm md:text-lg">
              Jane
            </p>
            <a
              href="https://instagram.com/username"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 text-xs md:text-base hover:text-black transition mt-1"
            >
              @jane
            </a>
          </div>
        </div>
      </section>
      {/* WEDDING SCHEDULE */}
      <section className="py-8 bg-gradient-to-b from-white to-gray-100 animate-fade-in animation-delay-800">
        <div className="max-w-xs md:max-w-2xl mx-auto px-4 md:px-6">
          <h2 className="text-center text-xl md:text-2xl font-bold text-gray-900 mb-6 px-4">
            Wedding Schedule
          </h2>

          {/* Schedule Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Akad Nikah */}
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                Akad Nikah
              </h3>
              <p className="text-gray-700 font-semibold mb-1">
                Thursday, December 25th, 2025
              </p>
              <p className="text-gray-600 text-sm md:text-base mb-4">
                07:00 WIB
              </p>
              <div className="text-gray-700 text-sm md:text-base mb-4">
                <p className="font-medium">📍 Hotel X-More Hotel eL Royale</p>
                <p>Jl. Merdeka No.2, Braga, Kec. Sumur Bandung</p>
                <p>Kota Bandung, Jawa Barat 40111</p>
              </div>
              <div className="space-y-2">
                <button className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-700 transition">
                  📍 Navigasi Map
                </button>
                <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-500 transition">
                  📅 Simpan Tanggal
                </button>
              </div>
            </div>

            {/* Resepsi Nikah */}
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                Resepsi Nikah
              </h3>
              <p className="text-gray-700 font-semibold mb-1">
                Thursday, December 25th, 2025
              </p>
              <p className="text-gray-600 text-sm md:text-base mb-4">
                18:00 WIB
              </p>
              <div className="text-gray-700 text-sm md:text-base mb-4">
                <p className="font-medium">📍 Hotel X-More Hotel eL Royale</p>
                <p>Jl. Merdeka No.2, Braga, Kec. Sumur Bandung</p>
                <p>Kota Bandung, Jawa Barat 40111</p>
              </div>
              <div className="space-y-2">
                <button className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-700 transition">
                  📍 Navigasi Map
                </button>
                <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-500 transition">
                  📅 Simpan Tanggal
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COUNTDOWN TIMER */}
      <section className="py-8 bg-gradient-to-b from-gray-100 to-gray-200 animate-fade-in animation-delay-900">
        <div className="max-w-xs md:max-w-2xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 px-4">
            Counting Days
          </h2>
          <p className="text-sm md:text-base text-gray-600 mb-6 px-4">
            The clock is ticking! Get ready for the most important day of our lives.
            We can't wait to celebrate this special moment with you.
          </p>

          {/* Countdown Display */}
          <div className="grid grid-cols-4 gap-2 md:gap-4 mb-6">
            <div className="bg-white rounded-xl p-3 md:p-6 shadow-lg border border-gray-100">
              <div className="text-2xl md:text-4xl font-bold text-gray-800">
                {countdown.days}
              </div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">
                Days
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 md:p-6 shadow-lg border border-gray-100">
              <div className="text-2xl md:text-4xl font-bold text-gray-800">
                {countdown.hours}
              </div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">
                Hours
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 md:p-6 shadow-lg border border-gray-100">
              <div className="text-2xl md:text-4xl font-bold text-gray-800">
                {countdown.minutes}
              </div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">
                Minutes
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 md:p-6 shadow-lg border border-gray-100">
              <div className="text-2xl md:text-4xl font-bold text-gray-800">
                {countdown.seconds}
              </div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">
                Seconds
              </div>
            </div>
          </div>

          <button className="bg-gray-800 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-700 transition shadow-lg">
            Add to Calendar
          </button>
        </div>
      </section>
    </div>
  );
}

export default App;