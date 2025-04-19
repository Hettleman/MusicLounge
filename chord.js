// import { usersNotes } from './notes.js';

// const chordLabelText = document.getElementById("chord-label-text");

// export function displayChord() {
//   const major = checkForMajorChord();
//   const minor = checkForMinorChord();

//   if (major) {
//     chordLabelText.textContent = `${major.note.toUpperCase()} major`;
//     console.log("Detected major chord:", major);
//   } else if (minor) {
//     chordLabelText.textContent = minor;
//     console.log("Detected minor chord:", minor);
//   } else {
//     chordLabelText.textContent = "No chord";
//   }
// }

// function checkForMajorChord() {
//     usersNotes.forEach(note => {
//         if (note.noteOnLeftDistance === 4 && note.noteOnRightDistance === 3) {
//             return note.noteOnLeft + " major";
//         }
//     });
//   return null;
// }

// function checkForMinorChord() {
//   for (let note of usersNotes) {
//     if (note.noteOnLeftDistance === 3 && note.noteOnRightDistance === 4) {
//       return `${note.noteOnLeft.toUpperCase()} minor`;
//     }
//   }
//   return null;
// }


// let chordObject = {
//   usersNotes: usersNotes,
//   root: "",
//   mood: "",
//   chordLength: 0
// };

// function updateChordObject(root, mood) {
//   chordObject.usersNotes = usersNotes;
//   chordObject.root = root;
//   chordObject.mood = mood;
//   chordObject.chordLength = usersNotes.length;
// }