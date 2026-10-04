import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

// All 12 notes of the chromatic scale
const ALL_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Tuning options
const TUNINGS = {
  standard: { name: 'Standard (E A D G B E)', category: '6-String', strings: ['E', 'B', 'G', 'D', 'A', 'E'] },
  halfStepDown: { name: 'Half-Step Down (Eb Ab Db Gb Bb Eb)', category: '6-String', strings: ['D#', 'A#', 'F#', 'C#', 'G#', 'D#'] },
  wholeStepDown: { name: 'Whole Step Down (D G C F A D)', category: '6-String', strings: ['D', 'A', 'F', 'C', 'G', 'D'] },
  dropD: { name: 'Drop D (D A D G B E)', category: '6-String', strings: ['E', 'B', 'G', 'D', 'A', 'D'] },
  doubleDropD: { name: 'Double Drop D (D A D G B D)', category: '6-String', strings: ['D', 'B', 'G', 'D', 'A', 'D'] },
  dropC: { name: 'Drop C (C G C F A D)', category: '6-String', strings: ['D', 'A', 'F', 'C', 'G', 'C'] },
  openG: { name: 'Open G (D G D G B D)', category: '6-String', strings: ['D', 'B', 'G', 'D', 'G', 'D'] },
  openD: { name: 'Open D (D A D F# A D)', category: '6-String', strings: ['D', 'A', 'F#', 'D', 'A', 'D'] },
  openC: { name: 'Open C (C G C G C E)', category: '6-String', strings: ['E', 'C', 'G', 'C', 'G', 'C'] },
  openE: { name: 'Open E (E B E G# B E)', category: '6-String', strings: ['E', 'B', 'G#', 'E', 'B', 'E'] },
  openA: { name: 'Open A (E A C# E A E)', category: '6-String', strings: ['E', 'A', 'E', 'C#', 'A', 'E'] },
  openB: { name: 'Open B (B F# B F# B D#)', category: '6-String', strings: ['D#', 'B', 'F#', 'B', 'F#', 'B'] },
  dadgad: { name: 'DADGAD (D A D G A D)', category: '6-String', strings: ['D', 'A', 'G', 'D', 'A', 'D'] },
  dm: { name: 'Dm Tuning (D A D F A D)', category: '6-String', strings: ['D', 'A', 'F', 'D', 'A', 'D'] },
  nickDrake: { name: 'Nick Drake (C G C F C E)', category: '6-String', strings: ['E', 'C', 'F', 'C', 'G', 'C'] },
  dropB: { name: 'Drop B (B F# B E G# C#)', category: '6-String', strings: ['C#', 'G#', 'E', 'B', 'F#', 'B'] },
  baritone: { name: 'Baritone / B Tuning (B E A D F# B)', category: '6-String', strings: ['B', 'F#', 'D', 'A', 'E', 'B'] },
  nashville: { name: 'Nashville (E A E A C# E)', category: '6-String', strings: ['E', 'C#', 'A', 'E', 'A', 'E'] },
  dropA: { name: 'Drop A (A E A D F# B)', category: '6-String', strings: ['B', 'F#', 'D', 'A', 'E', 'A'] },
  cTuning: { name: 'C Tuning (C F A# D# G C)', category: '6-String', strings: ['C', 'G', 'D#', 'A#', 'F', 'C'] },
  cSharpTuning: { name: 'C# Tuning (C# F# B E G# C#)', category: '6-String', strings: ['C#', 'G#', 'E', 'B', 'F#', 'C#'] },
  dropCSharp: { name: 'Drop C# (C# G# C# F# A# D#)', category: '6-String', strings: ['D#', 'A#', 'F#', 'C#', 'G#', 'C#'] },
  standard7: { name: 'Standard 7-String (B E A D G B E)', category: '7-String', strings: ['E', 'B', 'G', 'D', 'A', 'E', 'B'] },
  standard8: { name: 'Standard 8-String (F# B E A D G B E)', category: '8-String', strings: ['E', 'B', 'G', 'D', 'A', 'E', 'B', 'F#'] }
};

