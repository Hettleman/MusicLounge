const chromaticScale = ["a", "as", "b", "c", "cs", "d", "ds", "e", "f", "fs", "g", "gs"];

// Chord types ordered richest-first so a 7th is preferred over a triad subset
const CHORD_TYPES = [
    // 7-note
    { name: "13",    intervals: [0, 2, 4, 5, 7, 9, 10] },
    // 6-note
    { name: "11",    intervals: [0, 2, 4, 5, 7, 10] },
    // 5-note
    { name: "9",     intervals: [0, 2, 4, 7, 10] },
    { name: "maj9",  intervals: [0, 2, 4, 7, 11] },
    { name: "m9",    intervals: [0, 2, 3, 7, 10] },
    // 4-note
    { name: "add9",  intervals: [0, 2, 4, 7] },
    { name: "madd9", intervals: [0, 2, 3, 7] },
    { name: "7",     intervals: [0, 4, 7, 10] },
    { name: "maj7",  intervals: [0, 4, 7, 11] },
    { name: "m7",    intervals: [0, 3, 7, 10] },
    { name: "dim7",  intervals: [0, 3, 6, 9] },
    { name: "ø7",    intervals: [0, 3, 6, 10] },
    { name: "mmaj7", intervals: [0, 3, 7, 11] },
    { name: "aug7",  intervals: [0, 4, 8, 10] },
    { name: "6",     intervals: [0, 4, 7, 9] },
    { name: "m6",    intervals: [0, 3, 7, 9] },
    // 3-note
    { name: "",      intervals: [0, 4, 7] },
    { name: "m",     intervals: [0, 3, 7] },
    { name: "dim",   intervals: [0, 3, 6] },
    { name: "aug",   intervals: [0, 4, 8] },
    { name: "sus2",  intervals: [0, 2, 7] },
    { name: "sus4",  intervals: [0, 5, 7] },
    // 2-note
    { name: "5",     intervals: [0, 7] },
];

function noteToIndex(note) {
    return chromaticScale.indexOf(note.toLowerCase());
}

function displayName(note) {
    const n = note.toLowerCase();
    if (n.length === 2 && n[1] === 's') return n[0].toUpperCase() + '#';
    return n.toUpperCase();
}

export function findChord(usersNotes) {
    if (!usersNotes || usersNotes.length === 0) return { label: "" };

    // Unique pitch classes present across all strings
    const pitchClasses = [...new Set(
        usersNotes.map(n => noteToIndex(n.note)).filter(i => i >= 0)
    )];

    if (pitchClasses.length < 2) return { label: "" };

    // Bass note: lowest string number = lowest pitch (string 1 = low E)
    const bassNoteObj = usersNotes.reduce((lowest, n) =>
        parseInt(n.string) < parseInt(lowest.string) ? n : lowest
    );
    const bassIndex = noteToIndex(bassNoteObj.note);

    const actual = new Set(pitchClasses);

    function tryRoot(rootIndex) {
        for (const chordType of CHORD_TYPES) {
            const required = new Set(chordType.intervals.map(i => (rootIndex + i) % 12));
            if ([...required].every(i => actual.has(i)) && [...actual].every(i => required.has(i))) {
                const rootName = displayName(chromaticScale[rootIndex]);
                let label = rootName + chordType.name;
                if (bassIndex !== rootIndex) label += "/" + displayName(chromaticScale[bassIndex]);
                return { label };
            }
        }
        return null;
    }

    // Phase 1: bass note as root (root position or named slash chord)
    const rootResult = tryRoot(bassIndex);
    if (rootResult) return rootResult;

    // Phase 2: try other pitch classes as root (inversion)
    for (const rootIndex of pitchClasses.filter(i => i !== bassIndex)) {
        const invResult = tryRoot(rootIndex);
        if (invResult) return invResult;
    }

    return { label: "?" };
}
