/* ============================================================
   Happy 1st Monthsary, Wifey 💗
   Edit the CONFIG block below to personalize everything.
   ============================================================ */

const CONFIG = {
  /* ⭐ EDIT: your photos — drop the files into the "assets" folder.
     Each entry tries .jpg first, then .png, then .jpeg.        */
  photos: [
    { file: "photo1", caption: "Two halves, one whole heart 💗" },
    { file: "photo2", caption: "Your “Hi My Wifey” drawing 🥹" },
    { file: "photo3", caption: "Our grumpy little cat 🐱" },
    { file: "photo4", caption: "Love ones — pinky promise forever 🤝💗" },
  ],

  /* Optional: name a song by putting it at assets/music.mp3 */
  music: "assets/music.mp3",
};

/* ---------------- helpers ---------------- */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const HEARTS = ["💗", "❤️", "💕", "💕", "💞", "💞", "💖"];

/* ============================================================
   1. INTRO / ENVELOPE GATE
   ============================================================ */
const intro = $("#intro");
const openBtn = $("#openBtn");
const envelope = $("#envelope");
document.body.classList.add("is-locked");

function openSurprise() {
  envelope.classList.add("open");
  burstHearts(window.innerWidth / 2, window.innerHeight / 2, 26);

  setTimeout(() => {
    intro.classList.add("hide");
    document.body.classList.remove("is-locked");
    playMusic();
    revealVisible();
  }, 750);
}

openBtn.addEventListener("click", openSurprise);
envelope.addEventListener("click", openSurprise);

/* ============================================================
   2. FLOATING HEARTS BACKGROUND
   ============================================================ */
const canvas = $("#hearts");
const ctx = canvas.getContext("2d");
let particles = [];
let W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

class Heart {
  constructor(burst = false) {
    this.reset(burst);
  }
  reset(burst) {
    this.x = Math.random() * W;
    this.y = burst ? H + Math.random() * 60 : H + Math.random() * H;
    this.size = 12 + Math.random() * 20;
    this.speed = 0.35 + Math.random() * 0.9;
    this.drift = (Math.random() - 0.5) * 0.7;
    this.rot = Math.random() * Math.PI;
    this.spin = (Math.random() - 0.5) * 0.02;
    this.alpha = 0.18 + Math.random() * 0.42;
    this.color = ["#ff6f91", "#e8446b", "#ff9db3", "#e8648a", "#ffd0dd"][
      Math.floor(Math.random() * 5)
    ];
    this.emoji = Math.random() < 0.25;
    this.char = HEARTS[Math.floor(Math.random() * HEARTS.length)];
  }
  update() {
    this.y -= this.speed;
    this.x += this.drift + Math.sin(this.y / 60) * 0.4;
    this.rot += this.spin;
    if (this.y < -40) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    if (this.emoji) {
      ctx.font = `${this.size}px serif`;
      ctx.textAlign = "center";
      ctx.fillText(this.char, 0, 0);
    } else {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      const s = this.size / 2;
      ctx.moveTo(0, s * 0.75);
      ctx.bezierCurveTo(s * 1.4, -s * 0.4, s * 0.6, -s * 1.2, 0, -s * 0.35);
      ctx.bezierCurveTo(-s * 0.6, -s * 1.2, -s * 1.4, -s * 0.4, 0, s * 0.75);
      ctx.fill();
    }
    ctx.restore();
  }
}

function initHearts(count = 34) {
  particles = Array.from({ length: count }, () => {
    const h = new Heart();
    h.y = Math.random() * H; // spread on first paint
    return h;
  });
}
initHearts();

function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}
animate();

/* ============================================================
   3. HEART BURST (click effects)
   ============================================================ */
function burstHearts(x, y, count = 14) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "burst-heart";
    el.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 130;
    el.style.left = x + Math.cos(angle) * dist - 12 + "px";
    el.style.top = y + Math.sin(angle) * dist - 12 + "px";
    el.style.fontSize = 16 + Math.random() * 22 + "px";
    el.style.animationDuration = 1.1 + Math.random() * 1.2 + "s";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2400);
  }
}

$("#heartBurstBtn").addEventListener("click", (e) => {
  burstHearts(e.clientX, e.clientY, 22);
});

