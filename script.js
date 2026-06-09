import * as chords from './chords.js';
var chromaticScale = ["a", "as", "b", "c", "cs", "d", "ds", "e", "f", "fs", "g", "gs"];
const defaultOpenNotes = {
    "1": "e",
    "2": "a",
    "3": "d",
    "4": "g",
    "5": "b",
    "6": "e"
};
let usersNotes = [];
let capoState = {}; // { stringNum: note } for strings currently under the capo
let capoFret = null; // current capo fret number, or null if not on any strings
let mutedStrings = new Set();

export function setCapoState(state) {
    capoState = state;
}

export function setCapoFret(fret) {
    capoFret = fret;
}

export function isStringMuted(stringNum) {
    return mutedStrings.has(stringNum);
}
let chordObject = {
    usersNotes: [],
    root: "",
    mood: "",
    chordLength: 0
};
let chordLabelText = document.getElementById("chord-label-text");
let String1Note = document.querySelector('.String-1-Note');
let String2Note = document.querySelector('.String-2-Note');
let String3Note = document.querySelector('.String-3-Note');
let String4Note = document.querySelector('.String-4-Note');
let String5Note = document.querySelector('.String-5-Note');
let String6Note = document.querySelector('.String-6-Note');

function getFretFromNoteTop(top) {
    if (top < 18) return 0;
    if (top < 63) return 1;
    if (top < 119) return 2;
    if (top < 176) return 3;
    if (top < 233) return 4;
    if (top < 285) return 5;
    if (top < 335) return 6;
    if (top < 383) return 7;
    if (top < 423) return 8;
    if (top < 455) return 9;
    if (top < 485) return 10;
    if (top < 515) return 11;
    if (top < 545) return 12;
    if (top < 575) return 13;
    if (top < 605) return 14;
    return 15;
}

export function getUserNote(stringNum) {
    return usersNotes.find(n => n.string === stringNum && n.source === "user") || null;
}

function toggleMute(stringNum) {
    const btn = document.querySelector(`.mute-btn[data-string="${stringNum}"]`);
    const displayBox = document.querySelector(`.String-${stringNum}-Note`);

    if (mutedStrings.has(stringNum)) {
        // Unmute — restore capo or open note
        mutedStrings.delete(stringNum);
        if (btn) btn.classList.remove('muted');
        const capoNote = capoState[stringNum];
        const note = capoNote ? capoNote : defaultOpenNotes[stringNum];
        const source = capoNote ? "capo" : "default";
        if (displayBox) displayBox.textContent = note.toUpperCase();
        updateUsersNotes(note, stringNum, source);
    } else {
        // Mute — deselect any user note visually, clear display, remove from usersNotes
        const existingNote = usersNotes.find(n => n.string === stringNum && n.source === "user");
        if (existingNote) {
            const elements = document.getElementsByClassName(existingNote.note);
            for (let el of elements) {
                if (el.getAttribute('data-string') === stringNum) {
                    el.style.backgroundColor = "silver";
                }
            }
        }
        mutedStrings.add(stringNum);
        if (btn) btn.classList.add('muted');
        if (displayBox) displayBox.textContent = "";
        usersNotes = usersNotes.filter(n => n.string !== stringNum);
    }
}

