import { useState, useEffect, useRef } from "react";
import Swal from 'sweetalert2';

function App() {
  const [showInvitation, setShowInvitation] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const carouselRef = useRef(null);
  const audioRef = useRef(null);

  // Wedding date
  const weddingDate = new Date('2025-12-25T07:00:00');

  // Bank account information
  const bankAccounts = [
    {
      bankName: "Bank BCA",
      accountNumber: "1234567890",
      accountName: "John Doe"
    },
    {
      bankName: "Bank Mandiri",
      accountNumber: "0987654321",
      accountName: "Jane Smith"
    }
  ];

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

  useEffect(() => {
    if (showGiftModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showGiftModal]);

  // Initialize audio when component mounts or showInvitation changes
  useEffect(() => {
    const initializeAudio = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.3; // Set volume to 30%

        const handleCanPlay = () => {
          setAudioError(false);
          setAudioLoaded(true);
          console.log('Audio is ready to play');
        };

        const handleError = (e) => {
          setAudioError(true);
          setAudioLoaded(false);
          console.error('Audio loading error:', e);
        };

        const handlePlay = () => {
          setIsPlaying(true);
          console.log('Audio started playing');
        };

        const handlePause = () => {
          setIsPlaying(false);
          console.log('Audio paused');
        };

        const handleEnded = () => {
          setIsPlaying(false);
          console.log('Audio ended');
        };

        // Add event listeners
        audioRef.current.addEventListener('canplaythrough', handleCanPlay);
        audioRef.current.addEventListener('error', handleError);
        audioRef.current.addEventListener('play', handlePlay);
        audioRef.current.addEventListener('pause', handlePause);
        audioRef.current.addEventListener('ended', handleEnded);

        // Try to load the audio
        audioRef.current.load();

        return () => {
          if (audioRef.current) {
            audioRef.current.removeEventListener('canplaythrough', handleCanPlay);
            audioRef.current.removeEventListener('error', handleError);
            audioRef.current.removeEventListener('play', handlePlay);
            audioRef.current.removeEventListener('pause', handlePause);
            audioRef.current.removeEventListener('ended', handleEnded);
          }
        };
      }
    };

    // Initialize audio when invitation is shown
    if (showInvitation) {
      initializeAudio();
    }
  }, [showInvitation]);

  const handleOpenInvitation = async () => {
    setIsTransitioning(true);

    // Delay untuk menampilkan animasi transisi
    setTimeout(() => {
      setShowInvitation(true);
      setIsTransitioning(false);

      // Try to auto-play after transition
      setTimeout(() => {
        if (audioRef.current && !audioError && audioLoaded) {
          audioRef.current.play().catch(error => {
            console.log('Auto-play prevented:', error);
            // Auto-play failed, user will need to manually click play button
          });
        }
      }, 500);
    }, 1000);
  };

  const toggleMusic = async () => {
    if (!audioRef.current) {
      console.error('Audio reference not found');
      return;
    }

    if (audioError || !audioLoaded) {
      console.log('Audio not loaded or has error');
      return;
    }

    try {
      if (isPlaying) {
        // Pause the music
        audioRef.current.pause();
        console.log('Music paused by user');
      } else {
        // Play the music
        audioRef.current.currentTime = 0; // Reset to beginning
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          await playPromise;
          console.log('Music started by user');
        }
      }
    } catch (error) {
      console.error('Toggle music failed:', error);
      setAudioError(true);

      // Show user-friendly error message
      if (error.name === 'NotAllowedError') {
        console.log('Play prevented by browser policy - user gesture required');
      } else if (error.name === 'NotSupportedError') {
        console.log('Audio format not supported');
      } else {
        console.log('Unknown audio error:', error.message);
      }
    }
  };

  // Function to show wedding gift with SweetAlert
  const showWeddingGiftAlert = () => {
    Swal.fire({
      title: '<div style="color: #374151; font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem;">🎁 Wedding Gift</div>',
      html: `
        <div style="text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
          <p style="margin-bottom: 24px; text-align: center; color: #6b7280; font-size: 14px; line-height: 1.5;">
            Thank you for your kindness! You can send your gift to our bank accounts below:
          </p>
          
          <!-- Bank BCA -->
          <div style="background: linear-gradient(to bottom, #ffffff, #f9fafb); padding: 20px; border-radius: 16px; margin-bottom: 16px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h4 style="margin: 0; font-weight: 700; color: #374151; font-size: 18px;">Bank BCA</h4>
              <button onclick="copyToClipboard('1234567890')" style="background: linear-gradient(to bottom, #374151, #1f2937); color: white; padding: 8px 16px; border: none; border-radius: 8px; font-size: 12px; font-weight: 500; cursor: pointer; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(0, 0, 0, 0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.1)'">
                Copy
              </button>
            </div>
            <div>
              <p style="margin: 6px 0; font-size: 12px; color: #6b7280; font-weight: 500;">Account Number:</p>
              <p style="margin: 6px 0 12px 0; font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold; color: #111827; letter-spacing: 1px;">1234567890</p>
              <p style="margin: 6px 0; font-size: 12px; color: #6b7280; font-weight: 500;">Account Name:</p>
              <p style="margin: 6px 0; font-weight: 600; color: #374151; font-size: 16px;">John Doe</p>
            </div>
          </div>

          <!-- Bank Mandiri -->
          <div style="background: linear-gradient(to bottom, #ffffff, #f9fafb); padding: 20px; border-radius: 16px; margin-bottom: 24px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h4 style="margin: 0; font-weight: 700; color: #374151; font-size: 18px;">Bank Mandiri</h4>
              <button onclick="copyToClipboard('0987654321')" style="background: linear-gradient(to bottom, #374151, #1f2937); color: white; padding: 8px 16px; border: none; border-radius: 8px; font-size: 12px; font-weight: 500; cursor: pointer; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(0, 0, 0, 0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.1)'">
                Copy
              </button>
            </div>
            <div>
              <p style="margin: 6px 0; font-size: 12px; color: #6b7280; font-weight: 500;">Account Number:</p>
              <p style="margin: 6px 0 12px 0; font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold; color: #111827; letter-spacing: 1px;">0987654321</p>
              <p style="margin: 6px 0; font-size: 12px; color: #6b7280; font-weight: 500;">Account Name:</p>
              <p style="margin: 6px 0; font-weight: 600; color: #374151; font-size: 16px;">Jane Smith</p>
            </div>
          </div>

          <!-- Digital Wallets -->
          <div style="border-top: 2px solid #e5e7eb; padding-top: 20px;">
            <p style="text-align: center; font-size: 14px; color: #6b7280; margin-bottom: 16px; font-weight: 500;">Or send via digital wallet:</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
              <button onclick="showDigitalWallet('DANA')" style="background: linear-gradient(to bottom, #3b82f6, #2563eb); color: white; padding: 12px 8px; border: none; border-radius: 12px; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 12px -1px rgba(59, 130, 246, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px -1px rgba(59, 130, 246, 0.3)'">DANA</button>
              <button onclick="showDigitalWallet('OVO')" style="background: linear-gradient(to bottom, #7c3aed, #6d28d9); color: white; padding: 12px 8px; border: none; border-radius: 12px; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(124, 58, 237, 0.3); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 12px -1px rgba(124, 58, 237, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px -1px rgba(124, 58, 237, 0.3)'">OVO</button>
              <button onclick="showDigitalWallet('GoPay')" style="background: linear-gradient(to bottom, #16a34a, #15803d); color: white; padding: 12px 8px; border: none; border-radius: 12px; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(22, 163, 74, 0.3); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 12px -1px rgba(22, 163, 74, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px -1px rgba(22, 163, 74, 0.3)'">GoPay</button>
            </div>
          </div>

          <div style="text-align: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0; line-height: 1.5; font-style: italic;">
              Your presence is the greatest gift, but if you wish to give, we are truly grateful! ❤️
            </p>
          </div>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      width: '420px',
      padding: '2rem',
      background: 'linear-gradient(to bottom, #ffffff, #f9fafb)',
      customClass: {
        popup: 'wedding-gift-popup',
        closeButton: 'wedding-gift-close-btn'
      },
      didOpen: () => {
        // Add global functions to window for onclick handlers
        window.copyToClipboard = (text) => {
          navigator.clipboard.writeText(text).then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Copied!',
              text: 'Account number copied to clipboard',
              timer: 1500,
              showConfirmButton: false,
              toast: true,
              position: 'top-end',
              background: '#f0fdf4',
              color: '#166534',
              customClass: {
                popup: 'copy-toast'
              }
            });
          }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
              document.execCommand('copy');
              Swal.fire({
                icon: 'success',
                title: 'Copied!',
                text: 'Account number copied to clipboard',
                timer: 1500,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
              });
            } catch (err) {
              Swal.fire({
                icon: 'error',
                title: 'Copy failed',
                text: 'Please copy the account number manually',
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
              });
            }
            document.body.removeChild(textArea);
          });
        };

        window.showDigitalWallet = (wallet) => {
          Swal.fire({
            icon: 'info',
            title: `${wallet} Payment`,
            text: `${wallet} payment feature will be available soon!`,
            timer: 2000,
            showConfirmButton: false,
            background: 'linear-gradient(to bottom, #ffffff, #f0f9ff)',
            customClass: {
              popup: 'info-toast'
            }
          });
        };
      },
      willClose: () => {
        // Clean up global functions
        delete window.copyToClipboard;
        delete window.showDigitalWallet;
      }
    });
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

      {/* Background Audio - Only rendered when invitation is shown */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        className="hidden"
        playsInline
      >
        <source src="/musik.mp3" type="audio/mpeg" />
        <source src="/wedding-music.ogg" type="audio/ogg" />
        <source src="https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Music Control Button - Always visible when invitation is shown */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={toggleMusic}
          className={`p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${isPlaying
              ? 'bg-green-600 text-white hover:bg-green-500'
              : 'bg-gray-800 text-white hover:bg-gray-700'
            } ${(audioError || !audioLoaded) ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={
            audioError
              ? 'Audio not available'
              : !audioLoaded
                ? 'Loading audio...'
                : (isPlaying ? 'Pause Music' : 'Play Music')
          }
          disabled={audioError || !audioLoaded}
        >
          {!audioLoaded ? (
            // Loading spinner
            <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : isPlaying ? (
            // Pause icon
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
            </svg>
          ) : (
            // Play icon
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a1 1 0 001 1h1.586a1 1 0 00.707-.293l2.414-2.414A1 1 0 0015 12V8" />
            </svg>
          )}
        </button>
      </div>

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
                  📍 Map Navigation
                </button>
                <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-500 transition">
                  📅 Save the Date
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
                  📍 Map Navigation
                </button>
                <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-500 transition">
                  📅 Save the Date
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

      {/* WEDDING PROTOCOL */}
      <section className="py-10 bg-gradient-to-b from-gray-200 to-white">
        <div className="max-w-xs md:max-w-2xl mx-auto px-4 md:px-6">
          <h2 className="text-center text-xl md:text-2xl font-bold text-gray-900 mb-8">
            Wedding Protocol
          </h2>

          {/* Protocol Icons */}
          <div className="grid grid-cols-5 gap-4 md:gap-8 mb-8">

            {/* Dress Code */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2 shadow-sm">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7l8-4 8 4v6a8 8 0 01-16 0V7z" />
                </svg>
              </div>
              <p className="text-xs md:text-sm text-gray-700 font-medium">Dress Code</p>
            </div>

            {/* No Phones */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2 shadow-sm">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405m-2.833 0L9 10m0 0L4.5 5.5m4.5 4.5l6.5 6.5M4 4l16 16" />
                </svg>
              </div>
              <p className="text-xs md:text-sm text-gray-700 font-medium">No Phones</p>
            </div>

            {/* RSVP Required */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2 shadow-sm">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26L21 8m-18 8h18V8H3v8z" />
                </svg>
              </div>
              <p className="text-xs md:text-sm text-gray-700 font-medium">RSVP Required</p>
            </div>

            {/* Arrival Time */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2 shadow-sm">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs md:text-sm text-gray-700 font-medium">Arrival Time</p>
            </div>

            {/* No Plus-One */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2 shadow-sm">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2m0-6a3 3 0 11-6 0 3 3 0 016 0zm-8 0a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-xs md:text-sm text-gray-700 font-medium">No Plus-One</p>
            </div>

          </div>
        </div>
      </section>


      {/* RSVP & WISHES */}
      <section className="py-10 bg-gradient-to-b from-white to-gray-100">
        <div className="max-w-xs md:max-w-4xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

            {/* RSVP */}
            <div className="bg-gray-200 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-4">
                RSVP
              </h3>
              <p className="text-sm md:text-base text-gray-700 text-center mb-6">
                Please kindly help us prepare everything better by confirming your
                attendance to our wedding event with the following RSVP form.
              </p>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Will Attend
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500">
                    <option>Will Attend</option>
                    <option>Cannot Attend</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guest
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500">
                    <option>1 Person</option>
                    <option>2 Person</option>
                    <option>3 Person</option>
                    <option>4+ Person</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition"
                >
                  I'm Attending
                </button>
              </form>
            </div>

            {/* WISHES */}
            <div className="bg-gray-200 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-4">
                Wishes
              </h3>
              <p className="text-sm md:text-base text-gray-700 text-center mb-6">
                Leave Us A Note
              </p>
              <p className="text-xs md:text-sm text-gray-600 text-center mb-6">
                We hope to hear from all of you
              </p>

              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Relation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>

                <div>
                  <textarea
                    placeholder="Message"
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* WEDDING GIFTS */}
      <section className="py-10 bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="max-w-xs md:max-w-2xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Wedding Gifts
          </h2>
          <p className="text-sm md:text-base text-gray-600 mb-6 px-4">
            We understand that some of you might want to send us greeting or gift,
            so please tap the following buttons to send them to us
          </p>

          <button
            className="bg-gray-800 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-700 transition shadow-lg"
            onClick={showWeddingGiftAlert}
          >
            Wedding Gift
          </button>
        </div>
      </section>
      {/* FOOTER */}
      <footer className="py-8 bg-gradient-to-b from-gray-100 to-gray-200 text-center">
        <div className="max-w-xs md:max-w-2xl mx-auto px-4 md:px-6">
          <h3 className="font-[Great_Vibes] text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Thank You
          </h3>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            We can't wait to celebrate with you!
          </p>
          <p className="text-xs md:text-sm text-gray-500">
            John & Jane • December 25th, 2025
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;