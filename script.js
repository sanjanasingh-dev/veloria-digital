// Cursor
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
});
function animFollower() {
  fx += (mx - fx) * 0.12; fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px'; follower.style.top = fy + 'px';
  requestAnimationFrame(animFollower);
}
animFollower();

// Navbar
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));

// Hamburger
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if(hamburger) hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', () => mobileMenu.classList.remove('open')));

// Fade up
const faders = document.querySelectorAll('.fade-up');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting) {
      const d = parseInt(e.target.dataset.delay) || 0;
      setTimeout(() => e.target.classList.add('visible'), d);
    }
  });
}, {threshold: 0.1});
faders.forEach(el => obs.observe(el));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if(href.startsWith('#')) {
      e.preventDefault();
      const t = document.querySelector(href);
      if(t) t.scrollIntoView({behavior: 'smooth'});
    }
  });
});


// Draggable stickers (mouse + touch)
(function(){
  const hero = document.querySelector('.hero');
  if(!hero) return;
  let z = 5;
  document.querySelectorAll('.sticker').forEach(el => {
    let sx = 0, sy = 0, ox = 0, oy = 0, dragging = false;
    el.addEventListener('pointerdown', e => {
      dragging = true;
      el.setPointerCapture(e.pointerId);
      ox = el.offsetLeft; oy = el.offsetTop;
      el.style.left = ox + 'px'; el.style.top = oy + 'px';
      el.style.right = 'auto'; el.style.bottom = 'auto';
      sx = e.clientX; sy = e.clientY;
      el.classList.add('dragging');
      el.style.zIndex = ++z;
    });
    el.addEventListener('pointermove', e => {
      if(!dragging) return;
      let nx = ox + (e.clientX - sx), ny = oy + (e.clientY - sy);
      nx = Math.max(0, Math.min(nx, hero.clientWidth - el.offsetWidth));
      ny = Math.max(0, Math.min(ny, hero.clientHeight - el.offsetHeight));
      el.style.left = nx + 'px'; el.style.top = ny + 'px';
    });
    const end = () => { dragging = false; el.classList.remove('dragging'); };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
  });
})();

// Tiny celebration: click the hero logo
(function(){
  const logo = document.querySelector('.hero-logo-big');
  if(!logo || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#c9a84c', '#8b1a1a', '#f5ede8', '#dfc06a', '#a02020'];
  logo.addEventListener('click', () => {
    const r = logo.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for(let i = 0; i < 36; i++){
      const c = document.createElement('span');
      c.className = 'confetti';
      c.style.left = cx + 'px'; c.style.top = cy + 'px';
      c.style.background = colors[i % colors.length];
      const a = Math.random() * Math.PI * 2, d = 90 + Math.random() * 160;
      c.style.setProperty('--dx', Math.cos(a) * d + 'px');
      c.style.setProperty('--dy', (Math.sin(a) * d + 60) + 'px');
      c.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 1100);
    }
  });
})();

// Friendly tab title
(function(){
  const base = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? 'Come back, we saved your spot ✦' : base;
  });
})();


