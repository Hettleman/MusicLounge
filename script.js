var chromaticScale = ["a", "as", "b", "c", "cs", "d", "ds", "e", "f", "fs", "g", "gs"];
var usersNotes = [];
let chordLabelText = document.getElementById("chord-label-text");
let notesDisplay = document.querySelector('.notes');
var chordObject = {
    usersNotes: usersNotes,
    root: "",
    mood: "",
    chordLength: 0
}

function createEventListeners() {
    for (let i = 0; i < chromaticScale.length; i++) {
        let currentNoteName = chromaticScale[i];
        let currentNoteGroup = document.getElementsByClassName(chromaticScale[i]);
        for (let j = 0; j < currentNoteGroup.length; j++) {
            currentNoteGroup[j].addEventListener('click', function() {
                currentNoteGroup[j].style.backgroundColor = "#d0d000";
                updateUsersNotes(currentNoteName);
                displayChord();
            });
        }
    }
}

function displayUsersNotes() {
    const noteNames = usersNotes.map(n => n.note.toUpperCase());
    notesDisplay.textContent = "Notes: " + noteNames.join(", ");
}

function updateUsersNotes(note) {
    let newNote = {
        note: note, 
        notePosition: -1, 
        noteOnRightDistance: 12, 
        noteOnRight: "", 
        noteOnLeftDistance: 12, 
        noteOnLeft: ""
    }
    usersNotes.push(newNote);
    findAllUserNotePositions();
    findClosestIntervalsForAllUsersNotes();
    displayUsersNotes();
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
        chordLabelText.textContent = checkForMinorChord() + "minor";
        console.log(checkForMinorChord());
    }
}

function updateChordObject(functionName, mood) {
    chordObject.usersNotes = usersNotes;
    chordObject.root = checkForMajorChord();
    chordObject.mood = mood;
    chordlength = usersNotes.length;
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