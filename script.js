/* =========================================================
   YOUR PROJECTS: edit this list to add your own work.
   - category: "wedding" | "ad" | "documentary" | "music"
   - thumb:    path to an image (e.g. "assets/projects/amira.jpg"),
               or leave "" to use a colored placeholder
   - video:    a YouTube or Vimeo link, or a local .mp4 path
   - size:     "wide" (full row), "half", or "third"
   ========================================================= */
const PROJECTS = [
  { title: "Indian Wedding",     category: "wedding",     client: "Palais Namaskar & Ksar Char Bagh, Marrakech", year: "", runtime: "13:27", thumb: "https://i.ytimg.com/vi/xVdjHxrv_Rc/maxresdefault.jpg", video: "https://youtu.be/xVdjHxrv_Rc", size: "wide" },
  { title: "Palais Namaskar",    category: "wedding",     client: "Wedding film, Marrakech",  year: "", runtime: "12:43", thumb: "https://i.ytimg.com/vi/FnuTUJKlzYI/maxresdefault.jpg", video: "https://youtu.be/FnuTUJKlzYI", size: "half" },
  { title: "O Atlas",            category: "wedding",     client: "Wedding film, Marrakech",  year: "", runtime: "13:21", thumb: "https://i.ytimg.com/vi/sUlL4VNB2Tc/maxresdefault.jpg", video: "https://youtu.be/sUlL4VNB2Tc", size: "half" },
  { title: "Weaving in Morocco", category: "documentary", client: "Short documentary",        year: "", runtime: "02:11", thumb: "https://i.ytimg.com/vi/n1RfI1SbDkk/maxresdefault.jpg", video: "https://youtu.be/n1RfI1SbDkk", size: "third" },
  { title: "Vagamonde",          category: "documentary", client: "Documentary",              year: "", runtime: "08:00", thumb: "https://i.ytimg.com/vi/zOVakoGkT0w/maxresdefault.jpg", video: "https://youtu.be/zOVakoGkT0w", size: "third" },
  { title: "Oiseaux Migrateurs", category: "documentary", client: "Documentary",              year: "", runtime: "09:18", thumb: "https://i.ytimg.com/vi/pR7XlsRZcSE/hqdefault.jpg",     video: "https://youtu.be/pR7XlsRZcSE", size: "third" },
  { title: "Interactions",       category: "ad",          client: "Brand film, Centre Noor",  year: "", runtime: "13:35", thumb: "https://i.ytimg.com/vi/rt5tk7Gqt3k/maxresdefault.jpg", video: "https://youtu.be/rt5tk7Gqt3k", size: "half" },
  { title: "Les Mots Rouges",    category: "documentary", client: "Red Words",                year: 2014, runtime: "11:16", thumb: "https://i.ytimg.com/vi/9s5lykvsv4I/maxresdefault.jpg", video: "https://youtu.be/9s5lykvsv4I", size: "half" },
];

// Placeholder looks per category (used when thumb is empty)
const PLACEHOLDERS = {
  wedding:     "radial-gradient(circle at 30% 40%, #e8b08a, transparent 55%), linear-gradient(135deg, #4a2c2a, #1b1210)",
  music:       "radial-gradient(circle at 70% 30%, #ff4b2b, transparent 50%), radial-gradient(circle at 20% 80%, #6b2bff, transparent 55%), #0d0b14",
  ad:          "radial-gradient(circle at 60% 50%, #ffb347, transparent 50%), linear-gradient(160deg, #2a2016, #0e0c0a)",
  documentary: "radial-gradient(circle at 40% 60%, #6f8f7a, transparent 55%), linear-gradient(160deg, #1d2420, #0b0d0c)",
};
const CATEGORY_LABEL = { wedding: "Wedding", music: "Music Video", ad: "Ad", documentary: "Documentary" };

/* ---------- Render work grid ---------- */
const grid = document.getElementById("grid");

