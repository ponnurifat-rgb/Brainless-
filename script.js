/* ============================================================
   CampusVibes — fresh build script.js
   ------------------------------------------------------------
   ★ EDIT PHOTOS + DIALOGUES HERE (top of file) ★
   Every photo in assets/ jumps to the FRONT of the homepage
   in a BIG popup whenever the visitor clicks anywhere.
   ============================================================ */

/* ================= 1. PHOTOS + DIALOGUES — EDIT HERE =================
   photo   → file in assets/ (all 13 used!)
   label   → small badge shown on the photo
   dialogue→ BIG funny line shown with the photo (your exact lines!) */
const POPUPS = [
  { photo: "assets/photo-1.jpeg",  label: "📸 MITHRA",  dialogue: "ediyeyyy sughalleee" },
  { photo: "assets/photo-2.jpeg",  label: "📸 DURGAA",  dialogue: "gwak gwak gwak" },
  { photo: "assets/photo-3.jpeg",  label: "📸 RITHUU",  dialogue: "allelum enne kaanan nalla bangiya" },
  { photo: "assets/photo-4.jpeg",  label: "📸 APARNA",  dialogue: "muhihihihi" },
  { photo: "assets/photo-5.jpeg",  label: "📸 AKSHARAA",  dialogue: "anakk entha vayyee" },
  { photo: "assets/photo-6.jpeg",  label: "📸 AKSHH",  dialogue: "podaa pottaaaa" },
  { photo: "assets/photo-7.jpeg",  label: "📸 ASHNAAA",  dialogue: "mwahhhhh" },
  { photo: "assets/photo-8.jpeg",  label: "📸 KATHERINEEE",  dialogue: "cuteness overloadeddd" },
  { photo: "assets/photo-9.jpeg",  label: "📸 SHIFAAA",  dialogue: "nikk nikkk nikk" },
  { photo: "assets/photo-10.jpeg", label: "📸 ASHNAAA 2.0", dialogue: "gangeeeee" },
  { photo: "assets/photo-11.jpeg", label: "📸 BITCHES", dialogue: "nee yethadaaaa pottaaaa" },
  { photo: "assets/photo-12.jpeg", label: "📸 SMIJEEE", dialogue: "enth nokki nikkaaa" },
  { photo: "assets/photo-13.jpeg", label: "📸 BHAMAAA", dialogue: "hiiii gooyzzzzz" },
  { photo: "assets/photo-14.jpeg", label: "📸 Photo 14", dialogue: "heyy njan ivideyund!" },
];

// small second lines under the big dialogue (rotates randomly)
const SUBLINES = [
  "Nee click cheythu, njan front-il vannu! 🎉",
  "Ithaan ente grand entry! Kaiyadi! 👏",
  "Photo kandille? Ippo kandu, alle? 😎",
  "Click cheythathinu nandi! Veendum vaa! 💜",
];

// exit-challenge popups (Log Out attempts 1–3, playful blocks)
const EXIT_POPUPS = [
  { kicker: "🚪 LOG OUT #1 — NOPE!", title: "Bro, ivide vare vannittu pokuvaano?!", msg: "13 photo friends-e okke kandittu ithaano thanks? Irinnu mone!" },
  { kicker: "🚨 LOG OUT #2 — DENIED!", title: "Exit denied! Door lock aanu!", msg: "Sofa vachu door block cheythu. Chai kudichittu shanthamaayi irikku! ☕" },
  { kicker: "🎓 LOG OUT #3 — LAST WARNING!", title: "Oru photo koodi. Pinne povam!", msg: "Okay okay — third time charm. Kazhinjal free. Promise! 🥹" },
];

const TICKER_JOKES = ["click anywhere for a surprise!", "13 hidden photo friends!", "100% colourful, 0% boring", "exhibition special edition 🌈", "every click = new photo!", "padikku mone, clickum cheyyu!"];
const LOAD_JOKES = ["Bringing a friend…", "Picking the funniest photo…", "Adding extra colours…", "Warming up the camera…", "Almost there…"];
const TIPS = [
  "25 focused minutes beat 3 distracted hours. Start the timer! ⏱️",
  "Revise one tough topic today — future-you says thanks! ✨",
  "Drink water, stretch, then finish that pending assignment! 🌊",
  "Attendance 75% cross cheyyu — tension free semester! ✅",
  "Small steps daily beat last-minute panic. You've got this! 📚",
];

