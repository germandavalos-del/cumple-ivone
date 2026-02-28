const $ = (id) => document.getElementById(id);
$("year").textContent = new Date().getFullYear();

// ====== Surprise toggle ======
const surprise = $("surprise");
$("btnSurprise").addEventListener("click", () => {
  const isHidden = surprise.hasAttribute("hidden");
  if (isHidden) {
    surprise.removeAttribute("hidden");
    fireConfetti(180);
    surprise.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    surprise.setAttribute("hidden", "");
  }
});

$("btnAgain").addEventListener("click", () => fireConfetti(180));

// ====== Music (botón) ======
const audio = $("audio");
let musicOn = false;

$("btnMusic").addEventListener("click", async () => {
  musicOn = !musicOn;
  if (musicOn) {
    try {
      await audio.play();
      $("btnMusic").textContent = "Música ⏸";
    } catch (e) {
      // Si el navegador lo bloquea por alguna razón
      musicOn = false;
      $("btnMusic").textContent = "Música ♪";
    }
  } else {
    audio.pause();
    $("btnMusic").textContent = "Música ♪";
  }
});

// ====== Music (primer clic en cualquier parte) ======
document.addEventListener("click", () => {
  if (audio && audio.paused) {
    audio.play().then(() => {
      musicOn = true;
      $("btnMusic").textContent = "Música ⏸";
    }).catch(() => {});
  }
}, { once: true });

// ====== Confetti (canvas) ======
const canvas = $("confetti");
const ctx = canvas.getContext("2d");

function resize(){
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

let particles = [];
let animId = null;

// Paleta sapito (verdes + un dorado suave)
const PALETTE = [
  { h: 140, s: 75, l: 55 },
  { h: 155, s: 70, l: 50 },
  { h: 120, s: 55, l: 55 },
  { h: 50,  s: 80, l: 60 },
];

function fireConfetti(amount = 140){
  particles = particles.concat(makeParticles(amount));
  if (!animId) loop();
}

function makeParticles(n){
  const out = [];
  for (let i=0; i<n; i++){
    const c = PALETTE[Math.floor(Math.random()*PALETTE.length)];
    out.push({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random()*200,
      r: 3 + Math.random()*5,
      vx: -2 + Math.random()*4,
      vy: 2 + Math.random()*5,
      rot: Math.random()*Math.PI,
      vr: -0.2 + Math.random()*0.4,
      life: 260 + Math.random()*120,
      color: `hsl(${c.h} ${c.s}% ${c.l}%)`,
      shape: Math.random() < 0.55 ? "rect" : "circle",
    });
  }
  return out;
}

function loop(){
  ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.03;     // gravedad
    p.rot += p.vr;
    p.life -= 1;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    ctx.fillStyle = p.color;
    if (p.shape === "rect") {
      ctx.fillRect(-p.r, -p.r, p.r*2.2, p.r*1.2);
    } else {
      ctx.beginPath();
      ctx.arc(0,0,p.r,0,Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  });

  particles = particles.filter(p => p.life > 0 && p.y < window.innerHeight + 60);

  if (particles.length > 0){
    animId = requestAnimationFrame(loop);
  } else {
    cancelAnimationFrame(animId);
    animId = null;
    ctx.clearRect(0,0,window.innerWidth, window.innerHeight);
  }
}

// Confeti suave al cargar
setTimeout(() => fireConfetti(80), 550);