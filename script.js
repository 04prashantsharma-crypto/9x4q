// ✏️ EDIT THIS SECTION
const CONFIG = {
  // Her choices are sent to this email.
  email: "04prashantsharma@gmail.com",
  // OPTIONAL (recommended): free access key from web3forms.com (sign up with the email above).
  // With a key, the email is sent automatically in the background when she taps the button.
  // Leave "" to fall back to opening her mail app with the message pre-filled.
  web3formsKey: "",
  where: "Video call 📞 (I'll send the link)",
  movies: [
    { name: "10 Things I Hate About You", note: "classic rom-com chaos" },
    { name: "Crazy, Stupid, Love", note: "for the dramatic romantic in you" },
    { name: "Anyone But You", note: "enemies to lovers, obviously" }
  ],
  times: ["Friday, 8:00 PM", "Saturday, 8:00 PM", "Sunday, 7:30 PM"]
};

const card = document.getElementById("card");
const toast = document.getElementById("toast");
const pick = { movie: "", snacks: [], time: "" };
const SNACKS = ["🍊 Tangerines", "🍿 Popcorn", "🥭 Maaza", "🍫 Chocolate"];

// floating tangerines & hearts
(function () {
  const box = document.getElementById("floating");
  const sym = ["🍊", "🍊", "💗", "🍿", "🍊", "🎬", "💕"];
  for (let i = 0; i < 16; i++) {
    const el = document.createElement("span");
    el.className = "fl";
    el.textContent = sym[i % sym.length];
    el.style.left = (i * 6.4 + 2) + "%";
    el.style.fontSize = (20 + (i % 4) * 8) + "px";
    el.style.opacity = 0.4 + (i % 3) * 0.15;
    el.style.animationDuration = (12 + (i % 5) * 3) + "s";
    el.style.animationDelay = -(i * 1.6) + "s";
    box.appendChild(el);
  }
})();

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => toast.classList.remove("show"), 2000);
}

function burst() {
  const sym = ["🍊", "💗", "🎬", "🍿", "✨", "🥭"];
  for (let i = 0; i < 44; i++) {
    const el = document.createElement("div");
    el.className = "confetti";
    el.textContent = sym[i % sym.length];
    el.style.left = Math.random() * 100 + "vw";
    el.style.fontSize = 14 + Math.random() * 16 + "px";
    el.style.animationDelay = Math.random() * 0.5 + "s";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2400);
  }
}

function render(emoji, heading, text, step) {
  card.style.animation = "none"; void card.offsetWidth; card.style.animation = "";
  const dots = [0, 1, 2, 3].map(i => `<span class="dot ${i === step ? "on" : ""}"></span>`).join("");
  card.innerHTML = `<div class="emoji">${emoji}</div><h1>${heading}</h1><p>${text}</p><div id="body"></div><div class="dots">${dots}</div>`;
  return document.getElementById("body");
}

// Screen 1: the question (the "No" button runs away)
function ask() {
  const body = render("🍊", "Suhan, very important question…",
    "Will you go on a movie date with me? Online, but I promise I'll still show up with snacks and full main-character energy. 🎬", 0);
  body.innerHTML = `<div class="row" id="row">
    <button class="btn yes" id="yes">Yes 💗</button>
    <button class="btn no" id="no">No 🙈</button></div>`;
  const yes = document.getElementById("yes"), no = document.getElementById("no");
  const labels = ["No 🙈", "Are you sure? 🥺", "Really?? 😭", "Think again 🍊", "Last chance 🥹", "Okay fine… Yes 💗"];
  let tries = 0;
  const dodge = () => {
    tries++;
    no.textContent = labels[Math.min(tries, labels.length - 1)];
    yes.style.transform = `scale(${Math.min(1 + tries * 0.12, 1.7)})`;
    if (tries >= labels.length - 1) {
      no.className = "btn yes"; no.style.transform = ""; no.onclick = movie; return;
    }
    const x = (Math.random() - 0.5) * 220, y = (Math.random() - 0.5) * 90;
    no.style.transform = `translate(${x}px, ${y}px)`;
  };
  no.addEventListener("pointerenter", dodge);
  no.addEventListener("click", dodge);
  yes.addEventListener("click", () => { burst(); movie(); });
}

