var chromaticScale = ["a", "a#", "b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#"];
var usersNotes = [
    {note: "b", notePosition: -1, noteOnRightDistance: 12, noteOnRight: "", noteOnLeftDistance: 12, noteOnLeft: ""},
    {note: "d", notePosition: -1, noteOnRightDistance: 12, noteOnRight: "", noteOnLeftDistance: 12, noteOnLeft: ""},
    {note: "f#", notePosition: -1, noteOnRightDistance: 12, noteOnRight: "", noteOnLeftDistance: 12, noteOnLeft: ""}
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


function findClosestIntervalsForAllUsersNotes() {
    usersNotes.forEach(noteObject => {
        let currentNotePosition = noteObject.notePosition;
        console.log(noteObject.note + ": current note position" + currentNotePosition);
        let intervalCalculationsObject = doIntervalCalculationsForANote(currentNotePosition);
        console.log("fbwroivberovherobnerobnoerbnoreb")
        console.log()
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
        console.log("intervalDistance " + intervalDistance + "         closestLeftInterval" + closestLeftInterval)
        if (Math.abs(intervalDistance) < Math.abs(closestLeftInterval) && intervalDistance != 0 && intervalDistance < 0) {
            closestLeftInterval = intervalDistance;
            noteOnLeft = noteObject.note;
        }
        if (Math.abs(intervalDistance) < Math.abs(closestRightInterval) && intervalDistance != 0 && intervalDistance > 0) {
            closestRightInterval = intervalDistance;
            noteOnRight = noteObject.note;
        }
        secondClosestInterval = Math.min(closestRightInterval, closestLeftInterval);
        // console.log("currentNotePosition " + currentNotePosition + "        other note" + noteObject.notePosition);
        // console.log("intervalDistance " + intervalDistance + "     secondClosestInterval " + secondClosestInterval);
        console.log("closestLeftInterval " + closestLeftInterval);
        console.log("closestRightInterval " + closestRightInterval);
        console.log(" ");
    })
    let intervalCalculationsObject = {
        closestLeftInterval: Math.abs(closestLeftInterval),
        closestRightInterval: closestRightInterval,
        noteOnLeft: noteOnLeft,
        noteOnRight: noteOnRight
    }
    console.log(intervalCalculationsObject);
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
    findAllUserNotePositions();
    findClosestIntervalsForAllUsersNotes();
    console.log(usersNotes);
    console.log(checkForMajorChord());
    console.log(checkForMinorChord());
}

function checkForMajorChord() {
    for (let i = 0; i < usersNotes.length; i++) {
        let note = usersNotes[i]
        console.log("noteOnLeftDistance: " + note.noteOnLeftDistance + "       noteOnRightDistance: " + note.noteOnRightDistance)
        if (note.noteOnLeftDistance == 4 && note.noteOnRightDistance == 3) {
            return note.noteOnLeft + " major";
        }
    };
    return false;
}

function checkForMinorChord() {
    for (let i = 0; i < usersNotes.length; i++) {
        let note = usersNotes[i]
        console.log("noteOnLeftDistance: " + note.noteOnLeftDistance + "       noteOnRightDistance: " + note.noteOnRightDistance)
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