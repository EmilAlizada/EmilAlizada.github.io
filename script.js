const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reveal-on-scroll
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((el) => revealObserver.observe(el));
} else {
  revealItems.forEach((el) => el.classList.add('visible'));
}

// Dynamic year
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Mobile navigation
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));
}

// Cursor ambient glow
const glow = document.querySelector('.cursor-glow');
if (glow && !prefersReducedMotion) {
  window.addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

// Scroll progress + active navigation state
const progressBar = document.querySelector('.scroll-progress span');
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];

const updateScrollUI = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;

  const marker = window.scrollY + 190;
  let current = '';
  sections.forEach((section) => {
    if (section.offsetTop <= marker) current = section.id;
  });
  navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
};
window.addEventListener('scroll', updateScrollUI, { passive: true });
window.addEventListener('resize', updateScrollUI, { passive: true });
updateScrollUI();

// Capability switcher
const capabilityData = {
  attack: {
    eyebrow: 'Offensive security',
    title: 'Find the assumptions that break first.',
    description: 'Manual and automated testing focused on web application security, vulnerability discovery, reporting and adversarial thinking.',
    tags: ['Penetration Testing', 'Web App Security', 'Red Teaming', 'Vulnerability Assessment'],
    nodes: [['01','Discover','attack surface'], ['02','Validate','weakness'], ['03','Report','risk clearly']],
    code: '<span>// methodology</span><br>recon → test → verify → report<br><b>status: evidence_first</b>'
  },
  operate: {
    eyebrow: 'DevOps & infrastructure',
    title: 'Make delivery repeatable, visible and resilient.',
    description: 'Practical experience with containers, CI/CD, Infrastructure as Code concepts, monitoring, logging, cloud platforms and Kubernetes.',
    tags: ['Docker', 'CI/CD', 'Infrastructure as Code', 'Kubernetes', 'Monitoring & Logging'],
    nodes: [['01','Package','containerize'], ['02','Deliver','pipeline'], ['03','Observe','runtime']],
    code: '<span>// delivery path</span><br>build → test → deploy → observe<br><b>status: repeatable_systems</b>'
  },
  build: {
    eyebrow: 'Backend engineering',
    title: 'Build the application layer with security in mind.',
    description: 'Backend development experience using Python and Django with PostgreSQL, Git and end-to-end collaboration across a web development lifecycle.',
    tags: ['Python', 'Django', 'PostgreSQL', 'Git', 'Backend Development'],
    nodes: [['01','Model','data'], ['02','Build','logic'], ['03','Ship','service']],
    code: '<span>// application path</span><br>request → logic → data → response<br><b>status: secure_by_design</b>'
  }
};

const capPanel = document.getElementById('cap-panel');
const capTabs = document.querySelectorAll('.cap-tab');
const setCapability = (key) => {
  const data = capabilityData[key];
  if (!data || !capPanel) return;
  document.getElementById('cap-eyebrow').textContent = data.eyebrow;
  document.getElementById('cap-title').textContent = data.title;
  document.getElementById('cap-description').textContent = data.description;
  document.getElementById('cap-tags').innerHTML = data.tags.map((tag) => `<span>${tag}</span>`).join('');
  document.querySelector('.pipeline').innerHTML = data.nodes.map((node, index) => `${index ? '<i></i>' : ''}<div class="node${index === 0 ? ' active' : ''}"><small>${node[0]}</small><b>${node[1]}</b><span>${node[2]}</span></div>`).join('');
  document.getElementById('cap-code').innerHTML = data.code;
  capPanel.classList.remove('switching');
  void capPanel.offsetWidth;
  capPanel.classList.add('switching');
};
capTabs.forEach((tab) => tab.addEventListener('click', () => {
  capTabs.forEach((item) => {
    const active = item === tab;
    item.classList.toggle('active', active);
    item.setAttribute('aria-selected', String(active));
  });
  setCapability(tab.dataset.cap);
}));

// Copy email utility
const copyButton = document.querySelector('.copy-email');
const toast = document.querySelector('.toast');
let toastTimer;
if (copyButton) {
  copyButton.addEventListener('click', async () => {
    const email = copyButton.dataset.email;
    let copied = false;
    try {
      await navigator.clipboard.writeText(email);
      copied = true;
    } catch {
      const temp = document.createElement('textarea');
      temp.value = email;
      temp.style.position = 'fixed';
      temp.style.opacity = '0';
      document.body.appendChild(temp);
      temp.select();
      copied = document.execCommand('copy');
      temp.remove();
    }
    if (copied && toast) {
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
    }
  });
}

// Subtle card tilt on pointer devices
if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateY(${x * 4}deg) rotateX(${y * -4}deg) translateY(-2px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });

  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.06}px, ${y * 0.08}px) translateY(-1px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}