// Mega-library of scales (intervals in semitones)
const SCALES = {
  // --- BASE / MAIN ---
  chromatic: { name: 'Chromatic', category: 'Main', intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
  major: { name: 'Major', category: 'Main', intervals: [0, 2, 4, 5, 7, 9, 11] },
  minor: { name: 'Natural Minor', category: 'Main', intervals: [0, 2, 3, 5, 7, 8, 10] },
  harmonic_minor: { name: 'Harmonic Minor', category: 'Main', intervals: [0, 2, 3, 5, 7, 8, 11] },
  melodic_minor: { name: 'Melodic Minor', category: 'Main', intervals: [0, 2, 3, 5, 7, 9, 11] },
  blues: { name: 'Blues', category: 'Main', intervals: [0, 3, 5, 6, 7, 10] },
  
  // --- MODES ---
  ionian: { name: 'Ionian (Mode 1)', category: 'Modes', intervals: [0, 2, 4, 5, 7, 9, 11] },
  dorian: { name: 'Dorian (Mode 2)', category: 'Modes', intervals: [0, 2, 3, 5, 7, 9, 10] },
  phrygian: { name: 'Phrygian (Mode 3)', category: 'Modes', intervals: [0, 1, 3, 5, 7, 8, 10] },
  lydian: { name: 'Lydian (Mode 4)', category: 'Modes', intervals: [0, 2, 4, 6, 7, 9, 11] },
  mixolydian: { name: 'Mixolydian (Mode 5)', category: 'Modes', intervals: [0, 2, 4, 5, 7, 9, 10] },
  aeolian: { name: 'Aeolian (Mode 6)', category: 'Modes', intervals: [0, 2, 3, 5, 7, 8, 10] },
  locrian: { name: 'Locrian (Mode 7)', category: 'Modes', intervals: [0, 1, 3, 5, 6, 8, 10] },
  phrygian_dominant: { name: 'Phrygian Dominant', category: 'Modes', intervals: [0, 1, 4, 5, 7, 8, 10] },

  // --- 5-TONE (PENTATONICS) ---
  maj_pent: { name: 'Major Pentatonic', category: '5-Tone', intervals: [0, 2, 4, 7, 9] },
  min_pent: { name: 'Minor Pentatonic', category: '5-Tone', intervals: [0, 3, 5, 7, 10] },
  hirajoshi: { name: 'Hirajoshi', category: '5-Tone', intervals: [0, 2, 3, 7, 8] },
  insen: { name: 'Insen', category: '5-Tone', intervals: [0, 1, 5, 7, 10] },
  kokin_joshi: { name: 'Kokin Joshi', category: '5-Tone', intervals: [0, 2, 5, 7, 8] },
  akebono: { name: 'Akebono', category: '5-Tone', intervals: [0, 2, 3, 7, 9] },
  ryukuan: { name: 'Ryukuan', category: '5-Tone', intervals: [0, 4, 5, 7, 11] },
  abhogi: { name: 'Abhogi', category: '5-Tone', intervals: [0, 2, 3, 5, 9] },
  bhupkali: { name: 'Bhupkali', category: '5-Tone', intervals: [0, 2, 4, 7, 8] },
  hindolam: { name: 'Hindolam', category: '5-Tone', intervals: [0, 3, 5, 8, 10] },
  bhupalam: { name: 'Bhupalam', category: '5-Tone', intervals: [0, 1, 3, 7, 8] },
  amritavarshini: { name: 'Amritavarshini', category: '5-Tone', intervals: [0, 4, 6, 7, 11] },

  // --- WORLD ---
  hungarian_min: { name: 'Hungarian Minor', category: 'World', intervals: [0, 2, 3, 6, 7, 8, 11] },
  hungarian_maj: { name: 'Hungarian Major', category: 'World', intervals: [0, 3, 4, 6, 7, 9, 10] },
  neapolitan_min: { name: 'Neapolitan Minor', category: 'World', intervals: [0, 1, 3, 5, 7, 8, 11] },
  neapolitan_maj: { name: 'Neapolitan Major', category: 'World', intervals: [0, 1, 4, 5, 7, 9, 11] },
  spanish: { name: 'Spanish (8-Tone)', category: 'World', intervals: [0, 1, 3, 4, 5, 7, 8, 10] },
  greek: { name: 'Greek', category: 'World', intervals: [0, 2, 3, 4, 7, 8, 10] },
  jewish: { name: 'Jewish', category: 'World', intervals: [0, 1, 4, 5, 7, 8, 10] },
  arabic: { name: 'Arabic', category: 'World', intervals: [0, 1, 4, 5, 7, 8, 11] },

  // --- JAZZ ---
  lydian_b7: { name: 'Lydian b7 (Acoustic)', category: 'Jazz', intervals: [0, 2, 4, 6, 7, 9, 10] },
  altered: { name: 'Altered', category: 'Jazz', intervals: [0, 1, 3, 4, 6, 8, 10] },
  diminished_hw: { name: 'Diminished (H-W)', category: 'Jazz', intervals: [0, 1, 3, 4, 6, 7, 9, 10] },
  diminished_wh: { name: 'Diminished (W-H)', category: 'Jazz', intervals: [0, 2, 3, 5, 6, 8, 9, 11] },
  whole_tone: { name: 'Whole Tone', category: 'Jazz', intervals: [0, 2, 4, 6, 8, 10] },
  bebop_maj: { name: 'Bebop Major', category: 'Jazz', intervals: [0, 2, 4, 5, 7, 8, 9, 11] },
  bebop_min: { name: 'Bebop Minor', category: 'Jazz', intervals: [0, 2, 3, 5, 7, 8, 10, 11] },
  blues_combined: { name: 'Blues Combined', category: 'Jazz', intervals: [0, 2, 3, 4, 5, 6, 7, 9, 10] },

  // --- MODERN ---
  augmented: { name: 'Augmented', category: 'Modern', intervals: [0, 3, 4, 7, 8, 11] },
  tritone: { name: 'Tritone', category: 'Modern', intervals: [0, 1, 4, 6, 7, 10] },
  enigmatic: { name: 'Enigmatic', category: 'Modern', intervals: [0, 1, 4, 6, 8, 10, 11] },
  scriabin: { name: 'Scriabin', category: 'Modern', intervals: [0, 2, 4, 6, 9, 10] }
};

const NUM_FRETS = 16;
const FRET_MARKERS = [3, 5, 7, 9, 12, 15]; 

function GuitarScalesApp() {
  const [selectedTuning, setSelectedTuning] = useState('standard');
  const [rootIndex, setRootIndex] = useState(0); 
  const [selectedScale, setSelectedScale] = useState('minor');
  
  const [flipState, setFlipState] = useState('');
  const [animationKey, setAnimationKey] = useState(0);

  const selectedRoot = ALL_NOTES[rootIndex];

  const groupedTunings = useMemo(() => {
    return Object.entries(TUNINGS).reduce((acc, [key, data]) => {
      if (!acc[data.category]) acc[data.category] = [];
      acc[data.category].push({ key, ...data });
      return acc;
    }, {});
  }, []);

  const groupedScales = useMemo(() => {
    return Object.entries(SCALES).reduce((acc, [key, data]) => {
      if (!acc[data.category]) acc[data.category] = [];
      acc[data.category].push({ key, ...data });
      return acc;
    }, {});
  }, []);

  const getNoteForFret = (openNote, fretIndex) => {
    const startIndex = ALL_NOTES.indexOf(openNote);
    return ALL_NOTES[(startIndex + fretIndex) % 12];
  };

  const scaleNotes = useMemo(() => {
    const intervals = SCALES[selectedScale].intervals;
    return intervals.map(interval => ALL_NOTES[(rootIndex + interval) % 12]);
  }, [rootIndex, selectedScale]);

  const changeRoot = (direction) => {
    if (flipState !== '') return;
    
    setFlipState('flip-out');
    
    setTimeout(() => {
      setRootIndex(prev => {
        if (direction === 'next') return prev === 11 ? 0 : prev + 1;
        return prev === 0 ? 11 : prev - 1;
      });
      setFlipState('flip-in');
      setAnimationKey(prev => prev + 1); 
      
      setTimeout(() => setFlipState(''), 150);
    }, 150);
  };

  const handleDropdownChange = (setter) => (e) => {
    setter(e.target.value);
    setAnimationKey(prev => prev + 1);
  };

  const currentTuningData = TUNINGS[selectedTuning];
  const markerStringIndex = Math.floor(currentTuningData.strings.length / 2) - 1;

  return (
    <div className="relative min-h-screen bg-[#030303] text-zinc-100 overflow-hidden font-sans selection:bg-red-600/30 flex flex-col items-center">
      
      <style>{`
        .film-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
        }
        
        @keyframes flipOut { to { transform: rotateX(90deg); opacity: 0; } }
        @keyframes flipIn { from { transform: rotateX(-90deg); opacity: 0; } to { transform: rotateX(0deg); opacity: 1; } }
        .flip-out { animation: flipOut 0.15s ease-in forwards; }
        .flip-in { animation: flipIn 0.15s ease-out forwards; }
        
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; filter: blur(4px); }
          60% { transform: scale(1.1); opacity: 1; filter: blur(0px); }
          100% { transform: scale(1); }
        }
        .note-pop { animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        
        ::-webkit-scrollbar { height: 6px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,1); }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>

      {/* BACKGROUND & BOKEH */}
      <div className="absolute inset-0 pointer-events-none film-grain z-10 mix-blend-overlay"></div>
      <div className="fixed top-[-10%] left-[10%] w-[30vw] h-[30vw] bg-red-900/15 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed top-[30%] right-[5%] w-[40vw] h-[40vw] bg-rose-950/20 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[20%] w-[35vw] h-[35vw] bg-red-900/10 blur-[130px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed top-[50%] left-[40%] w-[20vw] h-[20vw] bg-red-900/10 blur-[90px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-20 w-full max-w-6xl p-4 md:p-8 lg:p-12 flex flex-col items-center">
        
        <header className="mb-16 mt-8 text-center flex flex-col items-center">
          <div className="text-[10px] font-bold text-zinc-500 tracking-[0.3em] mb-6 flex items-center gap-3">
            <span className="w-6 h-px bg-zinc-700"></span>
            GUITAR SCALES
            <span className="w-6 h-px bg-zinc-700"></span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-2 uppercase leading-none">
            SCALE<br/>
            <span className="text-4xl md:text-7xl text-zinc-400">GENERATOR</span>
          </h1>
          <p className="text-[10px] md:text-xs text-zinc-500 font-bold tracking-[0.3em] uppercase mt-6 max-w-md text-center">
            World-Class Fretboard & Tuning Production
          </p>
        </header>

        {/* CONTROLS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full mb-20 max-w-5xl">
          
          {/* Tuning */}
          <div className="flex flex-col items-center space-y-4">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Tuning</label>
            <div className="relative group w-full">
              <select
                value={selectedTuning}
                onChange={handleDropdownChange(setSelectedTuning)}
                className="w-full appearance-none bg-[#0a0a0a] border border-white/5 text-white text-center font-bold text-sm md:text-base rounded-2xl p-5 focus:outline-none focus:ring-1 focus:ring-red-900/50 transition-all cursor-pointer hover:bg-[#111] shadow-2xl"
              >
                {Object.entries(groupedTunings).map(([category, tunings]) => (
                  <optgroup key={category} label={category} className="bg-[#050505] text-red-700 font-black tracking-widest text-xs uppercase">
                    {tunings.map(t => (
                      <option key={t.key} value={t.key} className="text-white font-medium text-base capitalize">{t.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600 group-hover:text-white transition-colors text-xs">▼</div>
            </div>
          </div>

          {/* Root Note */}
          <div className="flex flex-col items-center space-y-4">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Root Note</label>
            <div className="flex items-center space-x-5">
              <button onClick={() => changeRoot('prev')} className="p-2 text-zinc-600 hover:text-white transition-colors active:scale-90">◀</button>
              <div className="w-24 h-20 perspective-1000 flex items-center justify-center">
                <div className={`w-full h-full bg-[#0a0a0a] border border-white/5 shadow-2xl rounded-2xl flex items-center justify-center ${flipState}`}>
                  <span className="text-4xl md:text-5xl font-black text-white">{selectedRoot}</span>
                </div>
              </div>
              <button onClick={() => changeRoot('next')} className="p-2 text-zinc-600 hover:text-white transition-colors active:scale-90">▶</button>
            </div>
            {/* Dots indicator */}
            <div className="flex space-x-1.5 mt-2">
              {ALL_NOTES.map((_, idx) => (
                <div key={idx} className={`h-1 rounded-full transition-all duration-300 ${idx === rootIndex ? 'bg-red-600 w-5 shadow-[0_0_8px_rgba(220,38,38,0.8)]' : 'bg-zinc-800 w-1.5'}`} />
              ))}
            </div>
          </div>

          {/* Scale / Mode */}
          <div className="flex flex-col items-center space-y-4">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Scale / Mode</label>
            <div className="relative group w-full">
              <select
                value={selectedScale}
                onChange={handleDropdownChange(setSelectedScale)}
                className="w-full appearance-none bg-[#0a0a0a] border border-white/5 text-white text-center font-bold text-sm md:text-base rounded-2xl p-5 focus:outline-none focus:ring-1 focus:ring-red-900/50 transition-all cursor-pointer hover:bg-[#111] shadow-2xl"
              >
                {Object.entries(groupedScales).map(([category, scales]) => (
                  <optgroup key={category} label={category} className="bg-[#050505] text-red-700 font-black tracking-widest text-xs uppercase">
                    {scales.map(s => (
                      <option key={s.key} value={s.key} className="text-white font-medium text-base">{s.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600 group-hover:text-white transition-colors text-xs">▼</div>
            </div>
          </div>

        </div>

        {/* FRETBOARD */}
        <div className="w-full overflow-x-auto pb-12 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="min-w-[850px] relative max-w-5xl mx-auto">
            
            <div className="flex ml-[50px] md:ml-[70px] h-6 text-zinc-600 text-[10px] font-bold font-mono tracking-widest mb-2">
              {Array.from({ length: NUM_FRETS - 1 }).map((_, i) => (
                <div key={i} className="flex-1 flex justify-center items-end relative">{i + 1}</div>
              ))}
            </div>

            <div className="bg-[#080808] rounded-l-xl border-r-8 border-zinc-500 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative select-none overflow-hidden ring-1 ring-white/5">
              
              <div className="relative py-3">
                {currentTuningData.strings.map((openNote, stringIndex) => (
                  <div key={stringIndex} className="flex h-[44px] items-center relative group">
                    
                    <div 
                      className="absolute left-[50px] md:left-[70px] right-0 bg-gradient-to-b from-zinc-500 via-zinc-600 to-zinc-700 shadow-[0_1px_3px_rgba(0,0,0,1)] z-0" 
                      style={{ height: `${1 + stringIndex * 0.35}px` }} 
                    />

                    <div className="w-[50px] md:w-[70px] h-full flex justify-center items-center z-10 border-r-[3px] border-zinc-700 bg-[#050505]">
                      {(() => {
                        const isScaleNote = scaleNotes.includes(openNote);
                        const isRoot = openNote === selectedRoot;
                        
                        if (!isScaleNote) return <span className="text-zinc-700 text-[10px] font-mono font-bold">{openNote}</span>;
                        
                        return (
                          <div key={`${openNote}-${animationKey}`} className={`
                            note-pop w-7 h-7 rounded-full flex justify-center items-center text-xs font-bold relative
                            ${isRoot ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.7)] z-20' : 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.3)]'}
                          `}>
                            {openNote}
                          </div>
                        );
                      })()}
                    </div>

                    {Array.from({ length: NUM_FRETS - 1 }).map((_, i) => {
                      const fretNumber = i + 1;
                      const note = getNoteForFret(openNote, fretNumber);
                      const isScaleNote = scaleNotes.includes(note);
                      const isRoot = note === selectedRoot;

                      return (
                        <div key={fretNumber} className="flex-1 h-full flex justify-center items-center border-r border-zinc-800/80 relative z-10 hover:bg-white/5 transition-colors cursor-crosshair">
                          
                          {stringIndex === markerStringIndex && FRET_MARKERS.includes(fretNumber) && fretNumber !== 12 && (
                            <div className="absolute top-full mt-[-3px] w-3 h-3 rounded-full bg-zinc-800 -z-10 pointer-events-none"></div>
                          )}
                          {stringIndex === markerStringIndex && fretNumber === 12 && (
                            <>
                              <div className="absolute top-full mt-[-24px] w-3 h-3 rounded-full bg-zinc-800 -z-10 pointer-events-none"></div>
                              <div className="absolute top-full mt-[18px] w-3 h-3 rounded-full bg-zinc-800 -z-10 pointer-events-none"></div>
                            </>
                          )}

                          {isScaleNote && (
                            <div key={`${fretNumber}-${note}-${animationKey}`} className={`
                              note-pop w-7 h-7 md:w-8 md:h-8 rounded-full flex justify-center items-center text-xs md:text-sm font-black transition-transform hover:scale-110
                              ${isRoot ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.9)] z-20' : 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]'}
                            `}>
                              {note}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col items-center text-center relative z-10 max-w-4xl px-4">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2 uppercase tracking-tight">
            {selectedRoot} <span className="text-zinc-600">{SCALES[selectedScale].name}</span>
          </h2>
          <p className="text-[10px] text-zinc-500 font-bold tracking-[0.3em] uppercase mb-10">
            {currentTuningData.name} | {SCALES[selectedScale].category} Bank
          </p>

          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
            {scaleNotes.map((note, idx) => (
              <div 
                key={`${note}-${idx}-${animationKey}`} 
                className={`note-pop w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full font-black text-xs md:text-sm border shadow-2xl
                  ${note === selectedRoot 
                    ? 'bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]' 
                    : 'bg-[#0a0a0a] border-white/5 text-zinc-300 hover:bg-white hover:text-black hover:border-white transition-colors cursor-default'}`}
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                {note}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center space-x-10 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">
            <div className="flex items-center space-x-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></div>
              <span>Root Note</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"></div>
              <span>Scale Note</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<GuitarScalesApp />);
