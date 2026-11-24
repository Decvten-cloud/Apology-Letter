const catStage = document.getElementById("catStage");
const letterCard = document.getElementById("letterCard");
const replayButton = document.getElementById("replayButton");
const closeLetter = document.getElementById("closeLetter");
const photoInput = document.getElementById("photoInput");
const memoryPhoto = document.getElementById("memoryPhoto");
const photoPlaceholder = document.querySelector(".photo-placeholder");
const teaseEnvelope = document.getElementById("teaseEnvelope");
const teaseTitle = document.getElementById("teaseTitle");
const teaseHint = document.getElementById("teaseHint");

let teaseCount = 0;

function playSequence() {
  teaseCount = 0;
  letterCard.classList.remove("revealed", "closed", "tease-ready", "dodging", "dodging-now");
  letterCard.removeAttribute("style");
  catStage.classList.remove("delivered", "delivering");
  catStage.style.opacity = "";
  replayButton.classList.remove("visible");
  teaseTitle.textContent = "TOUCH ME";
  teaseHint.textContent = "Ada surat buat kamu";

  void catStage.offsetWidth;
  catStage.classList.add("entering");

  window.setTimeout(() => {
    catStage.classList.remove("entering");
  }, 2100);

  window.setTimeout(() => {
    catStage.classList.add("delivering");
  }, 2050);

  window.setTimeout(() => {
    catStage.classList.add("delivered");
    prepareTeasingLetter();
  }, 3200);
}

function prepareTeasingLetter() {
  letterCard.style.setProperty("--tease-left", "50%");
  letterCard.style.setProperty("--tease-top", "42%");
  letterCard.classList.add("tease-ready");
  teaseEnvelope.focus({ preventScroll: true });
}

function dodgeLetter() {
  teaseCount += 1;

  if (teaseCount === 1) {
    teaseTitle.textContent = "EITSS...";
    teaseHint.textContent = "Pencet lagiii";
    letterCard.style.setProperty("--tease-left", "76%");
    letterCard.style.setProperty("--tease-top", "28%");
  } else if (teaseCount === 2) {
    teaseTitle.textContent = "HEHE...";
    teaseHint.textContent = "Coba lagi";
    letterCard.classList.add("dodging");

    window.setTimeout(() => {
      letterCard.classList.add("dodging-now");
      letterCard.style.setProperty("--tease-left", "24%");
      letterCard.style.setProperty("--tease-top", "68%");
      letterCard.classList.remove("dodging");

      window.setTimeout(() => {
        letterCard.classList.remove("dodging-now");
      }, 650);
    }, 260);
  } else {
    letterCard.classList.remove("tease-ready", "dodging", "dodging-now");
    letterCard.removeAttribute("style");
    letterCard.classList.add("revealed");
    replayButton.classList.add("visible");
  }
}

teaseEnvelope.addEventListener("click", dodgeLetter);

closeLetter.addEventListener("click", () => {
  letterCard.classList.remove("revealed");
  letterCard.classList.add("closed");
  replayButton.classList.add("visible");
});

replayButton.addEventListener("click", playSequence);

photoInput.addEventListener("change", (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      const maxSize = 1200;
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);

      const savedImage = canvas.toDataURL("image/jpeg", 0.82);
      try {
        localStorage.setItem("apologyLetterPhoto", savedImage);
        showSavedPhoto(savedImage);
      } catch (error) {
        alert("The photo is too large to save in this browser. Please choose a smaller image.");
      }
    };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
});

function showSavedPhoto(source) {
  memoryPhoto.src = source;
  memoryPhoto.hidden = false;
  photoPlaceholder.hidden = true;
}

window.addEventListener("load", () => {
  const savedPhoto = localStorage.getItem("apologyLetterPhoto");
  if (savedPhoto) showSavedPhoto(savedPhoto);
  window.setTimeout(playSequence, 350);
});