/* ================= 2. STATE ================= */
const state = {
  clicks: 0,          // every click on the site
  photosShown: 0,     // popup counter (drives fun meter + photo-1 star rule)
  fun: 8,             // 0–100 fun meter
  exitAttempts: 0,    // log-out challenge (3 blocks, 4th leaves for real)
  modalOpen: false,
  dodgeCatches: 0,
  bag: [],            // no-repeat photo rotation
  lastPopup: 0,       // cooldown so popups stay closable
};

/* ================= 3. HELPERS ================= */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const rand = (n) => Math.floor(Math.random() * n);

/* Next photo index: photo-1 jumps FIRST + every 4th popup (the star!),
   everyone else rotates with no repeats until all 13 have shown. */
function nextPhotoIndex() {
  state.photosShown++;
  if (state.photosShown === 1 || state.photosShown % 4 === 0) return 0; // ⭐ photo-1
  if (state.photosShown === 2) return 13; // ⭐ new photo-14 jumps 2nd!
  if (state.bag.length === 0) {
    state.bag = POPUPS.map((_, i) => i).filter((i) => i !== 0);
    // shuffle
    for (let i = state.bag.length - 1; i > 0; i--) {
      const j = rand(i + 1);
      [state.bag[i], state.bag[j]] = [state.bag[j], state.bag[i]];
    }
  }
  return state.bag.pop();
}

/* ================= 4. BIG FRONT PHOTO POPUP =================
   Photo + dialogue ALWAYS appear together, BIG, front-most. */
function showPhotoPopup(index) {
  const p = POPUPS[index] || POPUPS[0];
  $("#modal-kicker").textContent = `${p.label} • YOU CLICKED!`;
  $("#modal-title").textContent = p.dialogue; // ★ the funny dialogue, BIG
  $("#modal-msg").textContent = SUBLINES[rand(SUBLINES.length)];
  const img = $("#modal-img");
  img.onerror = function () { this.onerror = null; this.src = "assets/photo-1.jpeg"; };
  img.src = p.photo;
  img.alt = `Surprise photo: ${p.dialogue}`;
  $("#modal-friend-badge").textContent = p.label;
  $("#modal-from").textContent = `— ${p.label}, jumping in front of you 👀`;

  $("#modal-backdrop").classList.remove("hidden");
  state.modalOpen = true;

  // replay entrance animation + random photo effect (zoom / tilt / flash)
  const modal = $("#modal");
  modal.classList.remove("shake", "fx-zoom", "fx-tilt", "fx-flash", "star-dialogue", "gwak-dialogue");
  modal.style.animation = "none";
  void modal.offsetWidth;
  modal.style.animation = "";
  modal.classList.add(["fx-zoom", "fx-tilt", "fx-flash"][rand(3)]);
  if (index === 0) modal.classList.add("star-dialogue"); // MITHRA's line gets VIP styling ✨
  if (index === 1) modal.classList.add("gwak-dialogue"); // DURGAA's line gets its own playful style 🐸
  img.style.animation = "none";
  void img.offsetWidth;
  img.style.animation = "";

  bumpFun(6);
  SoundFX.pop(); // boing! 📸
  const g = $("#stat-glitches");
  if (g) g.textContent = state.photosShown;
  const bye = $("#bye-glitches");
  if (bye) bye.textContent = state.photosShown;
}

function hideModal() {
  if (!state.modalOpen) return;
  $("#modal-backdrop").classList.add("hidden");
  state.modalOpen = false;
}

function randomPhotoPopup() {
  triggerGlitch();
  showPhotoPopup(nextPhotoIndex());
}

/* ================= 5. GLITCH EFFECTS (<800ms, site stays usable) ================= */
const GLITCH_CLASSES = ["glitch-shake", "glitch-rgb", "glitch-spin", "glitch-flip", "glitch-upside"];
function triggerGlitch(forceEffect) {
  const effect = forceEffect || GLITCH_CLASSES[rand(GLITCH_CLASSES.length)];
  document.body.classList.remove(...GLITCH_CLASSES);
  void document.body.offsetWidth;
  document.body.classList.add(effect);
  setTimeout(() => document.body.classList.remove(effect), 800);
  return effect;
}

/* ================= 6. TOASTS + LOADER ================= */
function toast(title, msg, type = "") {
  const box = $("#toasts");
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.innerHTML = `<b></b><span></span>`;
  el.querySelector("b").textContent = title;
  el.querySelector("span").textContent = msg;
  box.appendChild(el);
  setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 350); }, 3600);
  while (box.children.length > 4) box.firstChild.remove();
}

