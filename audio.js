// audio.js — Tone.js guitar sampler
import * as Tone from 'https://esm.sh/tone@14.7.77';

// Open string MIDI notes (standard tuning)
// String 1 = low E2, String 6 = high E4
const OPEN_STRING_MIDI = {
    "1": 40, // E2
    "2": 45, // A2
    "3": 50, // D3
    "4": 55, // G3
    "5": 59, // B3
    "6": 64  // E4
};

// App's chromatic scale (for computing MIDI from note name when fret is unknown)
const CHROMATIC = ["c", "cs", "d", "ds", "e", "f", "fs", "g", "gs", "a", "as", "b"];

// Create sampler immediately so samples start fetching on page load
const sampler = new Tone.Sampler({
    urls: {
        "E2": "E2.mp3",
        "A2": "A2.mp3",
        "D3": "D3.mp3",
        "G3": "G3.mp3",
        "B3": "B3.mp3",
        "E4": "E4.mp3",
        "G4": "G4.mp3",
        "A4": "A4.mp3",
    },
    baseUrl: "https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-acoustic/",
    onload: () => console.log("Guitar samples loaded ✓"),
    onerror: (err) => console.error("Sample load error:", err),
}).toDestination();

function midiToNote(midi) {
    const names = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
    const octave = Math.floor(midi / 12) - 1;
    return names[midi % 12] + octave;
}

// For capo/default notes where fret isn't stored, derive MIDI from note name + string
function noteObjToMidi(noteObj) {
    const openMidi = OPEN_STRING_MIDI[String(noteObj.string)];
    if (noteObj.fret !== null && noteObj.fret !== undefined) {
        return openMidi + noteObj.fret;
    }
    const noteIdx = CHROMATIC.indexOf(noteObj.note.toLowerCase());
    const openIdx = openMidi % 12;
    let semitones = noteIdx - openIdx;
    if (semitones < 0) semitones += 12;
    return openMidi + semitones;
}

// Play a single note — called on dot click
export async function playNote(stringNum, fret) {
    await Tone.start();
    await Tone.loaded();
    const midi = OPEN_STRING_MIDI[String(stringNum)] + fret;
    sampler.triggerAttackRelease(midiToNote(midi), "2n");
}

// Play all active notes in quick succession — called on STRUM
export async function playStrum(usersNotes) {
    await Tone.start();
    await Tone.loaded();
    const now = Tone.now();
    const sorted = [...usersNotes].sort((a, b) => parseInt(a.string) - parseInt(b.string));
    sorted.forEach((noteObj, i) => {
        const midi = noteObjToMidi(noteObj);
        sampler.triggerAttackRelease(midiToNote(midi), "2n", now + i * 0.05);
    });
}
