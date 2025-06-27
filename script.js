const paper = document.getElementById("paper");
const trash = document.getElementById("trash");
const sound = document.getElementById("throwSound");
const reappearSound = document.getElementById("reappearSound");

let offsetX = 0, offsetY = 0;
let isDragging = false;

paper.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - paper.offsetLeft;
  offsetY = e.clientY - paper.offsetTop;
  paper.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  paper.style.left = `${e.clientX - offsetX}px`;
  paper.style.top = `${e.clientY - offsetY}px`;
});

document.addEventListener("mouseup", () => {
  if (!isDragging) return;
  isDragging = false;
  paper.style.cursor = "grab";

  if (isOverlapping(paper, trash)) {
    sound.currentTime = 0;
    sound.play();

    // Animate into trash can
    const trashRect = trash.getBoundingClientRect();
    const trashCenterX = trashRect.left + trashRect.width / 2;
    const trashCenterY = trashRect.top + trashRect.height / 2;

    paper.style.transition = "all 0.4s ease";
    paper.style.left = `${trashCenterX - paper.offsetWidth / 2}px`;
    paper.style.top = `${trashCenterY - paper.offsetHeight / 2}px`;
    paper.style.transform = "scale(0.2)";
    paper.style.opacity = "0";

    // Call reset after animation delay
    setTimeout(() => {
      resetPaper();
    }, 500);
  }
});


function resetPaper() {
  // Shrink and hide the paper
  paper.style.transition = "transform 0.3s, opacity 0.3s";
  paper.style.transform = "translate(-50%, -50%) scale(0)";
  paper.style.opacity = "0";

  // Add longer delay before showing again
  setTimeout(() => {
    const room = document.getElementById("room");
    const roomRect = room.getBoundingClientRect();

    const maxLeft = roomRect.width - paper.offsetWidth;
    const maxTop = roomRect.height - paper.offsetHeight;

    const randomLeft = Math.random() * maxLeft;
    const randomTop = Math.random() * maxTop;

    // Play reappear sound right before showing paper again
    reappearSound.currentTime = 0;
    reappearSound.play();

    // Reposition and show the paper again
    paper.style.left = `${randomLeft}px`;
    paper.style.top = `${randomTop}px`;
    paper.style.transform = "scale(1)";
    paper.style.opacity = "1";
  }, 1200); // Delay in ms before reappearing (1.2s)
}




function isOverlapping(el1, el2) {
  const r1 = el1.getBoundingClientRect();
  const r2 = el2.getBoundingClientRect();
  return !(
    r1.right < r2.left ||
    r1.left > r2.right ||
    r1.bottom < r2.top ||
    r1.top > r2.bottom
  );
}
