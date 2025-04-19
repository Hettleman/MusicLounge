let chordObject = {
    usersNotes: [],
    root: "",
    mood: "",
    chordlength: 0
};

export function findChord(usersNotes) {
    if (checkForMajorChord(usersNotes)) {
        let root = checkForMajorChord(usersNotes);
        updateChordObject(usersNotes, root, "major");
    } 
    else if (checkForMinorChord(usersNotes)) {
        let root = checkForMinorChord(usersNotes);
        updateChordObject(usersNotes, root, "minor");
    }
    return chordObject;
}

function checkForMajorChord(usersNotes) {
    for (let i = 0; i < usersNotes.length; i++) {
        let note = usersNotes[i]
        if (note.noteOnLeftDistance == 4 && note.noteOnRightDistance == 3) {
            return note.noteOnLeft;
        }
    };
    return false;
}

function checkForMinorChord(usersNotes) {
    for (let i = 0; i < usersNotes.length; i++) {
        let note = usersNotes[i]
        if (note.noteOnLeftDistance == 3 && note.noteOnRightDistance == 4) {
            return note.noteOnLeft;
        }
    };
    return false;
}

function updateChordObject(usersNotes, root, mood) {
    chordObject.usersNotes = usersNotes;
    chordObject.root = root;
    chordObject.mood = mood;
    chordObject.chordlength = usersNotes.length;
    console.log("CHORD OBJECRT " + chordObject.root)
}