"use strict";
// Starfield
(() => {
  const c = document.getElementById("stars"),
    x = c.getContext("2d");
  let w,
    h,
    stars = [];
  const init = () => {
    w = c.width = innerWidth;
    h = c.height = innerHeight;
    stars = Array.from({ length: 140 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.3,
      s: Math.random() * 0.15 + 0.02,
    }));
  };
  const draw = () => {
    x.clearRect(0, 0, w, h);
    x.fillStyle = "#fff";
    for (const s of stars) {
      s.y += s.s;
      if (s.y > h) s.y = 0;
      x.globalAlpha = 0.35 + s.r / 3;
      x.beginPath();
      x.arc(s.x, s.y, s.r, 0, 6.283);
      x.fill();
    }
    requestAnimationFrame(draw);
  };
  addEventListener("resize", init);
  init();
  draw();
})();

// Custom cursor
const cur = document.querySelector(".cursor");
addEventListener("mousemove", (e) => {
  cur.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
});

// Scroll reveal
const io = new IntersectionObserver(
  (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Active nav link
const links = [...document.querySelectorAll(".nav a")];
const spy = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting)
        links.forEach((a) =>
          a.classList.toggle(
            "active",
            a.getAttribute("href") === "#" + e.target.id,
          ),
        );
    }),
  { rootMargin: "-45% 0px -50% 0px" },
);
document.querySelectorAll("section[id]").forEach((s) => spy.observe(s));

// Skill filters
document.querySelectorAll(".chip").forEach((btn) =>
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".chip")
      .forEach((b) => b.classList.toggle("active", b === btn));
    const f = btn.dataset.filter;
    document
      .querySelectorAll(".skill")
      .forEach((s) =>
        s.classList.toggle(
          "hide",
          f !== "all" && !s.dataset.cat.split(" ").includes(f),
        ),
      );
  }),
);

// Resume modal
const modal = document.getElementById("resume");
const setModal = (open) => {
  modal.hidden = !open;
};
document
  .getElementById("openResume")
  .addEventListener("click", () => setModal(true));
document
  .getElementById("closeResume")
  .addEventListener("click", () => setModal(false));
modal.addEventListener("click", (e) => {
  if (e.target === modal) setModal(false);
});
addEventListener("keydown", (e) => {
  if (e.key === "Escape") setModal(false);
});

// Contact form (connected with Web3Forms API)
document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target,
    msg = document.getElementById("formMsg");
  const name = f.name.value.trim(),
    email = f.email.value.trim(),
    text = f.message.value.trim();

  if (!name || !text || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    msg.textContent = "Please fill in all fields with a valid email.";
    return;
  }

  msg.textContent = "Sending message...";

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: "YOUR_ACCESS_KEY_HERE",
        name: name,
        email: email,
        message: text,
      }),
    });

    const data = await res.json();
    if (data.success) {
      msg.textContent = "Thanks, " + name + "! Your message has been sent.";
      f.reset();
    } else {
      msg.textContent = "Failed to send message. Please try again.";
    }
  } catch (err) {
    msg.textContent = "Network error. Please check your connection.";
  }
});