function createEventListeners() {
    for (let i = 0; i < chromaticScale.length; i++) {
        let currentNoteName = chromaticScale[i];
        let currentNoteGroup = document.getElementsByClassName(currentNoteName);

        for (let j = 0; j < currentNoteGroup.length; j++) {
            currentNoteGroup[j].addEventListener('click', function () {
                const stringNum = currentNoteGroup[j].getAttribute('data-string');
                const fret = getFretFromNoteTop(currentNoteGroup[j].offsetTop);

                // Block clicks at or above the capo fret on capo-covered strings
                if (capoFret !== null && capoState[stringNum] && fret <= capoFret) {
                    return;
                }

                // If string is muted, clicking a note unmutes it first
                if (mutedStrings.has(stringNum)) {
                    mutedStrings.delete(stringNum);
                    const btn = document.querySelector(`.mute-btn[data-string="${stringNum}"]`);
                    if (btn) btn.classList.remove('muted');
                }

                // Check if the clicked note is already selected
                let existingNote = usersNotes.find(n => n.string === stringNum && n.note === currentNoteName);

                if (existingNote) {
                    currentNoteGroup[j].style.backgroundColor = "silver";
                
                    // Remove the clicked note
                    usersNotes = usersNotes.filter(n => !(n.string === stringNum && n.note === currentNoteName));
                
                    // Look for capo note (in usersNotes or capoState), or revert to default
                    const fallbackCapo = usersNotes.find(n => n.string === stringNum && n.source === "capo");
                    const capoStatNote = capoState[stringNum];
                    const fallbackNote = fallbackCapo
                        ? fallbackCapo.note
                        : capoStatNote
                            ? capoStatNote
                            : defaultOpenNotes[stringNum];

                    const fallbackSource = (fallbackCapo || capoStatNote) ? "capo" : "default";
                
                    // Update display
                    const displayBox = document.querySelector(`.String-${stringNum}-Note`);
                    if (displayBox) {
                        displayBox.textContent = fallbackNote.toUpperCase();
                    }
                
                    // Add it back as original note
                    updateUsersNotes(fallbackNote, stringNum, fallbackSource);
                    return;
                }
                
                

                // Deselect any previous note on the same string
                let oldNote = usersNotes.find(n => n.string === stringNum);
                if (oldNote) {
                    let oldElements = document.getElementsByClassName(oldNote.note);
                    for (let k = 0; k < oldElements.length; k++) {
                        if (oldElements[k].getAttribute('data-string') === stringNum) {
                            oldElements[k].style.backgroundColor = "silver";
                        }
                    }
                }

                // Highlight the newly selected note
                currentNoteGroup[j].style.backgroundColor = "#d0d000";

                // Update display box
                const displayBox = document.querySelector(`.String-${stringNum}-Note`);
                if (displayBox) {
                    displayBox.textContent = currentNoteName.toUpperCase();
                }

                // Update usersNotes
                updateUsersNotes(currentNoteName, stringNum, "user", fret);
            });
        }
    }
}


export function clearCapoNotes() {
    // Remove only capo-sourced notes
    usersNotes = usersNotes.filter(n => n.source !== "capo");

    // Restore open string defaults for any string with no note
    for (let i = 1; i <= 6; i++) {
        const strNum = String(i);
        const hasNote = usersNotes.find(n => n.string === strNum);
        if (!hasNote && !mutedStrings.has(strNum)) {
            const defaultNote = defaultOpenNotes[strNum];
            const box = document.querySelector(`.String-${strNum}-Note`);
            if (box) box.textContent = defaultNote.toUpperCase();
            updateUsersNotes(defaultNote, strNum, "default");
        }
    }
}

export function updateUsersNotes(note, stringNum, source = "user", fret = null) {
    // Remove old note on this string, if any
    usersNotes = usersNotes.filter(n => n.string !== stringNum);

    let newNote = {
        note: note,
        string: stringNum,
        fret: fret,
        source: source
    };

    usersNotes.push(newNote);
}



function findNotePosition(note) {
    for (let i = 0; i < chromaticScale.length; i++) {
        if (note == chromaticScale[i]) {
            return i;
        }
    }
}

function findAllUserNotePositions() {
    usersNotes.forEach(noteObject => {
        noteObject.notePosition = findNotePosition(noteObject.note);
    });
}


// function findClosestIntervalsForAllUsersNotes() {
//     usersNotes.forEach(noteObject => {
//         let currentNotePosition = noteObject.notePosition;
//         let intervalCalculationsObject = doIntervalCalculationsForANote(currentNotePosition);
//         updateUsersNotesWithIntervals(noteObject, intervalCalculationsObject)
//     });
// }

// function doIntervalCalculationsForANote(currentNotePosition) {
//     let closestRightInterval = 12;
//     let closestLeftInterval = 12;
//     let noteOnRight = "";
//     let noteOnLeft = "";
//     let intervalDistance;
//     usersNotes.forEach(noteObject => {
//         intervalDistance = noteObject.notePosition-currentNotePosition;
//         intervalDistance = reinterpretHighNoteIntervals(intervalDistance);
//         if (Math.abs(intervalDistance) < Math.abs(closestLeftInterval) && intervalDistance != 0 && intervalDistance < 0) {
//             closestLeftInterval = intervalDistance;
//             noteOnLeft = noteObject.note;
//         }
//         if (Math.abs(intervalDistance) < Math.abs(closestRightInterval) && intervalDistance != 0 && intervalDistance > 0) {
//             closestRightInterval = intervalDistance;
//             noteOnRight = noteObject.note;
//         }
//         // secondClosestInterval = Math.min(closestRightInterval, closestLeftInterval);
//     })
//     let intervalCalculationsObject = {
//         closestLeftInterval: Math.abs(closestLeftInterval),
//         closestRightInterval: closestRightInterval,
//         noteOnLeft: noteOnLeft,
//         noteOnRight: noteOnRight
//     }
//     return intervalCalculationsObject;
// }

