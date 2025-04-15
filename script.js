var chromaticScale = ["a", "as", "b", "c", "cs", "d", "ds", "e", "f", "fs", "g", "gs"];
var usersNotes = [];
let chordObject = {
    usersNotes: [],
    root: "",
    mood: ""
  };
let chordLabelText = document.getElementById("chord-label-text");
let String1Note = document.querySelector('.String-1-Note');
let String2Note = document.querySelector('.String-2-Note');
let String3Note = document.querySelector('.String-3-Note');
let String4Note = document.querySelector('.String-4-Note');
let String5Note = document.querySelector('.String-5-Note');
let String6Note = document.querySelector('.String-6-Note');

function createEventListeners() {
    for (let i = 0; i < chromaticScale.length; i++) {
        let currentNoteName = chromaticScale[i];
        let currentNoteGroup = document.getElementsByClassName(currentNoteName);

        for (let j = 0; j < currentNoteGroup.length; j++) {
            currentNoteGroup[j].addEventListener('click', function () {
                const stringNum = currentNoteGroup[j].getAttribute('data-string');

                // Check if the clicked note is already selected
                let existingNote = usersNotes.find(n => n.string === stringNum && n.note === currentNoteName);

                if (existingNote) {
                    // Deselect the note
                    let capoNote = usersNotes.find(n => n.string === stringNum && n.source === "capo");
                    currentNoteGroup[j].style.backgroundColor = "silver";
                    
                    // Remove from usersNotes
                    usersNotes = usersNotes.filter(n => !(n.string === stringNum && n.note === currentNoteName));

                    // Clear display box
                    const displayBox = document.querySelector(`.String-${stringNum}-Note`);
                    if (displayBox) {
                        displayBox.textContent = "";
                    }
                    

                    // Update chord label
                    displayChord();
                    return; // Exit early
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
                updateUsersNotes(currentNoteName, stringNum);

                // Update chord label
                displayChord();
            });
        }
    }
}




// function displayUsersNotes() {
//     const noteNames = usersNotes.map(n => n.note.toUpperCase());
// }

function updateUsersNotes(note, stringNum) {
    // Remove old note on this string, if any
    usersNotes = usersNotes.filter(n => n.string !== stringNum);

    let newNote = {
        note: note,
        string: stringNum,
        notePosition: findNotePosition(note),
        noteOnRightDistance: 12,
        noteOnRight: "",
        noteOnLeftDistance: 12,
        noteOnLeft: ""
    };

    usersNotes.push(newNote);
    findClosestIntervalsForAllUsersNotes();
    // displayUsersNotes();
}




function getNotesFromWebsiteInteraction() {
    createEventListeners();

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


function findClosestIntervalsForAllUsersNotes() {
    usersNotes.forEach(noteObject => {
        let currentNotePosition = noteObject.notePosition;
        let intervalCalculationsObject = doIntervalCalculationsForANote(currentNotePosition);
        updateUsersNotesWithIntervals(noteObject, intervalCalculationsObject)
    });
}

function doIntervalCalculationsForANote(currentNotePosition) {
    let closestRightInterval = 12;
    let closestLeftInterval = 12;
    let noteOnRight = "";
    let noteOnLeft = "";
    let intervalDistance;
    usersNotes.forEach(noteObject => {
        intervalDistance = noteObject.notePosition-currentNotePosition;
        intervalDistance = reinterpretHighNoteIntervals(intervalDistance);
        if (Math.abs(intervalDistance) < Math.abs(closestLeftInterval) && intervalDistance != 0 && intervalDistance < 0) {
            closestLeftInterval = intervalDistance;
            noteOnLeft = noteObject.note;
        }
        if (Math.abs(intervalDistance) < Math.abs(closestRightInterval) && intervalDistance != 0 && intervalDistance > 0) {
            closestRightInterval = intervalDistance;
            noteOnRight = noteObject.note;
        }
        secondClosestInterval = Math.min(closestRightInterval, closestLeftInterval);
    })
    let intervalCalculationsObject = {
        closestLeftInterval: Math.abs(closestLeftInterval),
        closestRightInterval: closestRightInterval,
        noteOnLeft: noteOnLeft,
        noteOnRight: noteOnRight
    }
    return intervalCalculationsObject;
}

function reinterpretHighNoteIntervals(intervalDistance) {
    let sign = -1*(intervalDistance/Math.abs(intervalDistance));
    if (Math.abs(intervalDistance) > 6) {
        intervalDistance = sign*(12-Math.abs(intervalDistance));
    }
    return intervalDistance;
}

function updateUsersNotesWithIntervals(noteObject, intervalCalculationsObject) {
    noteObject.noteOnLeftDistance = intervalCalculationsObject.closestLeftInterval;
    noteObject.noteOnRightDistance = intervalCalculationsObject.closestRightInterval;
    noteObject.noteOnLeft = intervalCalculationsObject.noteOnLeft,
    noteObject.noteOnRight = intervalCalculationsObject.noteOnRight
}


function findChord() { 
    getNotesFromWebsiteInteraction();
}

function displayChord() {
    if (checkForMajorChord()) {
        updateChordObject(checkForMajorChord(), "major")
        console.log(checkForMajorChord());
        chordLabelText.textContent = checkForMajorChord() + "major";
    } else if (checkForMinorChord()) {
        updateChordObject(checkForMinorChord(), "minor")
        chordLabelText.textContent = checkForMinorChord();        console.log(checkForMinorChord());
    }
}

function updateChordObject(functionName, mood) {
    chordObject.usersNotes = usersNotes;
    chordObject.root = functionName;
    chordObject.mood = mood;
    chordlength = usersNotes.length;
    console.log("CHORD OBJECRT " + chordObject.root)
}

function checkForMajorChord() {
    for (let i = 0; i < usersNotes.length; i++) {
        let note = usersNotes[i]
        if (note.noteOnLeftDistance == 4 && note.noteOnRightDistance == 3) {
            return note.noteOnLeft;
        }
    };
    return false;
}

function checkForMinorChord() {
    for (let i = 0; i < usersNotes.length; i++) {
        let note = usersNotes[i]
        if (note.noteOnLeftDistance == 3 && note.noteOnRightDistance == 4) {
            return note.noteOnLeft + " minor";
        }
    };
    return false;
}



findChord()

/////// Intervals ////////////
// Maj: 4, 3
// Min: 3, 4