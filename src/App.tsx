import { motion, AnimatePresence } from 'motion/react';
import { Mail, MapPin, Instagram, Youtube, Twitter, Music, ArrowRight, Disc3, Headphones, Calendar, Play, Pause, SkipBack, SkipForward, X, ListMusic } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

const albumsList = [
  { 
    id: "soul-boy",
    title: "Soul Boy", 
    year: "2005", 
    tag: "初心神专",
    desc: "出道开山之作，奠定华语灵魂乐地位，《春风吹》永恒经典。", 
    color: "bg-emerald-50 text-emerald-950",
    iconColor: "text-emerald-400",
    songs: [
      { id: 's1', title: "春风吹", duration: "3:20", audioUrl: "/songs/chunfengchui.mp3" },
    ]
  },
  { 
    id: "wonderland",
    title: "未来 Wonderland", 
    year: "2007", 
    tag: "艺术巅峰",
    desc: "乐迷心中艺术巅峰，首次入围金曲奖最佳男歌手。纯正Neo-Soul+华语旋律天花板，《爱爱爱》《南音》在此定型，华语R&B教科书级专辑。", 
    color: "bg-emerald-100 text-emerald-950",
    iconColor: "text-emerald-500",
    songs: [
      { id: 'w1', title: "爱爱爱", duration: "3:33", audioUrl: "/songs/aiaiai.mp3" }, 
      { id: 'w2', title: "南音", duration: "3:35", audioUrl: "/songs/nanyin.mp3" },
    ]
  },
  { 
    id: "orange-moon",
    title: "橙月 Orange Moon", 
    year: "2008", 
    tag: "国民神专",
    desc: "大众口碑国民神专，温柔浪漫天花板。整张氛围感极致治愈，《小小虫》《黑白》《为你写的歌》，传唱度最高、路人入坑必听。", 
    color: "bg-emerald-200 text-emerald-950",
    iconColor: "text-emerald-600",
    songs: [
      { id: 'o1', title: "小小虫", duration: "4:00", audioUrl: "/songs/xiaoxiaochong.mp3" },
      { id: 'o2', title: "黑白", duration: "3:51", audioUrl: "/songs/heibai.mp3" },
      { id: 'o3', title: "为你写的歌", duration: "3:17", audioUrl: "/songs/weinixiedege.mp3" },
    ]
  }
];