// function reinterpretHighNoteIntervals(intervalDistance) {
//     let sign = -1*(intervalDistance/Math.abs(intervalDistance));
//     if (Math.abs(intervalDistance) > 6) {
//         intervalDistance = sign*(12-Math.abs(intervalDistance));
//     }
//     return intervalDistance;
// }

// function updateUsersNotesWithIntervals(noteObject, intervalCalculationsObject) {
//     noteObject.noteOnLeftDistance = intervalCalculationsObject.closestLeftInterval;
//     noteObject.noteOnRightDistance = intervalCalculationsObject.closestRightInterval;
//     noteObject.noteOnLeft = intervalCalculationsObject.noteOnLeft,
//     noteObject.noteOnRight = intervalCalculationsObject.noteOnRight
// }



// function displayChord() {
//     if (checkForMajorChord()) {
//         updateChordObject(checkForMajorChord(), "major")
//         console.log(checkForMajorChord());
//         chordLabelText.textContent = checkForMajorChord() + "major";
//     } else if (checkForMinorChord()) {
//         updateChordObject(checkForMinorChord(), "minor")
//         chordLabelText.textContent = checkForMinorChord();        
//         console.log(checkForMinorChord());
//     }
// }

export function displayChord() {
    const result = chords.findChord(usersNotes);
    chordLabelText.textContent = result.label;
}

// function updateChordObject(functionName, mood) {
//     chordObject.usersNotes = usersNotes;
//     chordObject.root = functionName;
//     chordObject.mood = mood;
//     chordlength = usersNotes.length;
//     console.log("CHORD OBJECRT " + chordObject.root)
// }

// function checkForMajorChord() {
//     for (let i = 0; i < usersNotes.length; i++) {
//         let note = usersNotes[i]
//         if (note.noteOnLeftDistance == 4 && note.noteOnRightDistance == 3) {
//             return note.noteOnLeft;
//         }
//     };
//     return false;
// }

// function checkForMinorChord() {
//     for (let i = 0; i < usersNotes.length; i++) {
//         let note = usersNotes[i]
//         if (note.noteOnLeftDistance == 3 && note.noteOnRightDistance == 4) {
//             return note.noteOnLeft + " minor";
//         }
//     };
//     return false;
// }



// Initialize usersNotes with all open string defaults on load
for (let i = 1; i <= 6; i++) {
    const s = String(i);
    updateUsersNotes(defaultOpenNotes[s], s, 'default');
}

createEventListeners();

document.querySelectorAll('.mute-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        toggleMute(btn.getAttribute('data-string'));
    });
});

document.querySelector('.strum').addEventListener('click', function () {
    displayChord();
});

document.querySelector('.clear-btn').addEventListener('click', function () {
    // Deselect all highlighted user note dots
    usersNotes.forEach(n => {
        if (n.source === 'user') {
            const elements = document.getElementsByClassName(n.note);
            for (let el of elements) {
                if (el.getAttribute('data-string') === n.string) {
                    el.style.backgroundColor = 'silver';
                }
            }
        }
    });

    // Unmute all strings
    mutedStrings.forEach(s => {
        const btn = document.querySelector(`.mute-btn[data-string="${s}"]`);
        if (btn) btn.classList.remove('muted');
    });
    mutedStrings.clear();

    // Reset capo state
    capoState = {};
    capoFret = null;

    // Reset capo element to initial position
    const capoEl = document.getElementById('capo');
    if (capoEl) {
        capoEl.style.left = '158px';
        capoEl.style.top = '35px';
        capoEl.style.width = '15px';
    }

    // Reset usersNotes and displays to open strings
    usersNotes = [];
    for (let i = 1; i <= 6; i++) {
        const s = String(i);
        const note = defaultOpenNotes[s];
        const box = document.querySelector(`.String-${s}-Note`);
        if (box) box.textContent = note.toUpperCase();
        updateUsersNotes(note, s, 'default');
    }

    // Clear chord display
    chordLabelText.textContent = '';
});

/////// Intervals ////////////
// Maj: 4, 3
// Min: 3, 4


/////////// capo.js ///////////