function renderGrid() {
  grid.innerHTML = PROJECTS.map((p, i) => {
    const bg = p.thumb ? `url('${p.thumb}')` : PLACEHOLDERS[p.category];
    const size = p.size === "wide" ? "wide" : p.size === "third" ? "third" : "";
    return `
      <article class="card ${size}" data-cat="${p.category}" data-index="${i}" tabindex="0" role="button"
               aria-label="Play ${p.title}">
        <div class="card-media" style="background:${bg}; background-size:cover; background-position:center;"></div>
        <span class="card-tc">${p.runtime}</span>
        <div class="card-info">
          <div>
            <p class="card-cat">${CATEGORY_LABEL[p.category]}</p>
            <h3 class="card-title">${p.title}</h3>
            <p class="card-meta">${p.client}${p.year ? ` · ${p.year}` : ""}</p>
          </div>
          <span class="card-play" aria-hidden="true"></span>
        </div>
      </article>`;
  }).join("");

  grid.querySelectorAll(".card").forEach((card) => {
    const open = () => openVideo(PROJECTS[card.dataset.index].video, PROJECTS[card.dataset.index].title);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    revealObserver.observe(card);
  });
}

/* ---------- Filters ---------- */
// Hide filter buttons for categories with no projects yet
document.querySelectorAll(".filter").forEach((b) => {
  const f = b.dataset.filter;
  if (f !== "all" && !PROJECTS.some((p) => p.category === f)) b.remove();
});
document.getElementById("filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter");
  if (!btn) return;
  document.querySelectorAll(".filter").forEach((b) => b.classList.toggle("active", b === btn));
  const f = btn.dataset.filter;
  grid.querySelectorAll(".card").forEach((card) => {
    card.classList.toggle("hidden", f !== "all" && card.dataset.cat !== f);
  });
});

/* ---------- Reveal on scroll ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

/* ---------- Lightbox ---------- */
const lightbox = document.getElementById("lightbox");
const frame = document.getElementById("lightboxFrame");

function toEmbed(url) {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { type: "iframe", src: `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0` };
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { type: "iframe", src: `https://player.vimeo.com/video/${vm[1]}?autoplay=1` };
  if (/\.(mp4|webm|mov)$/i.test(url)) return { type: "video", src: url };
  return { type: "iframe", src: url };
}

function openVideo(url, title = "Video") {
  const embed = toEmbed(url);
  if (!embed) {
    frame.innerHTML = `<div class="lightbox-empty">"${title}": video coming soon.<br>Add a YouTube or Vimeo link in script.js.</div>`;
  } else if (embed.type === "video") {
    frame.innerHTML = `<video src="${embed.src}" controls autoplay playsinline></video>`;
  } else {
    frame.innerHTML = `<iframe src="${embed.src}" title="${title}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  }
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeVideo() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  setTimeout(() => { frame.innerHTML = ""; }, 300);
}

document.getElementById("lightboxClose").addEventListener("click", closeVideo);
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeVideo(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeVideo(); });

// Showreel button: set data-video on #playReel in index.html to your reel's link
const reelBtn = document.getElementById("playReel");
reelBtn.addEventListener("click", () => openVideo(reelBtn.dataset.video || (document.querySelector(".hero-video source")?.getAttribute("src")), "Showreel"));

// Hide hero video element if the file is missing, so the gradient backdrop shows
const heroVideo = document.querySelector(".hero-video");
if (heroVideo.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) heroVideo.remove();
else heroVideo.querySelector("source").addEventListener("error", () => heroVideo.remove());

/* ---------- Running timecode in the hero ---------- */
const tc = document.getElementById("timecode");
const start = performance.now();
const pad = (n) => String(n).padStart(2, "0");
(function tick() {
  const t = (performance.now() - start) / 1000;
  const f = Math.floor((t % 1) * 24);
  tc.textContent = `${pad(Math.floor(t / 3600))}:${pad(Math.floor(t / 60) % 60)}:${pad(Math.floor(t) % 60)}:${pad(f)}`;
  requestAnimationFrame(tick);
})();

/* ---------- Nav ---------- */
const nav = document.querySelector(".nav");
window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 40), { passive: true });

const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
burger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") { navLinks.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
});

/* ---------- Count-up stats ---------- */
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.count;
    const t0 = performance.now();
    (function step(now) {
      const p = Math.min((now - t0) / 1400, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    })(t0);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll("[data-count]").forEach((el) => statObserver.observe(el));

document.getElementById("year").textContent = new Date().getFullYear();
renderGrid();
