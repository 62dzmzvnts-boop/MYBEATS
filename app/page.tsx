
"use client";

import { useEffect, useRef, useState } from "react";

const instruments = ["Kick", "Snare", "Hi-hat"] as const;
type Instrument = (typeof instruments)[number];

const initialPattern: Record<Instrument, boolean[]> = {
  Kick: Array.from({ length: 16 }, (_, i) => [0, 4, 8, 12].includes(i)),
  Snare: Array.from({ length: 16 }, (_, i) => [4, 12].includes(i)),
  "Hi-hat": Array.from({ length: 16 }, (_, i) => i % 2 === 0),
};

export default function Home() {
  const [bpm, setBpm] = useState(95);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const [pattern, setPattern] = useState(initialPattern);
  const [genre, setGenre] = useState("Hip-Hop");
  const audioRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef(0);
  const patternRef = useRef(pattern);
  const bpmRef = useRef(bpm);

  useEffect(() => { patternRef.current = pattern; }, [pattern]);
  useEffect(() => { bpmRef.current = bpm; }, [bpm]);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (audioRef.current) void audioRef.current.close();
  }, []);

  function sound(instrument: Instrument) {
    const ctx = audioRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (instrument === "Kick") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.14);
      gain.gain.setValueAtTime(0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.19);
    } else if (instrument === "Snare") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(190, now);
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.11);
    } else {
      osc.type = "square";
      osc.frequency.setValueAtTime(9000, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc.start(now);
      osc.stop(now + 0.04);
    }
  }

  async function start() {
    if (playing) return;
    const ctx = audioRef.current ?? new AudioContext();
    audioRef.current = ctx;
    if (ctx.state === "suspended") await ctx.resume();

    stepRef.current = 0;
    setStep(0);
    setPlaying(true);

    const tick = () => {
      const current = stepRef.current;
      for (const instrument of instruments) {
        if (patternRef.current[instrument][current]) sound(instrument);
      }
      setStep(current);
      stepRef.current = (current + 1) % 16;
    };

    tick();
    timerRef.current = setInterval(tick, 60000 / bpmRef.current / 4);
  }

  function stop() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setPlaying(false);
    setStep(-1);
  }

  function changeBpm(value: number) {
    const next = Math.max(60, Math.min(180, value));
    setBpm(next);
    if (playing) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(
        () => {
          const current = stepRef.current;
          for (const instrument of instruments) {
            if (patternRef.current[instrument][current]) sound(instrument);
          }
          setStep(current);
          stepRef.current = (current + 1) % 16;
        },
        60000 / next / 4
      );
    }
  }

  function toggleCell(instrument: Instrument, index: number) {
    setPattern(old => ({
      ...old,
      [instrument]: old[instrument].map((on, i) => i === index ? !on : on),
    }));
  }

  function reset() {
    stop();
    setPattern(initialPattern);
  }

  return (
    <main className="min-h-screen bg-[#090b10] text-white px-4 py-8">
      <header className="mx-auto max-w-xl">
        <p className="text-cyan-400 font-bold tracking-[0.3em] text-sm">YOUR AI MUSIC STUDIO</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">
          MY<span className="text-cyan-400">BEATS</span>
        </h1>
        <p className="mt-2 text-gray-400">Make a beat. Find your sound.</p>
      </header>

      <section className="mx-auto mt-8 max-w-xl space-y-5">
        <div className="rounded-2xl border border-white/10 bg-[#141923] p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Beat Lab</h2>
            <span className="text-xs text-cyan-300">16-STEP DRUM MACHINE</span>
          </div>

          <label className="mt-5 block text-sm text-gray-400">Genre</label>
          <select
            value={genre}
            onChange={e => setGenre(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#090b10] p-3"
          >
            <option>Hip-Hop</option>
            <option>Trap</option>
            <option>Drill</option>
            <option>House</option>
            <option>Afrobeats</option>
            <option>Lo-fi</option>
          </select>

          <div className="mt-5 flex items-center justify-between">
            <label htmlFor="bpm" className="font-semibold">Tempo</label>
            <span className="text-2xl font-black text-cyan-400">{bpm} <small className="text-sm">BPM</small></span>
          </div>
          <input
            id="bpm"
            type="range"
            min="60"
            max="180"
            value={bpm}
            onChange={e => changeBpm(Number(e.target.value))}
            className="mt-3 w-full accent-cyan-400"
          />
          <div className="flex justify-between text-xs text-gray-500"><span>60 BPM</span><span>180 BPM</span></div>

          <div className="mt-6 space-y-4">
            {instruments.map(instrument => (
              <div key={instrument}>
                <p className="mb-2 text-sm font-semibold">{instrument}</p>
                <div className="grid grid-cols-8 gap-1.5">
                  {pattern[instrument].map((on, i) => (
                    <button
                      key={i}
                      onClick={() => toggleCell(instrument, i)}
                      aria-label={`${instrument}, step ${i + 1}`}
                      className={`h-9 rounded-md border transition ${
                        step === i ? "border-white ring-2 ring-white/40" : "border-white/10"
                      } ${on ? "bg-cyan-400 text-black" : "bg-[#252c38]"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {!playing ? (
              <button onClick={start} className="rounded-xl bg-cyan-400 p-3 font-bold text-black">
                ▶ Play Beat
              </button>
            ) : (
              <button onClick={stop} className="rounded-xl bg-rose-500 p-3 font-bold text-white">
                ■ Stop
              </button>
            )}
            <button onClick={reset} className="rounded-xl border border-white/20 p-3 font-semibold">
              Reset Pattern
            </button>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            {playing ? "Playing your beat…" : "Tap the steps to build your rhythm, then press Play."}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#141923] p-5">
          <h2 className="text-xl font-bold">Songwriter</h2>
          <p className="mt-2 text-sm text-gray-400">
            Next up: AI lyrics, melodies, vocal recording and full-song generation.
          </p>
          <p className="mt-3 text-xs text-gray-500">
            Selected style: {genre} · {bpm} BPM
          </p>
        </div>
      </section>
      <footer className="mx-auto mt-8 max-w-xl text-center text-xs text-gray-600">
        MYBEATS · Built for your sound
      </footer>
    </main>
  );
}