document.addEventListener("click", (e) => {
  if (Math.random() < 0.35 && !e.target.closest("button, a, .polaroid")) {
    burstHearts(e.clientX, e.clientY, 3);
  }
});

/* ============================================================
   4. GALLERY (built from CONFIG.photos, with fallbacks)
   ============================================================ */
const grid = $("#galleryGrid");
const EXTENSIONS = ["jpg", "png", "jpeg"];

function withFallbacks(img, base) {
  const paths = EXTENSIONS.map((e) => `assets/${base}.${e}`);
  let i = 0;
  img.addEventListener("error", () => {
    i++;
    if (i < paths.length) img.src = paths[i];
  });
  img.addEventListener("load", () => {
    if (img.naturalWidth > 0) img.classList.add("loaded");
  });
  img.src = paths[0];
}

CONFIG.photos.forEach((p, idx) => {
  const fig = document.createElement("figure");
  fig.className = "polaroid reveal";
  fig.style.setProperty("--tilt", `${(idx % 2 === 0 ? -1 : 1) * (1 + Math.random() * 2.4)}deg`);
  fig.style.transitionDelay = `${idx * 90}ms`;
  fig.innerHTML = `
    <span class="polaroid__tape"></span>
    <div class="polaroid__frame">
      <img alt="${p.caption.replace(/"/g, "&quot;")}">
      <div class="polaroid__placeholder"><span>💗</span><small>assets/${p.file}.jpg</small></div>
    </div>
    <figcaption class="polaroid__caption">${p.caption}</figcaption>
  `;
  withFallbacks(fig.querySelector("img"), p.file);

  fig.addEventListener("click", () => openLightbox(fig.querySelector("img"), p.caption));
  grid.appendChild(fig);
});

/* featured heart-framed photo uses the same fallback chain */
withFallbacks($(".heart-frame__img img"), "photo1");

/* ============================================================
   6. LIGHTBOX
   ============================================================ */
const lightbox = $("#lightbox");
const lightboxImg = $("#lightboxImg");
const lightboxCaption = $("#lightboxCaption");

function openLightbox(img, caption) {
  if (!img.classList.contains("loaded")) return;
  lightboxImg.src = img.src;
  lightboxCaption.textContent = caption;
  lightbox.hidden = false;
  requestAnimationFrame(() => lightbox.classList.add("show"));
  document.body.classList.add("is-locked");
}

function closeLightbox() {
  lightbox.classList.remove("show");
  document.body.classList.remove("is-locked");
  setTimeout(() => (lightbox.hidden = true), 350);
}

$("#lightboxClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
});

/* ============================================================
   7. DEEPER LETTER TOGGLE
   ============================================================ */
const deepBtn = $("#deepLetterBtn");
const deepLetter = $("#deepLetter");

deepBtn.addEventListener("click", () => {
  const open = !deepLetter.hidden;
  deepLetter.hidden = open;
  deepBtn.classList.toggle("open", !open);
  deepBtn.querySelector(".letter-more__label").textContent = open
    ? "Read the deeper one 🥹"
    : "Hide it for now 🙈";
  if (!open) {
    setTimeout(() => deepLetter.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
  }
});

/* ============================================================
   8. MUSIC (optional — works once you add assets/music.mp3)
   ============================================================ */
const music = $("#bgMusic");
const musicBtn = $("#musicBtn");
let musicOn = false;

function playMusic() {
  if (!CONFIG.music) return;
  music.volume = 0.55;
  music.play().then(() => {
    musicOn = true;
    musicBtn.classList.add("playing");
  }).catch(() => {
    /* no file yet or autoplay blocked — user can tap the button */
  });
}

musicBtn.addEventListener("click", () => {
  if (musicOn) {
    music.pause();
    musicOn = false;
    musicBtn.classList.remove("playing");
  } else {
    playMusic();
    if (music.paused) {
      // file missing: gentle hint instead of a silent button
      musicBtn.classList.add("playing");
      setTimeout(() => musicBtn.classList.remove("playing"), 1200);
    } else {
      musicOn = true;
    }
  }
});

music.addEventListener("error", () => {
  musicBtn.style.opacity = "0.55";
  musicBtn.title = "Add assets/music.mp3 to enable music";
});

/* ============================================================
   9. SCROLL REVEAL
   ============================================================ */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

function revealVisible() {
  $$(".reveal").forEach((el) => observer.observe(el));
}
revealVisible();
