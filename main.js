/* ════════════════════════════════════════════
   PRIVALYS CONSEIL — Shared JavaScript
════════════════════════════════════════════ */

/* ── NAV scroll + mobile ── */
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    revealOnScroll();
  });

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
  }

  // Set active nav link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(l => {
    if (l.getAttribute('href') === path) l.classList.add('active');
  });

  revealOnScroll();
  setTimeout(revealOnScroll, 300);
});

/* ── Scroll reveal ── */
function revealOnScroll() {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight - 60) el.classList.add('up');
  });
}
window.addEventListener('scroll', revealOnScroll);

/* ── Counter animation ── */
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const step = target / 60;
  const interval = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(interval); }
    el.textContent = Math.round(current) + suffix;
  }, 25);
}

function initCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCounter(el, parseFloat(el.dataset.count), el.dataset.suffix || '');
        obs.disconnect();
      }
    });
    obs.observe(el);
  });
}
document.addEventListener('DOMContentLoaded', initCounters);

/* ── FAQ accordion ── */
function toggleFaq(el) {
  const isOpen = el.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) el.classList.add('open');
}

/* ── Smooth particle canvas ── */
function initCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], t = 0;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  function init() {
    nodes = [];
    const count = Math.min(Math.floor(W * H / 14000), 55);
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random()*W, y: Math.random()*H,
        vx: (Math.random()-.5)*.45, vy: (Math.random()-.5)*.35,
        r: Math.random()*2+1, alpha: Math.random()*0.6+0.3
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t++;
    nodes.forEach((n, i) => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      nodes.slice(i+1).forEach(m => {
        const dx = n.x-m.x, dy = n.y-m.y, d = Math.sqrt(dx*dx+dy*dy);
        if (d < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(16,185,129,${(1-d/150)*0.4})`;
          ctx.lineWidth = 0.7;
          ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
        }
      });
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(16,185,129,${n.alpha})`;
      ctx.fill();
    });
    // Flowing pulses
    [0,1,2].forEach(k => {
      const px = ((t*0.8 + k*200) % (W+100)) - 50;
      const py = H*(0.3+k*0.2) + Math.sin(t*0.018+k)*70;
      ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI*2);
      ctx.fillStyle = `rgba(52,211,153,0.85)`; ctx.fill();
      // trail
      ctx.beginPath(); ctx.arc(px-8, py, 1.5, 0, Math.PI*2);
      ctx.fillStyle = `rgba(52,211,153,0.35)`; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  resize(); init(); draw();
  window.addEventListener('resize', () => { resize(); init(); });
}
document.addEventListener('DOMContentLoaded', () => initCanvas('heroCanvas'));

/* ── Quiz logic (index.html only) ── */
let quizAnswers = {}, quizStep = 0;
const quizSteps = ['q1','q2','q3','q4'];

function quizAnswer(q, val) {
  quizAnswers[q] = val;
  document.querySelectorAll(`#${q} .q-opt`).forEach(o => o.classList.remove('sel'));
  event.currentTarget.classList.add('sel');
  const pct = ((quizStep+1)/4)*100;
  document.getElementById('quizBar').style.width = pct + '%';
  setTimeout(quizNext, 380);
}

function quizNext() {
  document.getElementById(quizSteps[quizStep]).classList.remove('active');
  quizStep++;
  if (quizStep < quizSteps.length) {
    document.getElementById(quizSteps[quizStep]).classList.add('active');
  } else {
    showQuizResult();
  }
}

function showQuizResult() {
  document.getElementById('quizSteps').style.display = 'none';
  document.getElementById('quizBar').style.width = '100%';
  document.getElementById('quizResult').classList.add('show');
  const d=quizAnswers.q1, ai=quizAnswers.q2, f=quizAnswers.q3;
  const packs = {
    'oui-oui-oui':  { name:"L'Expertise 360°", tag:"Trio complet", icon:"🏆", price:"À partir de 2 490 € HT", desc:"Votre situation nécessite une mise en conformité totale. L'Expertise 360° couvre RGPD, IA Act et formation de vos équipes en une seule intervention intégrée.", items:["Audit RGPD complet","Audit IA Act + Shadow IA","Documentation unifiée","2 ateliers de formation","Attestations certifiantes"] },
    'oui-oui-non':  { name:"Sérénité Numérique", tag:"Duo RGPD + IA Act", icon:"⭐", price:"À partir de 1 690 € HT", desc:"Vous traitez des données et utilisez l'IA — les deux risques doivent être traités ensemble pour une conformité sans angle mort.", items:["Audit RGPD complet","Audit IA Act + Shadow IA","Politique de confidentialité unifiée","Charte d'utilisation IA","Contrats sous-traitance IA"] },
    'oui-non-oui':  { name:"Conformité Totale", tag:"Duo RGPD + Formation", icon:"🛡️", price:"À partir de 1 590 € HT", desc:"Sécurisez vos données personnelles et formez vos équipes simultanément. La protection documentaire ET humaine.", items:["Audit RGPD complet","Rédaction des documents manquants","Atelier formation RGPD (2h)","Attestations individuelles"] },
    'non-oui-oui':  { name:"Propulsion Sécurisée", tag:"Duo IA + Formation", icon:"🚀", price:"À partir de 1 490 € HT", desc:"Auditez vos outils IA et formez immédiatement vos équipes. L'enchaînement logique pour maîtriser l'IA durablement.", items:["Inventaire Shadow IA","Classification risques IA Act","Charte IA interne","Atelier formation IA (2h)","Attestations individuelles"] },
    'oui-non-non':  { name:"Héritage RGPD", tag:"Pack Solo", icon:"📋", price:"À partir de 990 € HT", desc:"Votre priorité : la conformité RGPD. Diagnostic exhaustif de vos traitements de données et mise en conformité documentaire complète.", items:["Audit Registre RoPA","Mentions légales & CGU","Cookies & consentement","Contrats sous-traitance","Plan de mise en conformité"] },
    'non-oui-non':  { name:"IA Guardian", tag:"Pack Solo", icon:"🤖", price:"À partir de 890 € HT", desc:"L'IA Act vous concerne. Inventaire de vos usages IA, classification des risques et charte interne pour sécuriser vos pratiques.", items:["Inventaire Shadow IA","Classification IA Act","Audit flux de données","Charte d'utilisation IA","Rapport conformité IA Act"] },
    'non-non-oui':  { name:"Academy Formation", tag:"Pack Solo", icon:"🎓", price:"À partir de 690 € HT", desc:"La formation, c'est votre première ligne de défense. Vos équipes formées constituent une preuve de diligence légale devant la CNIL.", items:["Atelier 2h (RGPD ou IA Act)","Support de formation personnalisé","Quiz de validation","Attestations individuelles certifiantes"] },
    'non-non-non':  { name:"Consultation Offerte", tag:"Diagnostic gratuit", icon:"💡", price:"30 min offertes — sans engagement", desc:"Votre situation mérite une analyse personnalisée. Parlons-nous pour identifier vos vrais risques et la solution adaptée.", items:["Échange téléphonique 30 min","Analyse de votre situation","Recommandation personnalisée","Devis sans engagement"] }
  };
  const key = `${d}-${ai}-${f}`;
  const p = packs[key] || packs['non-non-non'];
  document.getElementById('resIcon').textContent = p.icon;
  document.getElementById('resName').textContent = p.name;
  document.getElementById('resTag').textContent = p.tag;
  document.getElementById('resDesc').textContent = p.desc;
  document.getElementById('resPrice').textContent = p.price;
  const ul = document.getElementById('resList');
  ul.innerHTML = p.items.map(i => `<li>${i}</li>`).join('');
}

function resetQuiz() {
  quizAnswers = {}; quizStep = 0;
  document.getElementById('quizResult').classList.remove('show');
  document.getElementById('quizSteps').style.display = 'block';
  document.getElementById('quizBar').style.width = '0%';
  quizSteps.forEach((s,i) => {
    const el = document.getElementById(s);
    el.classList.toggle('active', i === 0);
    el.querySelectorAll('.q-opt').forEach(o => o.classList.remove('sel'));
  });
}

/* ── Contact form ── */
function submitContact(e) {
  e.preventDefault();
  const form = e.target;
  const d = Object.fromEntries(new FormData(form).entries());
  const subject = encodeURIComponent('Demande de devis — Privalys Conseil');
  const body = encodeURIComponent([
    `Nouvelle demande depuis privalys-conseil.fr`,``,
    `Prénom / Nom : ${d.prenom} ${d.nom}`,
    `Email : ${d.email}`,
    `Téléphone : ${d.tel || 'Non renseigné'}`,
    `Entreprise : ${d.entreprise}`,
    `Effectif : ${d.effectif || 'Non précisé'}`,
    `Pack souhaité : ${d.pack || 'À définir'}`,
    `Objet de la demande : ${d.objet || 'Non précisé'}`,``,
    `Message :`,d.message || 'Aucun message'
  ].join('\n'));
  window.location.href = `mailto:privalys.conseil@gmail.com?subject=${subject}&body=${body}`;
  form.style.display = 'none';
  document.getElementById('formSuccess').style.display = 'flex';
}