// ===== Start a Project: 4-step popup, ends on WhatsApp =====
(function(){
  const WA = '919229293302';
  const PACKAGES = [
    {v:'Starter Website — ₹5,999',  t:'Starter Website',  s:'₹5,999 · up to 4 pages'},
    {v:'Business Website — ₹9,999', t:'Business Website', s:'₹9,999 · up to 6 pages'},
    {v:'Premium Website — ₹19,999', t:'Premium Website',  s:'₹19,999 · up to 8 pages'},
    {v:'Not sure yet',              t:'Not sure yet',     s:'Help me choose'}
  ];
  const TIMELINES = ['As soon as possible', 'Within 2–3 weeks', 'Within a month', 'Just exploring for now'];
  const blank = () => ({pkg:'', biz:'', about:'', timeline:'', name:'', phone:'', email:''});
  let state = blank(), step = 0, lastFocus = null, finished = false;

  const overlay = document.createElement('div');
  overlay.className = 'pj-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="pj-panel" role="dialog" aria-modal="true" aria-labelledby="pjTitle" tabindex="-1">
      <button type="button" class="pj-close" aria-label="Close">✕</button>
      <div class="pj-progress"><div class="pj-bar"></div></div>
      <p class="pj-step-label"></p>
      <div class="pj-body"></div>
      <p class="pj-error" role="alert"></p>
      <div class="pj-actions">
        <button type="button" class="btn-ghost pj-back">← Back</button>
        <button type="button" class="btn-primary pj-next">Next →</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const $ = s => overlay.querySelector(s);
  const panel = $('.pj-panel'), body = $('.pj-body'), errEl = $('.pj-error'), nextBtn = $('.pj-next'),
        backBtn = $('.pj-back'), bar = $('.pj-bar'), label = $('.pj-step-label'), actions = $('.pj-actions');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  function opts(list, key){
    return '<div class="pj-opts">' + list.map(o => {
      const v = o.v || o, t = o.t || o, s = o.s || '';
      return '<button type="button" class="pj-opt' + (state[key] === v ? ' selected' : '') + '" data-key="' + key + '" data-v="' + esc(v) + '">' +
             esc(t) + (s ? '<small>' + esc(s) + '</small>' : '') + '</button>';
    }).join('') + '</div>';
  }

  const STEPS = [
    () => '<h3 class="pj-title" id="pjTitle">What do you <em>need?</em></h3><p class="pj-sub">Pick a package. You can change your mind later.</p>' + opts(PACKAGES, 'pkg'),
    () => '<h3 class="pj-title" id="pjTitle">Tell us about <em>your business</em></h3><p class="pj-sub">A line or two is plenty.</p><div class="pj-fields">' +
          '<input class="form-input" data-key="biz" placeholder="Business or brand name" autocomplete="organization" value="' + esc(state.biz) + '"/>' +
          '<textarea class="form-input form-textarea" data-key="about" placeholder="What do you do? Who are your customers? (optional)">' + esc(state.about) + '</textarea></div>',
    () => '<h3 class="pj-title" id="pjTitle">When do you <em>need it?</em></h3><p class="pj-sub">Just a rough idea helps us plan.</p>' + opts(TIMELINES, 'timeline'),
    () => '<h3 class="pj-title" id="pjTitle">How do we <em>reach you?</em></h3><p class="pj-sub">WhatsApp is the fastest. We reply within 24 hours.</p><div class="pj-fields">' +
          '<input class="form-input" data-key="name" placeholder="Your name" autocomplete="name" value="' + esc(state.name) + '"/>' +
          '<input class="form-input" data-key="phone" type="tel" placeholder="WhatsApp number" autocomplete="tel" value="' + esc(state.phone) + '"/>' +
          '<input class="form-input" data-key="email" type="email" placeholder="Email (optional)" autocomplete="email" value="' + esc(state.email) + '"/></div>'
  ];

  function render(){
    finished = false;
    actions.style.display = 'flex';
    body.innerHTML = STEPS[step]();
    label.textContent = 'Step ' + (step + 1) + ' of 4';
    bar.style.width = ((step + 1) * 25) + '%';
    backBtn.style.visibility = step === 0 ? 'hidden' : 'visible';
    nextBtn.textContent = step === 3 ? 'Send on WhatsApp' : 'Next →';
    errEl.textContent = '';
    const first = body.querySelector('input, textarea');
    if(first) setTimeout(() => first.focus(), 60);
  }

  function validate(){
    if(step === 0 && !state.pkg) return 'Please pick a package, or choose "Not sure yet".';
    if(step === 1 && !state.biz.trim()) return 'Please tell us your business or brand name.';
    if(step === 2 && !state.timeline) return 'Please pick a timeline.';
    if(step === 3){
      if(!state.name.trim()) return 'Please enter your name.';
      if(state.phone.replace(/\D/g, '').length < 10) return 'Please enter a valid WhatsApp number.';
      if(state.email.trim() && !/^\S+@\S+\.\S+$/.test(state.email.trim())) return 'That email address does not look right.';
    }
    return '';
  }

  function submit(){
    const lines = [
      "Hi Veloria Digital! I'd like to start a project.", '',
      'Package: ' + state.pkg,
      'Business: ' + state.biz.trim(),
      state.about.trim() ? 'About: ' + state.about.trim() : null,
      'Timeline: ' + state.timeline,
      'Name: ' + state.name.trim(),
      state.email.trim() ? 'Email: ' + state.email.trim() : null
    ].filter(x => x !== null);
    const link = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(lines.join('\n'));

    // Also save a copy in Netlify Forms (silently ignored if unavailable, e.g. when opened from a local file)
    try {
      fetch('/', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: new URLSearchParams({
          'form-name': 'start-project', package: state.pkg, business: state.biz.trim(), about: state.about.trim(),
          timeline: state.timeline, name: state.name.trim(), whatsapp: state.phone.trim(), email: state.email.trim()
        }).toString()
      }).catch(() => {});
    } catch(e) {}

    finished = true;
    actions.style.display = 'none';
    label.textContent = 'All done';
    bar.style.width = '100%';
    errEl.textContent = '';
    body.innerHTML = '<div class="pj-done"><h3 class="pj-title" id="pjTitle">You are all <em>set ✦</em></h3>' +
      '<p class="pj-sub">WhatsApp should have opened with your message ready. Just press send. If it did not open, use the button below.</p>' +
      '<div class="pj-actions"><a class="btn-whatsapp" href="' + link + '" target="_blank" rel="noopener">Open WhatsApp</a>' +
      '<button type="button" class="btn-ghost pj-finish">Close</button></div></div>';
    window.open(link, '_blank', 'noopener');
  }

  function open(pkg){
    lastFocus = document.activeElement;
    state = blank();
    step = 0;
    if(pkg){ state.pkg = pkg; step = 1; }
    render();
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('pj-lock');
    if(!body.querySelector('input, textarea')) panel.focus();
  }
  function close(){
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('pj-lock');
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }

  nextBtn.addEventListener('click', () => {
    const err = validate();
    if(err){ errEl.textContent = err; return; }
    if(step < 3){ step++; render(); } else { submit(); }
  });
  backBtn.addEventListener('click', () => { if(step > 0){ step--; render(); } });
  $('.pj-close').addEventListener('click', close);
  overlay.addEventListener('click', e => { if(e.target === overlay) close(); });
  body.addEventListener('click', e => {
    if(e.target.closest('.pj-finish')){ close(); return; }
    const o = e.target.closest('.pj-opt');
    if(!o) return;
    state[o.dataset.key] = o.dataset.v;
    body.querySelectorAll('.pj-opt').forEach(b => b.classList.toggle('selected', b === o));
    errEl.textContent = '';
  });
  body.addEventListener('input', e => {
    const k = e.target.dataset && e.target.dataset.key;
    if(k){ state[k] = e.target.value; errEl.textContent = ''; }
  });
  overlay.addEventListener('keydown', e => {
    if(e.key === 'Escape'){ close(); return; }
    if(e.key === 'Enter' && e.target.tagName === 'INPUT' && !finished){ e.preventDefault(); nextBtn.click(); return; }
    if(e.key !== 'Tab') return;
    const f = [...overlay.querySelectorAll('button, input, textarea, a[href]')].filter(el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden');
    if(!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  });
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-start-project]');
    if(!t) return;
    e.preventDefault();
    open(t.dataset.package);
  });
  window.openStartProject = open;
})();
