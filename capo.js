const box = document.getElementById('capo');

let isDragging = false;
let startX = 0;
let startY = 0;
let startWidth = 0;
let startLeft = 0;
let startTop = 0;

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

  // Limit width
  if (newWidth > 15 && newWidth < 191) {
    box.style.width = newWidth + 'px';
    box.style.left = newLeft + 'px';
  }

  // Limit vertical movement
  const minTop = 35;
  const maxTop = 620;
  const clampedTop = Math.min(Math.max(newTop, minTop), maxTop);
  box.style.top = clampedTop + 'px';

  // Tracking the coordinates of left most part of capo
  const rect = box.getBoundingClientRect();
  console.log("Left edge:", rect.left);
  console.log("Top:", rect.top);

  if (rect.top <= 92.5){
    console.log("1st Fret")
  } else if (rect.top <= 150){
    console.log("2nd fret")
  } else if (rect.top <= 206){
    console.log ("3rd fret")
  } else if (rect.top <= 265){
    console.log ("4th fret")
  } else if (rect.top <= 311){
    console.log ("5th fret")
  } else if (rect.top <= 358){
    console.log ("6th fret")
  } else if (rect.top <= 406){
    console.log ("7th fret")
  } else if (rect.top <= 444){
    console.log ("8th fret")
  } else if (rect.top <= 472){
    console.log ("9th fret")
  } else if (rect.top <= 501){
    console.log ("10th fret")
  } else if (rect.top <= 529){
    console.log ("11th fret")
  } else if (rect.top <= 558){
    console.log ("12th fret")
  } else if (rect.top <= 586){
    console.log ("13th fret")
  } else if (rect.top <= 615){
    console.log ("14th fret")
  } else if (rect.top <= 620){
    console.log("15th fret")
  }

  if (rect.left >= 567.6){
    console.log("Capo on no strings")
  } else if (rect.left>= 547) {
    console.log("Capo on string 6")
  } else if (rect.left>=526){
    console.log("Capo on string 6, 5")
  } else if (rect.left>=504){
    console.log("Capo on strings 6, 5, 4")
  } else if (rect.left>=485){
    console.log("Capo on strings 6, 5, 4, 3")
  } else if (rect.left>=463){
    console.log("Capo on strings 6, 5, 4, 3, 2")
  } else if (rect.left>=420){
    console.log("Capo on strings 6, 5, 4, 3, 2, 1")
  }
});

document.addEventListener('mouseup', function () {
  isDragging = false;
  document.body.style.userSelect = '';
});
