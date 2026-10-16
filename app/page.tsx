
"use client";

import { useState } from "react";

export default function Home() {
  const [genre, setGenre] = useState("Hip-Hop");
  const [mood, setMood] = useState("Chill");
  const [bpm, setBpm] = useState(95);
  const [lyrics, setLyrics] = useState("");
  const [created, setCreated] = useState(false);

  return (
    <main className="min-h-screen bg-[#090b10] text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <h1 className="text-3xl font-black tracking-tight">
          i<span className="text-cyan-400">BEATS</span>
        </h1>
        <span className="rounded-full border border-cyan-400/40 px-3 py-1 text-xs text-cyan-300">
          MUSIC STUDIO
        </span>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Your sound. Your world.
        </p>
        <h2 className="text-4xl font-black sm:text-6xl">
          Make something <span className="text-cyan-400">real.</span>
        </h2>
        <p className="mt-4 max-w-xl text-gray-400">
          Build beat ideas, find your sound and start writing your next track.
          Your music journey starts here.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-xl font-bold">Beat Maker</h3>
            <p className="mt-1 text-sm text-gray-400">
              Shape your next beat concept.
            </p>

            <label className="mt-5 block text-sm text-gray-300">Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#151923] p-3"
            >
              <option>Hip-Hop</option>
              <option>Trap</option>
              <option>Drill</option>
              <option>House</option>
              <option>Afrobeats</option>
              <option>Lo-fi</option>
              <option>Pop</option>
            </select>

            <label className="mt-4 block text-sm text-gray-300">Mood</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#151923] p-3"
            >
              <option>Chill</option>
              <option>Dark</option>
              <option>Energetic</option>
              <option>Emotional</option>
              <option>Uplifting</option>
            </select>

            <label className="mt-4 block text-sm text-gray-300">
              Tempo: {bpm} BPM
            </label>
            <input
              type="range"
              min="60"
              max="180"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="mt-3 w-full accent-cyan-400"
            />

            <button
              onClick={() => setCreated(true)}
              className="mt-6 w-full rounded-xl bg-cyan-400 p-3 font-bold text-black"
            >
              Create Beat Concept
            </button>

            {created && (
              <div className="mt-4 rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-4">
                <p className="font-bold text-cyan-300">Your beat blueprint</p>
                <p className="mt-2 text-sm">
                  {mood} {genre} · {bpm} BPM
                </p>
                <p className="mt-1 text-sm text-gray-300">
                  Try punchy drums, a memorable melody and a bassline that
                  matches the mood.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-xl font-bold">Songwriter</h3>
            <p className="mt-1 text-sm text-gray-400">
              Start your lyrics and keep your ideas here.
            </p>

            <label className="mt-5 block text-sm text-gray-300">
              Your lyrics
            </label>
            <textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Start writing your first verse..."
              rows={8}
              className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#151923] p-3"
            />

            <p className="mt-3 text-sm text-gray-400">
              {lyrics.length} characters · Your words, your story.
            </p>

            <button
              onClick={() =>
                navigator.clipboard?.writeText(lyrics)
              }
              className="mt-4 w-full rounded-xl border border-cyan-400/40 p-3 font-semibold text-cyan-300"
            >
              Copy Lyrics
            </button>
          </section>
        </div>

        <footer className="mt-10 border-t border-white/10 py-6 text-center text-sm text-gray-500">
          iBEATS · Create without limits.
        </footer>
      </section>
    </main>
  );
}