const messages = [
  "Kalau rindu itu ada suaranya, mungkin namamu yang paling sering terdengar.",
  "Kamu itu seperti charger: dekat kamu, energi aku balik lagi.",
  "Aku tidak butuh Google Maps, arah pulangku tetap ke kamu.",
  "Boleh pinjam bahumu? Aku mau menaruh semua rasa nyaman di sana.",
  "Kalau kamu adalah pertanyaan, aku rela jadi jawaban yang tidak pernah selesai.",
];

const messageElement = document.querySelector("#loveMessage");
const noteNumberElement = document.querySelector("#noteNumber");
const dotsElement = document.querySelector("#noteDots");
const surpriseButton = document.querySelector("#surpriseButton");
const anotherButton = document.querySelector("#anotherButton");
const confettiLayer = document.querySelector("#confettiLayer");
const loveLayer = document.querySelector("#loveLayer");
let messageIndex = 0;

messages.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.className = `note-dot${index === 0 ? " active" : ""}`;
  dot.type = "button";
  dot.setAttribute("aria-label", `Buka pesan ${index + 1}`);
  dot.addEventListener("click", () => showMessage(index));
  dotsElement.append(dot);
});

function showMessage(index) {
  messageIndex = index;
  messageElement.classList.add("swap");
  window.setTimeout(() => {
    messageElement.textContent = messages[messageIndex];
    noteNumberElement.textContent = `0${messageIndex + 1} / 05`;
    document.querySelectorAll(".note-dot").forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === messageIndex);
    });
    messageElement.classList.remove("swap");
  }, 180);
}

function nextMessage() {
  showMessage((messageIndex + 1) % messages.length);
}

function launchConfetti() {
  const colors = ["#e86857", "#f4b19e", "#86a17a", "#262126", "#e6b85c"];
  for (let index = 0; index < 34; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.textContent = index % 3 === 0 ? "♥" : "✦";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.color = colors[index % colors.length];
    piece.style.fontSize = `${10 + Math.random() * 14}px`;
    piece.style.setProperty("--drift", `${-120 + Math.random() * 240}px`);
    piece.style.animationDelay = `${Math.random() * 0.45}s`;
    confettiLayer.append(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
}

function createLoveParticle(x, y, options = {}) {
  const particle = document.createElement("span");
  const heartSymbols = ["♥", "♡", "❤", "♥"];
  const size = options.size || 14 + Math.random() * 18;
  const dx = options.dx || Math.random() * 80 - 40;
  const dy = options.dy || -20 - Math.random() * 60;
  const rotation = options.rotation || Math.random() * 180 - 90;

  particle.className = "love-particle";
  particle.textContent =
    heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  particle.style.fontSize = `${size}px`;
  particle.style.color =
    options.color ||
    ["#e86857", "#f4b19e", "#d7537f", "#809970"][Math.floor(Math.random() * 4)];
  particle.style.setProperty("--dx", `${dx}px`);
  particle.style.setProperty("--dy", `${dy}px`);
  particle.style.setProperty("--rotate", `${rotation}deg`);
  particle.style.setProperty("--scale", `${0.7 + Math.random() * 0.8}`);
  particle.style.setProperty("--delay", `${options.delay || 0}s`);

  loveLayer.appendChild(particle);
  window.setTimeout(() => particle.remove(), 1400);
}

function spawnCursorLove(event) {
  const { clientX, clientY } = event;
  const burstCount = window.innerWidth < 600 ? 2 : 3;

  for (let i = 0; i < burstCount; i += 1) {
    createLoveParticle(
      clientX + (Math.random() * 18 - 9),
      clientY + (Math.random() * 18 - 9),
      {
        dx: Math.random() * 28 - 14,
        dy: -10 - Math.random() * 26,
        size: 12 + Math.random() * 16,
        rotation: Math.random() * 120 - 60,
        delay: Math.random() * 0.08,
      },
    );
  }
}

function spawnClickLove(event) {
  const { clientX, clientY } = event;

  for (let i = 0; i < 18; i += 1) {
    const angle = (Math.PI * 2 * i) / 18;
    const distance = 24 + Math.random() * 36;
    createLoveParticle(clientX, clientY, {
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance - 20,
      size: 12 + Math.random() * 18,
      rotation: Math.random() * 220 - 110,
      color: ["#e86857", "#f7c9bd", "#d96d84", "#7da165"][i % 4],
    });
  }

  launchConfetti();
}

document.addEventListener("pointermove", (event) => {
  if (Math.random() < 0.18) {
    spawnCursorLove(event);
  }
});

document.addEventListener("click", (event) => {
  spawnClickLove(event);
});

surpriseButton.addEventListener("click", () => {
  nextMessage();
  launchConfetti();
  surpriseButton.innerHTML = "Kejutannya muncul <span>♥</span>";
});

anotherButton.addEventListener("click", nextMessage);
