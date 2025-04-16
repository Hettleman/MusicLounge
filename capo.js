const box = document.getElementById('capo');
const fretboard = document.querySelector('.fretboard');

let isDragging = false;
let startX = 0;
let startY = 0;
let startWidth = 0;
let startLeft = 0;
let startTop = 0;

const capoOneNotes = ["F", "AS", "DS", "GS", "C", "F"];
const capoTwoNotes = ["FS", "B", "E", "A", "CS", "FS"];
const capoThreeNotes = ["G", "C", "F", "AS", "D", "G"];
const capoFourNotes = ["GS", "CS", "FS", "B", "DS", "GS"];
const capoFiveNotes = ["A", "D", "G", "C", "E", "A"];
const capoSixNotes = ["AS", "DS", "GS", "CS", "F", "AS"];
const capoSevenNotes = ["B", "E", "A", "D", "FS", "B"];
const capoEightNotes = ["C", "F", "AS", "DS", "G", "C"];
const capoNineNotes = ["CS", "FS", "B", "E", "GS", "CS"];
const capoTenNotes = ["D", "G", "C", "F", "A", "D"];
const capoElevenNotes = ["DS", "GS", "CS", "FS", "AS", "DS"];

const capoNotesMap = {
  1: capoOneNotes,
  2: capoTwoNotes,
  3: capoThreeNotes,
  4: capoFourNotes,
  5: capoFiveNotes,
  6: capoSixNotes,
  7: capoSevenNotes,
  8: capoEightNotes,
  9: capoNineNotes,
  10: capoTenNotes,
  11: capoElevenNotes,
  12: capoOneNotes,
  13: capoTwoNotes,
  14: capoThreeNotes,
  15: capoFourNotes,
};

function getFretNumberFromTop(top) {
  if (top <= 48) return 1;
  if (top <= 105) return 2;
  if (top <= 162) return 3;
  if (top <= 219) return 4;
  if (top <= 267) return 5;
  if (top <= 314) return 6;
  if (top <= 361) return 7;
  if (top <= 399) return 8;
  if (top <= 428) return 9;
  if (top <= 456) return 10;
  if (top <= 485) return 11;
  if (top <= 513) return 12;
  if (top <= 542) return 13;
  if (top <= 570) return 14;
  if (top <= 590) return 15;
  return null;
}

function getTouchedStringsByWidth(width) {
  if (width < 41) return [];
  if (width < 63) return [6];
  if (width < 85) return [6, 5];
  if (width < 107) return [6, 5, 4];
  if (width < 129) return [6, 5, 4, 3];
  if (width < 151) return [6, 5, 4, 3, 2];
  return [6, 5, 4, 3, 2, 1];
}

function clearCapoNotes() {
  for (let i = 1; i <= 6; i++) {
    const box = document.querySelector(`.String-${i}-Note`);
    if (box) box.textContent = "";
  }
  usersNotes = usersNotes.filter(n => !["1", "2", "3", "4", "5", "6"].includes(n.string));
}

box.addEventListener('mousedown', function (e) {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  startWidth = box.offsetWidth;
  startLeft = box.offsetLeft;
  startTop = box.offsetTop;
  document.body.style.userSelect = 'none';
});

document.addEventListener('mousemove', function (e) {
  if (!isDragging) return;

  const deltaX = e.clientX - startX;
  const deltaY = e.clientY - startY;

  const newWidth = startWidth - deltaX;
  const newLeft = startLeft + deltaX;
  const newTop = startTop + deltaY;

  if (newWidth > 15 && newWidth < 191) {
    box.style.width = newWidth + 'px';
    box.style.left = newLeft + 'px';
  }

  const minTop = 35;
  const maxTop = 620;
  const clampedTop = Math.min(Math.max(newTop, minTop), maxTop);
  box.style.top = clampedTop + 'px';

  const capoRect = box.getBoundingClientRect();
  const fretboardRect = fretboard.getBoundingClientRect();
  const capoTopRelativeToFretboard = capoRect.top - fretboardRect.top;

  const fretNumber = getFretNumberFromTop(capoTopRelativeToFretboard);
  const touchedStrings = getTouchedStringsByWidth(newWidth);
  const notes = capoNotesMap[fretNumber];

  clearCapoNotes();

  if (notes && touchedStrings.length > 0) {
    touchedStrings.forEach((stringNumber) => {
      const note = notes[stringNumber - 1];
      const displayBox = document.querySelector(`.String-${stringNumber}-Note`);

      if (displayBox) {
        displayBox.textContent = note;
      }

    //   updateUsersNotes(note.toLowerCase(), String(stringNumber));
    updateUsersNotes(note.toLowerCase(), String(stringNumber), "capo");

    });

    displayChord();
  }
});

document.addEventListener('mouseup', function () {
  isDragging = false;
  document.body.style.userSelect = '';
});