function fakeLoading(done, duration = 1800) {
  const loader = $("#loader");
  const bar = $("#loader-bar");
  const text = $("#loader-text");
  loader.classList.remove("hidden");
  const start = performance.now();
  function tick(now) {
    const p = Math.min(1, (now - start) / duration);
    const pct = Math.floor(p * 100);
    bar.style.width = pct + "%";
    text.textContent = `${LOAD_JOKES[Math.min(LOAD_JOKES.length - 1, Math.floor(p * LOAD_JOKES.length))]} ${pct}%`;
    if (p < 1) requestAnimationFrame(tick);
    else { loader.classList.add("hidden"); bar.style.width = "0%"; done && done(); }
  }
  requestAnimationFrame(tick);
}

/* ================= 7. FUN METER + CLICK COUNTER ================= */
function bumpFun(amount) {
  state.fun = Math.min(100, state.fun + amount);
  const meter = $("#chaos-meter");
  if (meter) meter.style.width = state.fun + "%";
  const label = $("#chaos-label");
  if (label) label.textContent = `${state.photosShown} yet — click anywhere!`;
  const sanity = $("#footer-sanity");
  if (sanity) sanity.textContent = Math.min(999, 100 + state.photosShown * 10) + "%";
  document.body.classList.toggle("chaos-3", state.fun >= 75);
}

function countClick() {
  state.clicks++;
  const el = $("#stat-clicks");
  if (el) el.textContent = state.clicks;
  bumpFun(2);
}

/* ================= 8. NAVIGATION ================= */
function handleNav(targetId) {
  countClick();
  const target = document.getElementById(targetId);
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  $("#mobile-menu").classList.remove("open");
}

/* ================= 9. LOG-OUT CHALLENGE (3 playful blocks, 4th leaves!) ===
   In-page only — browser close/back buttons always work normally. */
function attemptExit() {
  countClick();
  state.exitAttempts++;
  const n = state.exitAttempts;
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (n <= 3) {
    const e = EXIT_POPUPS[n - 1];
    triggerGlitch("glitch-shake");
    bumpFun(12);
    setTimeout(() => {
      $("#modal-kicker").textContent = e.kicker;
      $("#modal-title").textContent = e.title;
      $("#modal-msg").textContent = e.msg;
      const img = $("#modal-img");
      img.src = POPUPS[(n * 4) % POPUPS.length].photo; // different friend each attempt
      $("#modal-friend-badge").textContent = `🚪 Attempt ${n}/4`;
      $("#modal-from").textContent = "— The Exit Prevention Team 👀";
      $("#modal-backdrop").classList.remove("hidden");
      state.modalOpen = true;
      bumpFun(6);
    }, 500);
    toast(`Log out blocked (${n}/4)`, n === 3 ? "One more click and you're free. Promise!" : "The door is locked. Click again!", "error");
    if (n === 3) {
      const btn = $("#exit-btn");
      if (btn) btn.textContent = "Log Out (confirm!) 🥹";
      const fe = $("#final-exit");
      if (fe) fe.textContent = "🚪 Confirm Log Out";
    }
  } else {
    // 4th attempt → farewell + actually leave the website
    triggerGlitch("glitch-flip");
    $("#bye-backdrop").classList.remove("hidden");
    toast("Logged out! (4/4)", "See you soon! Leaving in 2 seconds…", "");
    setTimeout(() => { window.location.href = "https://www.google.com"; }, 2000);
  }
}

/* ================= 9B. BACKGROUND SOUND (Web Audio, no files needed!) ======
   Browsers block autoplay-with-sound, so we START the music on the
   very first click/tap/keypress anywhere (guaranteed to happen fast
   here!). Toggle with the 🔊 button. */