// Screen 2: movie
function movie() {
  const body = render("🎬", "Yayyy!! Okay, pick tonight's movie",
    "I only have good taste, so you can't go wrong. 😌", 1);
  body.innerHTML = `<div class="choices">${CONFIG.movies.map((m, i) =>
    `<button class="choice" data-i="${i}">${m.name}<small>${m.note}</small></button>`).join("")}
    <button class="choice" data-i="-1">Surprise me 🎁<small>I trust you, Prashant</small></button></div>`;
  body.querySelectorAll(".choice").forEach(b => b.addEventListener("click", () => {
    const i = +b.dataset.i; pick.movie = i < 0 ? "Surprise me 🎁" : CONFIG.movies[i].name; snacks();
  }));
}

// Screen 3: snacks
function snacks() {
  const body = render("🍿", "Snack situation",
    "Tap everything that must be on the table. (Maaza is non-negotiable, I already know.)", 2);
  pick.snacks = [];
  body.innerHTML = `<div class="chips">${SNACKS.map(s => `<button class="chip">${s}</button>`).join("")}</div>
    <button class="btn yes" id="next">Next 💗</button>`;
  body.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => {
    c.classList.toggle("on");
    pick.snacks = [...body.querySelectorAll(".chip.on")].map(x => x.textContent);
  }));
  document.getElementById("next").addEventListener("click", () => {
    if (!pick.snacks.length) return showToast("Pick at least one snack 🍊");
    time();
  });
}

// Screen 4: time
function time() {
  const body = render("🕗", "When should the lights go down?",
    "Pick a time and I'll clear my whole schedule. Dramatically. 💫", 3);
  body.innerHTML = `<div class="choices">${CONFIG.times.map(t => `<button class="choice">${t}</button>`).join("")}</div>`;
  body.querySelectorAll(".choice").forEach(b => b.addEventListener("click", () => { pick.time = b.textContent; ticket(); }));
}

// Final: ticket + send reply
function ticket() {
  const body = render("🎟️", "It's a date! 🍊💗",
    "Your ticket is ready. Just one more tap so I know you're in.", 3);
  body.innerHTML = `<div class="ticket">
      <div class="tt">🎬 ADMIT ONE (+ one lucky boy)</div>
      <div><span>Movie:</span> ${pick.movie}</div>
      <div><span>Snacks:</span> ${pick.snacks.join(", ")}</div>
      <div><span>When:</span> ${pick.time}</div>
      <div><span>Where:</span> ${CONFIG.where}</div>
    </div>
    <button class="btn yes" id="send">Send my reply to Prashant 💌</button>`;
  burst();
  document.getElementById("send").addEventListener("click", send);
}

async function send() {
  const subject = "Suhan said YES 🍊🎬";
  const msg = `Hey Prashant, I'm in! 🍊🎬\nMovie: ${pick.movie}\nSnacks: ${pick.snacks.join(", ")}\nWhen: ${pick.time}\nDon't be late 😌💗`;
  let auto = false;
  if (CONFIG.web3formsKey) {
    try {
      const r = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: CONFIG.web3formsKey, subject, from_name: "Suhan 🍊", message: msg })
      });
      auto = (await r.json()).success === true;
    } catch (e) { auto = false; }
  }
  if (!auto) {
    window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`;
    showToast("Tap Send in your mail app so Prashant gets it 💌");
  }
  burst();
  const body = render("🥹", "See you soon, Suhan 💗",
    "When life gives you tangerines, I'd like to share them with you. See you at the movies. 🍊", 3);
  body.innerHTML = `<button class="btn no" id="again">Change my picks</button>`;
  document.getElementById("again").addEventListener("click", movie);
}

ask();
