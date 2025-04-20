export function findClosestIntervalsForAllUsersNotes(usersNotes) {
    usersNotes.forEach(noteObject => {
        let currentNotePosition = noteObject.notePosition;
        let intervalCalculationsObject = doIntervalCalculationsForANote(usersNotes, currentNotePosition);
        updateUsersNotesWithIntervals(noteObject, intervalCalculationsObject)
    });
}

function doIntervalCalculationsForANote(usersNotes, currentNotePosition) {
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
        // secondClosestInterval = Math.min(closestRightInterval, closestLeftInterval);
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