const SoundFX = {
  ctx: null, musicOn: true, musicTimer: null, step: 0,
  // bouncy happy loop: [note, beats] — C major sunshine! 🎶
  MELODY: [
    ["C5", 1], ["E5", 1], ["G5", 1], ["E5", 1],
    ["A5", 1], ["G5", 1], ["E5", 1], ["D5", 1],
    ["C5", 1], ["E5", 1], ["G5", 1], ["A5", 1],
    ["G5", 2], ["C5", 2],
  ],
  FREQS: { C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880 },
  BEAT: 0.22, // seconds per beat — peppy!

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      this.ctx = new AC();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return true;
  },
  playNote(freq, dur, type = "triangle", vol = 0.06) {
    if (!this.ctx || !this.musicOn) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  },
  startMusic() {
    if (!this.ensure() || this.musicTimer || !this.musicOn) return;
    const tick = () => {
      if (!this.musicOn) return;
      const [note, beats] = this.MELODY[this.step % this.MELODY.length];
      this.playNote(this.FREQS[note], beats * this.BEAT * 0.95);
      this.step++;
      this.musicTimer = setTimeout(tick, beats * this.BEAT * 1000);
    };
    tick();
  },
  stopMusic() {
    clearTimeout(this.musicTimer);
    this.musicTimer = null;
  },
  pop() { // happy "boing" whenever a photo jumps out! 📸
    if (!this.ctx || !this.musicOn) return;
    this.playNote(880, 0.09, "square", 0.04);
    setTimeout(() => this.playNote(1174.66, 0.12, "square", 0.04), 70);
  },
  click() { // tiny tick on EVERY click — pitch jumps around playfully! 🖱️
    if (!this.ctx || !this.musicOn) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 500 + Math.random() * 700; // random pitch every tap!
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.09);
  },
  blast() { // party-popper fanfare for the Surprise-Me button! 🎉💥
    if (!this.ctx || !this.musicOn) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      setTimeout(() => this.playNote(f, 0.18, "square", 0.06), i * 90);
    });
    setTimeout(() => {
      [523.25, 659.25, 783.99, 1046.5].forEach((f) => this.playNote(f, 0.5, "triangle", 0.05));
    }, 400);
  },
};

/* Confetti explosion! Spawns colourful pieces that blast outward,
   spin and rain down. Pure CSS animation, auto-cleaned. 🎉 */
function confettiBlast(x, y, count = 90) {
  const COLORS = ["#f43f5e", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#ec4899"];
  const SHAPES = ["●", "■", "▲", "★", "✿", "♦"];
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "confetti-piece";
    s.textContent = SHAPES[rand(SHAPES.length)];
    const ang = Math.random() * Math.PI * 2;
    const dist = 120 + Math.random() * 340;
    s.style.left = x + "px";
    s.style.top = y + "px";
    s.style.setProperty("--dx", Math.cos(ang) * dist + "px");
    s.style.setProperty("--dy", Math.sin(ang) * dist - 140 + "px");
    s.style.color = COLORS[rand(COLORS.length)];
    s.style.fontSize = 12 + Math.random() * 20 + "px";
    s.style.animationDuration = 0.9 + Math.random() * 1 + "s";
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 2300);
  }
}