export default function App() {
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState("0:00");

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.error("Autoplay prevented:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
      
      const mins = Math.floor(current / 60);
      const secs = Math.floor(current % 60);
      setCurrentTimeFormatted(`${mins}:${secs.toString().padStart(2, '0')}`);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && audioRef.current.duration) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - bounds.left) / bounds.width;
      audioRef.current.currentTime = percent * audioRef.current.duration;
      setProgress(percent * 100);
    }
  };

  const handlePlaySong = (album: any, song: any) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong({ 
        ...song, 
        albumColor: album.color, 
        albumTitle: album.title, 
        albumIconColor: album.iconColor 
      });
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(true);
      setProgress(0);
      setCurrentTimeFormatted("0:00");
    }
  };

  const handleNextSong = () => {
    if (!currentSong) return;
    
    let foundAlbumIndex = -1;
    let foundSongIndex = -1;
    
    albumsList.forEach((album, aIndex) => {
      album.songs.forEach((song, sIndex) => {
        if (song.id === currentSong.id) {
          foundAlbumIndex = aIndex;
          foundSongIndex = sIndex;
        }
      });
    });
    
    if (foundAlbumIndex !== -1 && foundSongIndex !== -1) {
      const album = albumsList[foundAlbumIndex];
      const nextSongIndex = foundSongIndex + 1;
      
      if (nextSongIndex < album.songs.length) {
        handlePlaySong(album, album.songs[nextSongIndex]);
      } else {
        const nextAlbumIndex = (foundAlbumIndex + 1) % albumsList.length;
        const nextAlbum = albumsList[nextAlbumIndex];
        if (nextAlbum.songs && nextAlbum.songs.length > 0) {
          handlePlaySong(nextAlbum, nextAlbum.songs[0]);
        }
      }
    }
  };

  const handlePrevSong = () => {
    if (!currentSong) return;
    
    let foundAlbumIndex = -1;
    let foundSongIndex = -1;
    
    albumsList.forEach((album, aIndex) => {
      album.songs.forEach((song, sIndex) => {
        if (song.id === currentSong.id) {
          foundAlbumIndex = aIndex;
          foundSongIndex = sIndex;
        }
      });
    });
    
    if (foundAlbumIndex !== -1 && foundSongIndex !== -1) {
      const album = albumsList[foundAlbumIndex];
      const prevSongIndex = foundSongIndex - 1;
      
      if (prevSongIndex >= 0) {
        handlePlaySong(album, album.songs[prevSongIndex]);
      } else {
        const prevAlbumIndex = (foundAlbumIndex - 1 + albumsList.length) % albumsList.length;
        const prevAlbum = albumsList[prevAlbumIndex];
        if (prevAlbum.songs && prevAlbum.songs.length > 0) {
          handlePlaySong(prevAlbum, prevAlbum.songs[prevAlbum.songs.length - 1]);
        }
      }
    }
  };


  const closeAlbumOverlay = () => {
    setSelectedAlbum(null);
  };

  return (
    <div className="min-h-screen bg-emerald-50 text-emerald-950 font-sans selection:bg-emerald-300">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-emerald-50/80 backdrop-blur-md border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-xl font-serif font-bold tracking-wider">KHALIL FONG</div>
          <div className="hidden md:flex space-x-8 text-sm font-medium tracking-wide">
            <a href="#about" className="hover:text-emerald-700 transition-colors">ABOUT</a>
            <a href="#music" className="hover:text-emerald-700 transition-colors">MUSIC</a>
            <a href="#contact" className="hover:text-emerald-700 transition-colors">CONTACT</a>
          </div>
          <a
            href="#contact"
            className="md:hidden text-sm font-medium border-b border-emerald-950 pb-1"
          >
            CONTACT
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 z-10"
          >
            <h2 className="text-emerald-700 font-semibold tracking-widest text-sm uppercase">
              Singer / Songwriter / Producer
            </h2>
            <h1 className="text-6xl md:text-8xl font-serif font-bold leading-tight text-emerald-950">
              方大同 <br />
              <span className="text-emerald-700 italic font-medium text-5xl md:text-7xl">Khalil Fong</span>
            </h1>
            <p className="text-lg text-emerald-800 max-w-md leading-relaxed">
              Pioneering the fusion of R&B, Soul, and pop in the Mandarin music scene. Crafting timeless soundscapes since 2005.
            </p>
            <div className="pt-4">
              <a href="#music" className="inline-flex items-center space-x-2 bg-emerald-950 text-emerald-50 px-6 py-3 rounded-full hover:bg-emerald-700 hover:text-white transition-all duration-300">
                <span>Explore Music</span>
                <ArrowRight size={18} />
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[600px] rounded-2xl overflow-hidden hidden md:block bg-emerald-50 group"
          >
            {/* The main image in grayscale */}
            <div 
              className="absolute inset-0 bg-cover grayscale contrast-[1.2] transition-all duration-700 group-hover:grayscale-0 group-hover:contrast-100" 
              style={{ 
                backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Khalil_Fong_So_Close%21_%283x4_cropped%29.jpg/960px-Khalil_Fong_So_Close%21_%283x4_cropped%29.jpg')`,
                backgroundPosition: 'center 15%' 
              }}
            ></div>
            {/* Duotone Overlay for Green RISO Effect */}
            <div className="absolute inset-0 bg-emerald-900 mix-blend-screen pointer-events-none transition-opacity duration-700 group-hover:opacity-0"></div>
            <div className="absolute inset-0 bg-emerald-100 mix-blend-multiply pointer-events-none transition-opacity duration-700 group-hover:opacity-0"></div>
            
            {/* Noise overlay for texture */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" 
              style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'}}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent pointer-events-none"></div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-emerald-900 text-emerald-50 px-6 relative overflow-hidden">
        {/* Subtle noise pattern for background */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
          style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'}}
        ></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4">
              <h2 className="text-4xl font-serif font-bold mb-4">The Soul <br/> Behind the Sound</h2>
              <div className="w-12 h-1 bg-emerald-400 mb-8"></div>
            </div>
            <div className="md:col-span-8 space-y-6 text-emerald-100 text-lg leading-relaxed font-light">
              <p>
                Born in Hawaii, raised in Shanghai and Guangzhou, and based in Hong Kong, Khalil Fong's multicultural upbringing deeply influences his musical palette. He is widely recognized for introducing an authentic R&B and Neo-Soul sound to the Mandarin pop industry.
              </p>
              <p>
                From his breakout album <em className="text-white font-medium">Soul Boy</em> to his magnum opus <em className="text-white font-medium">JTW 西遊記</em> (which won him Best Mandarin Male Singer at the Golden Melody Awards), his work transcends language barriers. Operating as an independent artist and label founder (FU MUSIC), Khalil continues to push artistic boundaries, recently marking his highly anticipated return with the 2024 album <em className="text-white font-medium">The Dreamer 夢想家</em>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Works Section */}
      <section id="music" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-emerald-700 font-semibold tracking-widest text-sm uppercase mb-3">Discography</h2>
            <h3 className="text-4xl font-serif font-bold">Selected Works</h3>
          </div>
          <a href="#" className="hidden md:flex items-center space-x-2 text-emerald-600 hover:text-emerald-950 transition-colors">
            <span className="text-sm font-medium">View All on Spotify</span>
            <Music size={16} />
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {albumsList.map((album, i) => (
            <motion.div 
              key={i}
              onClick={() => setSelectedAlbum(album)}
              whileHover={{ y: -5 }}
              className={`p-8 rounded-2xl flex flex-col justify-between h-auto min-h-[320px] ${album.color} shadow-sm border border-emerald-900/5 cursor-pointer group`}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <Disc3 className={album.iconColor} size={32} />
                  <span className="text-xs font-bold px-3 py-1 rounded-full border border-current opacity-60 tracking-widest">{album.tag}</span>
                </div>
                <h4 className="text-2xl font-serif font-bold mb-2">{album.title}</h4>
                <p className="text-sm font-medium tracking-wider opacity-70 mb-4">{album.year}</p>
                <p className="opacity-80 leading-relaxed">{album.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section (Simplified without form) */}
      <section id="contact" className="py-24 bg-[#f8fdfa] border-t border-emerald-100 px-6 relative">
        <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
          <div className="mb-16 text-center">
            <h2 className="text-emerald-700 font-semibold tracking-widest text-sm uppercase mb-3">Get in Touch</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-emerald-950">Booking & Inquiries</h3>
          </div>

          <div className="w-full bg-emerald-50/80 p-8 md:p-12 rounded-3xl border border-emerald-200/60 shadow-sm flex flex-col md:flex-row md:justify-between items-center md:items-start gap-12">
            
            <div className="space-y-8 flex-1">
              <h4 className="text-2xl font-serif font-semibold text-center md:text-left text-emerald-950">Management</h4>
              <div className="space-y-6 text-emerald-800">
                <div className="flex items-center md:items-start flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                  <Mail className="w-5 h-5 text-emerald-600 mt-1 hidden md:block" />
                  <div className="text-center md:text-left">
                    <p className="font-medium text-emerald-950">General Inquiries</p>
                    <a href="mailto:info@fumusic.com" className="hover:text-emerald-700 transition-colors text-lg">info@fumusic.com</a>
                  </div>
                </div>
                <div className="flex items-center md:items-start flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                  <Calendar className="w-5 h-5 text-emerald-600 mt-1 hidden md:block" />
                  <div className="text-center md:text-left">
                    <p className="font-medium text-emerald-950">Booking (Asia & Global)</p>
                    <a href="mailto:booking@fumusic.com" className="hover:text-emerald-700 transition-colors text-lg">booking@fumusic.com</a>
                  </div>
                </div>
                <div className="flex items-center md:items-start flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                  <MapPin className="w-5 h-5 text-emerald-600 mt-1 hidden md:block" />
                  <div className="text-center md:text-left">
                    <p className="font-medium text-emerald-950">FU MUSIC Studio</p>
                    <p className="text-lg">Hong Kong SAR</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end flex-1 w-full border-t border-emerald-200 md:border-t-0 md:border-l pt-8 md:pt-0 pl-0 md:pl-12">
              <h4 className="text-sm font-semibold tracking-widest uppercase text-emerald-600 mb-6">Connect</h4>
              <div className="grid grid-cols-2 gap-4">
                <a href="#" className="w-16 h-16 bg-[#f8fdfa] border border-emerald-200 rounded-full flex items-center justify-center text-emerald-800 hover:bg-emerald-600 hover:border-emerald-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md">
                  <Instagram size={24} />
                </a>
                <a href="#" className="w-16 h-16 bg-[#f8fdfa] border border-emerald-200 rounded-full flex items-center justify-center text-emerald-800 hover:bg-emerald-600 hover:border-emerald-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md">
                  <Youtube size={24} />
                </a>
                <a href="#" className="w-16 h-16 bg-[#f8fdfa] border border-emerald-200 rounded-full flex items-center justify-center text-emerald-800 hover:bg-emerald-600 hover:border-emerald-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md">
                  <Twitter size={24} />
                </a>
                <a href="#" className="w-16 h-16 bg-[#f8fdfa] border border-emerald-200 rounded-full flex items-center justify-center text-emerald-800 hover:bg-emerald-600 hover:border-emerald-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md">
                  <Headphones size={24} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-400 py-12 px-6 text-center text-sm mb-20 lg:mb-0">
        <p>© {new Date().getFullYear()} Khalil Fong & FU MUSIC. All rights reserved.</p>
      </footer>

      {/* Album Detail Overlay */}
      <AnimatePresence>
        {selectedAlbum && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-[60] bg-emerald-50 overflow-y-auto"
          >
            <div className={`pt-32 pb-16 px-6 ${selectedAlbum.color} relative`}>
              <button onClick={closeAlbumOverlay} className="absolute top-8 right-8 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/40 transition">
                <X size={24} />
              </button>
              <div className="max-w-4xl mx-auto w-full flex flex-col md:flex-row items-start md:items-end gap-8">
                <Disc3 className={`${selectedAlbum.iconColor} opacity-50 flex-shrink-0 animate-[spin_10s_linear_infinite]`} size={160} />
                <div>
                  <span className="text-sm font-bold tracking-widest uppercase opacity-80 border border-current px-3 py-1 rounded-full mb-4 inline-block">{selectedAlbum.tag}</span>
                  <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4">{selectedAlbum.title}</h1>
                  <p className="opacity-80 text-xl font-medium tracking-wide">{selectedAlbum.year}</p>
                </div>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto w-full p-6 py-16">
              <p className="text-emerald-900/80 mb-12 max-w-2xl text-lg md:text-xl leading-relaxed font-light">{selectedAlbum.desc}</p>
              
              <div className="space-y-3 pb-32">
                <div className="flex items-center justify-between p-4 px-6 text-sm font-semibold tracking-widest uppercase text-emerald-900/40 border-b border-emerald-900/10 mb-4">
                  <span>Track</span>
                  <span>Duration</span>
                </div>
                {selectedAlbum.songs.map((song: any, i: number) => {
                  const isCurrentSong = currentSong?.id === song.id;
                  return (
                    <div 
                      key={song.id} 
                      onClick={() => handlePlaySong(selectedAlbum, song)}
                      className={`flex items-center justify-between p-4 px-6 rounded-2xl cursor-pointer transition-all duration-300 group
                        ${isCurrentSong ? 'bg-emerald-200/60 shadow-sm' : 'hover:bg-emerald-100/50'}`}
                    >
                      <div className="flex items-center gap-6">
                        <span className={`w-6 font-medium ${isCurrentSong ? 'text-emerald-700' : 'text-emerald-900/30'}`}>
                          {isCurrentSong && isPlaying ? <div className="flex space-x-1 items-end h-4 w-4">
                            <span className="w-1 bg-emerald-600 animate-[bounce_1s_infinite] h-full" style={{ animationDelay: '0s' }}></span>
                            <span className="w-1 bg-emerald-600 animate-[bounce_1s_infinite] h-2/3" style={{ animationDelay: '0.2s' }}></span>
                            <span className="w-1 bg-emerald-600 animate-[bounce_1s_infinite] h-1/3" style={{ animationDelay: '0.4s' }}></span>
                          </div> : (i + 1).toString().padStart(2, '0')}
                        </span>
                        <span className={`font-medium transition-colors ${isCurrentSong ? 'text-emerald-950 font-bold' : 'text-emerald-900/80 group-hover:text-emerald-950'}`}>
                          {song.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-emerald-900/50">
                        <span className="text-sm tracking-wider">{song.duration}</span>
                        <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isCurrentSong ? 'bg-emerald-900 text-white' : 'bg-transparent text-emerald-900 opacity-0 group-hover:opacity-100 group-hover:bg-emerald-200'}`}>
                          {isCurrentSong && isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Music Player */}
      <AnimatePresence>
        {currentSong && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-[70] bg-emerald-950 text-emerald-50 border-t border-emerald-900 h-24 shadow-2xl"
          >
            {/* progress bar */}
            <div 
              className="absolute top-0 left-0 h-1.5 bg-emerald-900/50 w-full cursor-pointer overflow-hidden group"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-emerald-400 relative pointer-events-none" 
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
              
              <div className="flex items-center gap-4 w-1/3 min-w-0">
                <div className="w-14 h-14 rounded-lg bg-emerald-900 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                  <Disc3 className={`text-emerald-700 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} size={28} />
                  {isPlaying && <div className="absolute inset-0 bg-emerald-500/10 mix-blend-screen"></div>}
                </div>
                <div className="truncate">
                  <p className="font-semibold text-lg truncate pr-4">{currentSong.title}</p>
                  <p className="text-xs text-emerald-400 font-medium tracking-wide truncate pr-4">{currentSong.albumTitle}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center w-1/3 gap-2">
                <div className="flex items-center gap-8">
                  <button onClick={handlePrevSong} className="text-emerald-600 hover:text-emerald-300 transition-colors">
                    <SkipBack size={20} />
                  </button>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-950 hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                  </button>
                  <button onClick={handleNextSong} className="text-emerald-600 hover:text-emerald-300 transition-colors">
                    <SkipForward size={20} />
                  </button>
                </div>
              </div>

              <div className="w-1/3 flex justify-end items-center gap-6 text-emerald-500">
                <div className="hidden md:flex text-xs font-mono tracking-widest gap-1 w-24 justify-end">
                  <span>{currentTimeFormatted}</span>
                  <span>/</span>
                  <span>{currentSong.duration}</span>
                </div>
                <ListMusic size={20} className="hover:text-emerald-200 cursor-pointer transition-colors" />
              </div>

            </div>
            
            <audio 
              ref={audioRef}
              src={currentSong.audioUrl || ""}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleNextSong}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
