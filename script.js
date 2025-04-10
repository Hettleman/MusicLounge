var chromaticScale = ["a", "a#", "b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#"];
var usersNotes = [
    {note: "c", notePosition: -1, closestInterval: 12},
    {note: "e", notePosition: -1, closestInterval: 12},
    {note: "g", notePosition: -1, closestInterval: 12}
];

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

findAllUserNotePositions();
console.log(usersNotes);


function findClosestIntervalsForAllUsersNotes() {
    usersNotes.forEach(noteObject => {
        let currentNotePosition = noteObject.closestInterval;
        console.log(noteObject.note + ": current note position" + currentNotePosition);
        doIntervalCalculations(currentNotePosition);
    });
}

function doIntervalCalculations(currentNotePosition) {
    let closestInterval = 12;
    usersNotes.forEach(noteObject => {
        let intervalDistance = Math.abs(currentNotePosition-noteObject.notePosition)
        console.log(noteObject.note + " " + intervalDistance);
    })
}

findClosestIntervalsForAllUsersNotes();