/* ================= 10. WIRE UP EVERYTHING ================= */
document.addEventListener("DOMContentLoaded", () => {
  /* ---- ambient counters ---- */
  let visitors = 42 + rand(20);
  const vEl = $("#visitor-count");
  setInterval(() => {
    visitors++;
    if (vEl) vEl.textContent = `visitor #${String(visitors).padStart(4, "0")}`;
    const lu = $("#live-users");
    if (lu) lu.textContent = `${(1200 + rand(400)).toLocaleString()} students online now`;
    const tj = $("#ticker-joke");
    if (tj && Math.random() < 0.3) tj.textContent = TICKER_JOKES[rand(TICKER_JOKES.length)];
  }, 4000);

  /* ---- nav ---- */
  $$("[data-nav]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      handleNav(a.dataset.nav);
    });
  });
  $("#hamburger").addEventListener("click", () => {
    const m = $("#mobile-menu");
    const open = m.classList.toggle("open");
    $("#hamburger").setAttribute("aria-expanded", open);
  });

  /* ---- modal buttons ---- */
  $("#modal-close").addEventListener("click", hideModal);
  $("#modal-ok").addEventListener("click", hideModal);
  $("#modal-more").addEventListener("click", () => {
    countClick();
    randomPhotoPopup(); // swap to the next friend instantly
  });
  $("#modal-backdrop").addEventListener("click", (e) => {
    if (e.target.id === "modal-backdrop") hideModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!$("#bye-backdrop").classList.contains("hidden")) $("#bye-backdrop").classList.add("hidden");
      else hideModal();
    }
  });

  /* ---- hero / CTA buttons → instant photo ---- */
  ["#hero-start", "#hero-demo", "#cta-btn", "#mobile-cta", "#deploy-btn", "#login-btn"].forEach((sel) => {
    const el = $(sel);
    if (!el) return;
    el.addEventListener("click", () => {
      countClick();
      if (sel === "#mobile-cta") $("#mobile-menu").classList.remove("open");
      if (sel === "#login-btn") document.getElementById("playground").scrollIntoView({ behavior: "smooth" });
      randomPhotoPopup();
    });
  });
  $("#logo-emoji").addEventListener("click", () => {
    const faces = ["🎉", "🌈", "📸", "⭐", "🎓", "💜"];
    $("#logo-emoji").textContent = faces[rand(faces.length)];
    toast("Nice!", "Thanks for exploring CampusVibes!", "");
  });

  /* ---- log-out buttons (4-attempt farewell) ---- */
  ["#exit-btn", "#final-exit"].forEach((sel) => {
    $(sel).addEventListener("click", attemptExit);
  });
  $("#bye-stay").addEventListener("click", () => {
    $("#bye-backdrop").classList.add("hidden");
    toast("Yay!", "More photos await. Keep clicking! 📸", "");
  });
  $("#final-chaos").addEventListener("click", (e) => {
    countClick();
    bumpFun(25);
    // 💥 CONFETTI BLAST from the button!
    const r = e.currentTarget.getBoundingClientRect();
    confettiBlast(r.left + r.width / 2, r.top + r.height / 2, 90);
    SoundFX.blast();
    triggerGlitch();
    fakeLoading(() => randomPhotoPopup(), 1400);
  });

  /* ---- feature cards → instant photo ---- */
  $$(".card[data-feature] .card-btn").forEach((btn) => {
    btn.addEventListener("click", () => { countClick(); randomPhotoPopup(); });
  });

  /* ---- pricing ---- */
  $$(".price-btn").forEach((btn) => {
    btn.addEventListener("click", () => { countClick(); randomPhotoPopup(); });
  });

  /* ---- dodge mini-game ---- */
  const arena = $("#dodge-arena");
  const dodge = $("#dodge-btn");
  function moveDodge() {
    const r = arena.getBoundingClientRect();
    const x = Math.random() * Math.max(10, r.width - 120);
    const y = Math.random() * Math.max(10, r.height - 50);
    dodge.style.left = x + "px";
    dodge.style.top = y + "px";
    dodge.style.transform = "none";
    dodge.classList.add("flee");
  }
  dodge.addEventListener("mouseenter", () => { if (state.dodgeCatches < 5 && Math.random() < 0.75) moveDodge(); });
  dodge.addEventListener("click", () => {
    countClick();
    state.dodgeCatches++;
    $("#dodge-count").textContent = state.dodgeCatches;
    dodge.classList.remove("flee");
    if (state.dodgeCatches >= 5) {
      dodge.textContent = "OK you win! 🏆";
      showPhotoPopup(12); // photo-13 celebrates with you!
    } else {
      randomPhotoPopup();
      moveDodge();
    }
  });

  /* ---- login form ---- */
  $("#login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    countClick();
    fakeLoading(() => { randomPhotoPopup(); $("#login-form").reset(); }, 1500);
  });

  /* ---- subscribe form ---- */
  $("#subscribe-form").addEventListener("submit", (e) => {
    e.preventDefault();
    countClick();
    fakeLoading(() => { randomPhotoPopup(); $("#subscribe-form").reset(); }, 1300);
  });

  /* ---- download ---- */
  $("#download-btn").addEventListener("click", () => {
    countClick();
    const wrap = $("#download-progress");
    const bar = $("#download-bar");
    const label = $("#download-label");
    wrap.classList.remove("hidden");
    let p = 0;
    const iv = setInterval(() => {
      p += rand(14) + 3;
      if (p >= 99) {
        p = 99;
        bar.style.width = "99%";
        label.textContent = "99% (almost there…)";
        clearInterval(iv);
        setTimeout(() => {
          randomPhotoPopup();
          bar.style.width = "0%";
          label.textContent = "0%";
          wrap.classList.add("hidden");
        }, 1200);
        return;
      }
      bar.style.width = p + "%";
      label.textContent = p + "%";
    }, 200);
  });

  /* ---- compliment machine ---- */
  $("#compliment-btn").addEventListener("click", () => {
    countClick();
    $("#compliment-out").textContent = TIPS[rand(TIPS.length)];
    bumpFun(3);
  });

  /* ---- magic search ---- */
  function doSearch() {
    const q = $("#useless-search").value.trim();
    countClick();
    if (!q) {
      toast("Empty search", "Type something first — then get a friend! 📸", "warn");
      randomPhotoPopup();
      return;
    }
    fakeLoading(() => {
      $("#search-out").textContent = `No results for "${q}" — but here's a friend instead! 📸`;
      randomPhotoPopup();
    }, 1200);
  }
  $("#search-btn").addEventListener("click", doSearch);
  $("#useless-search").addEventListener("keydown", (e) => { if (e.key === "Enter") doSearch(); });

  /* ---- mystery friend tiles → reveal THAT friend ---- */
  $$(".mate").forEach((m) => {
    m.addEventListener("click", () => {
      countClick();
      const i = parseInt(m.dataset.friend, 10) || 0;
      triggerGlitch("glitch-flip");
      showPhotoPopup(i);
    });
  });

  /* ---- mystery footer button ---- */
  $("#secret-btn").addEventListener("click", () => {
    countClick();
    randomPhotoPopup();
  });

  /* ---- 📤 BIG UPLOAD: your photo joins the series! ----
     Files picked in the big upload station get their own tile at the
     end of the grid AND jump out in popups! */
  $("#big-upload-input").addEventListener("change", (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    files.forEach((file, n) => {
      const url = URL.createObjectURL(file);
      const idx = POPUPS.length;
      POPUPS.push({ photo: url, label: "📸 YOU!", dialogue: "heyy njan puthiya guest!" });
      // add a tile to the end of the photo series
      const tile = document.createElement("button");
      tile.className = "mate";
      tile.dataset.friend = idx;
      tile.innerHTML = `<img alt="Your uploaded photo" /><strong>YOU!</strong><span>heyy njan puthiya guest!</span>`;
      tile.querySelector("img").src = url;
      tile.addEventListener("click", () => {
        countClick();
        triggerGlitch("glitch-flip");
        showPhotoPopup(idx);
      });
      document.querySelector(".team-grid").appendChild(tile);
      tile.classList.add("reveal", "visible");
      // first upload jumps out immediately!
      if (n === 0) setTimeout(() => showPhotoPopup(idx), 400);
    });
    countClick();
    toast("Photos added! 📸", `${files.length} new face(s) joined the series. Click anywhere!`);
    triggerGlitch("glitch-flip");
    e.target.value = ""; // allow uploading the same file again
  });

  /* ★★★ CLICK ANYWHERE = BIG FRONT PHOTO ★★★
     Literally every click on the site (text, bubbles, blank space,
     inputs, links) jumps a photo to the front. Only the popup
     itself and the loader block new popups. Specific buttons above
     fire first and open the popup synchronously, so this skips
     cleanly (no double popups). 0.7s cooldown keeps it closable. */
  const BURST_EMOJIS = ["⭐", "💥", "✨", "🌈", "⚡", "💜", "📸"];
  document.addEventListener("click", (e) => {
    // colourful burst exactly where they clicked
    const b = document.createElement("span");
    b.className = "click-burst";
    b.textContent = BURST_EMOJIS[rand(BURST_EMOJIS.length)];
    b.style.left = e.clientX + "px";
    b.style.top = e.clientY + "px";
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 750);
    SoundFX.click(); // tick sound on EVERY click! 🖱️🔊

    if (e.target.closest("#modal-backdrop, #bye-backdrop, .modal")) return;
    if (state.modalOpen || !$("#loader").classList.contains("hidden")) return;
    const now = Date.now();
    if (now - state.lastPopup > 700) {
      state.lastPopup = now;
      randomPhotoPopup();
    } else {
      triggerGlitch();
    }
  });

  /* ---- scroll progress ---- */
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    $("#scroll-progress").style.width = pct + "%";
  }, { passive: true });

  /* ---- reveal-on-scroll ---- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  $$(".card, .play-card, .mate, .price, .faq, .quote-grid blockquote").forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });

  /* ---- background sound: try now, guarantee on first interaction ---- */
  SoundFX.startMusic(); // works where autoplay allowed
  const unlockAudio = () => SoundFX.startMusic();
  document.addEventListener("pointerdown", unlockAudio, { once: true });
  document.addEventListener("keydown", unlockAudio, { once: true });

  /* ---- welcome ---- */
  setTimeout(() => toast("Welcome to CampusVibes! 🎉", "Psst… click ANYWHERE. A friend is hiding behind every pixel. 📸", ""), 900);
  setTimeout(() => toast("Tip 💡", "13 photo friends live in this site. Meet them all!", ""), 5000);

  console.log("%cCampusVibes%c — fresh build. 13 friends loaded. 📸", "background:#7c3aed;color:#fff;padding:4px 8px;border-radius:6px", "color:#ec4899");
});
