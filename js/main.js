/* ═══════════════════════════════════════════════════════════
   CAD Automator – main.js
   ═══════════════════════════════════════════════════════════ */

/* ── Cursor Glow ─────────────────────────────────────────── */
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', function(e) {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});

/* ── Particle Canvas ─────────────────────────────────────── */
(function() {
  var canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H, particles = [];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  for (var i = 0; i < 60; i++) {
    particles.push({ x: Math.random() * 1600, y: Math.random() * 900,
      r: Math.random() * 1.2 + 0.3, vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3, alpha: Math.random() * 0.4 + 0.1 });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,212,255,' + p.alpha + ')'; ctx.fill();
    }
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (d < 90) {
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(0,212,255,' + (0.06 * (1 - d / 90)) + ')';
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── Navbar ──────────────────────────────────────────────── */
var navbar    = document.getElementById('navbar');
var hamburger = document.getElementById('hamburger');
var mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', function() {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});
hamburger.addEventListener('click', function() {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(function(a) {
  a.addEventListener('click', function() { mobileMenu.classList.remove('open'); });
});

/* ── Counter Animation ───────────────────────────────────── */
function animateCount(el) {
  var target = parseInt(el.dataset.count);
  var inc = target / (1800 / 16);
  var cur = 0;
  var t = setInterval(function() {
    cur = Math.min(cur + inc, target);
    el.textContent = Math.floor(cur).toLocaleString();
    if (cur >= target) clearInterval(t);
  }, 16);
}

/* ── Reveal on Scroll ────────────────────────────────────── */
var revealObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(function(el) { revealObs.observe(el); });

/* Counter */
var heroProof = document.querySelector('.hero-proof');
if (heroProof) {
  new IntersectionObserver(function(entries) {
    if (!entries[0].isIntersecting) return;
    heroProof.querySelectorAll('.proof-num').forEach(animateCount);
  }, { threshold: 0.5 }).observe(heroProof);
}

/* Skill bars */
var becomeGrid = document.querySelector('.become-grid');
if (becomeGrid) {
  new IntersectionObserver(function(entries) {
    if (!entries[0].isIntersecting) return;
    entries[0].target.querySelectorAll('.bc-bar').forEach(function(bar) {
      var w = bar.getAttribute('style').match(/--w:([\d.%]+)/);
      if (w) bar.style.width = w[1];
    });
  }, { threshold: 0.3 }).observe(becomeGrid);
}

/* ── Code Explainer Cycle ────────────────────────────────── */
(function() {
  var lines = document.querySelectorAll('.ce-line');
  if (!lines.length) return;
  var current = 0;
  setInterval(function() {
    lines[current].classList.remove('active');
    current = (current + 1) % lines.length;
    lines[current].classList.add('active');
  }, 1400);
})();

/* ══════════════════════════════════════════════════════════
   DEMO SECTION — All functions declared as named functions
   so they are hoisted and accessible from inline onchange/onclick
   ══════════════════════════════════════════════════════════ */

/* ── Tab Switcher ────────────────────────────────────────── */
document.querySelectorAll('.demo-tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.demo-tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.demo-panel').forEach(function(p) { p.classList.remove('active'); });
    tab.classList.add('active');
    var panel = document.getElementById('demo-' + tab.dataset.demo);
    if (panel) panel.classList.add('active');
    if (tab.dataset.demo === 'skid')    _doSkidDemo();
    if (tab.dataset.demo === 'iprop')   _doIPropDemo();
    if (tab.dataset.demo === 'feature') runFeatureDemo();
  });
});

/* ── Run button animation helper ────────────────────────── */
function animateRunBtn(btn, callback) {
  if (!btn) { callback(); return; }
  var orig = btn.innerHTML;
  btn.innerHTML = '⏳ Running…';
  btn.disabled = true;
  btn.style.opacity = '0.7';
  setTimeout(function() {
    callback();
    btn.innerHTML = '✅ Rule Applied!';
    btn.style.opacity = '1';
    setTimeout(function() {
      btn.innerHTML = orig;
      btn.disabled = false;
    }, 1200);
  }, 500);
}

/* ── TAB 1 : Skid Frame Configurator ────────────────────── */
function runSkidDemo(btn) {
  if (btn) { animateRunBtn(btn, _doSkidDemo); return; }
  _doSkidDemo();
}
function _doSkidDemo() {
  var lenSel  = document.getElementById('sLength');
  var matSel  = document.getElementById('sMat');
  var loadSel = document.getElementById('sLoad');
  if (!lenSel || !matSel || !loadSel) return;

  var len  = parseInt(lenSel.value);   // 3, 4 or 6
  var mat  = matSel.value;             // 'CS' or 'SS'
  var load = parseInt(loadSel.value);  // 5, 10 or 20

  var beams = {
    5:  { 3: '150×75×6 RHS',   4: '150×75×6 RHS',   6: '200×100×6 RHS'  },
    10: { 3: '150×75×8 RHS',   4: '200×100×8 RHS',  6: '250×150×8 RHS'  },
    20: { 3: '200×100×10 RHS', 4: '250×150×10 RHS', 6: '300×200×12 RHS' }
  };
  var crosses = {
    5:  { 3: '100×50×5 RHS', 4: '100×50×5 RHS', 6: '150×75×5 RHS' },
    10: { 3: '100×50×6 RHS', 4: '150×75×6 RHS', 6: '150×75×8 RHS' },
    20: { 3: '150×75×8 RHS', 4: '150×75×8 RHS', 6: '200×100×8 RHS'}
  };
  var spacings = { 3: '750',  4: '1000', 6: '1200' };
  var weights  = {
    5:  { 3: 210, 4: 280,  6: 480  },
    10: { 3: 320, 4: 486,  6: 820  },
    20: { 3: 510, 4: 780,  6: 1340 }
  };
  var welds = {
    5:  'E6013 · 6mm fillet',
    10: 'E7018 · 8mm fillet',
    20: 'E7018-1 · 10mm fillet'
  };

  var beam    = beams[load][len];
  var cross   = crosses[load][len];
  var spacing = spacings[len];
  var weight  = weights[load][len] * (mat === 'SS' ? 1.04 : 1);
  var weld    = welds[load];
  var matLbl  = mat === 'SS' ? 'SS316L' : 'S275JR';
  var bH = beam.split('×')[0];
  var bW = beam.split('×')[1];

  setText('sBeam',    beam);
  setText('sCross',   cross);
  setText('sSpacing', spacing + ' mm');
  setText('sWeight',  Math.round(weight) + ' kg');
  setText('sWeld',    weld);

  var label = document.getElementById('skidLenLabel');
  if (label) label.textContent = 'L = ' + (len * 1000) + ' mm  ·  ' + matLbl + '  ·  ' + load + 'T';

  var code = document.getElementById('skidCode');
  if (code) code.innerHTML =
    '<code>' +
    '<span class="kw">If</span> Parameter(<span class="str">"LoadRating"</span>) = <span class="num">' + load + '</span> ' +
    '<span class="kw">And</span> FrameLength = <span class="num">' + (len * 1000) + '</span> <span class="kw">Then</span>\n' +
    '  Parameter(<span class="str">"MainBeam_H"</span>)      = <span class="num">' + bH + '</span>\n' +
    '  Parameter(<span class="str">"MainBeam_W"</span>)      = <span class="num">' + bW + '</span>\n' +
    '  Parameter(<span class="str">"XMember_Spacing"</span>) = <span class="num">' + spacing + '</span>\n' +
    '<span class="kw">End If</span>\n' +
    'iLogicVb.UpdateWhenDone = <span class="kw">True</span>' +
    '</code>';
}

/* ── TAB 2 : Skid Frame BOM ──────────────────────────────── */
var bomParts = [
  { name: 'MainBeam',       qty: 2,  mat: 'Carbon Steel S275'   },
  { name: 'CrossMember',    qty: 4,  mat: 'Carbon Steel S275'   },
  { name: 'MountingPlate',  qty: 4,  mat: 'Mild Steel S235'     },
  { name: 'Gusset',         qty: 8,  mat: 'Mild Steel S235'     },
  { name: 'LiftingLug',     qty: 4,  mat: 'Carbon Steel S275'   },
  { name: 'AnchorBolt',     qty: 16, mat: 'Galv. Steel Gr. 8.8' },
  { name: 'DrainNozzle',    qty: 1,  mat: 'Stainless Steel 316' },
  { name: 'HandrailPost',   qty: 6,  mat: 'Carbon Steel S275'   }
];

function runBomDemo() {
  var tbody = document.getElementById('bomBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  bomParts.forEach(function(row, i) {
    setTimeout(function() {
      var tr = document.createElement('tr');
      tr.className = 'bom-row-anim';
      tr.innerHTML = '<td>' + (i + 1) + '</td><td>' + row.name + '</td><td>' + row.qty +
        '</td><td>' + row.mat + '</td><td class="bom-status">&#10003; iProperties read</td>';
      tbody.appendChild(tr);
    }, i * 160);
  });
}

function clearBom() {
  var tbody = document.getElementById('bomBody');
  if (tbody) tbody.innerHTML = '<tr class="bom-empty"><td colspan="5">Click "Run BOM Rule" to auto-populate…</td></tr>';
}

/* ── TAB 3 : iProperties Auto-Fill ──────────────────────── */
function runIPropDemo(btn) {
  if (btn) { animateRunBtn(btn, _doIPropDemo); return; }
  _doIPropDemo();
}
function _doIPropDemo() {
  var projNo   = val('iProjNo')   || 'SKD-2026-041';
  var partName = val('iPartName') || 'Main Beam';
  var rev      = val('iRev')      || 'Rev A';
  var mat      = val('iMat')      || 'Carbon Steel S275';

  var suffixes = { 'Main Beam': 'MB', 'Cross Member': 'XM', 'Mounting Plate': 'MP', 'Gusset': 'GS', 'Lifting Lug': 'LL' };
  var sfx = suffixes[partName] || partName.replace(/[^A-Z]/g, '').slice(0, 2) || 'PT';

  var masses   = { 'Main Beam': '87.4', 'Cross Member': '34.2', 'Mounting Plate': '12.8', 'Gusset': '3.6', 'Lifting Lug': '8.1' };
  var mass = masses[partName] || '24.0';

  var rows = [
    ['Summary', 'Part Number',  projNo + '-' + sfx,     'ip-auto', '&#10003; Auto'],
    ['Summary', 'Description',  partName + ' — ' + mat, 'ip-auto', '&#10003; Auto'],
    ['Project', 'Revision',     rev,                    'ip-auto', '&#10003; Auto'],
    ['Project', 'Designer',     'iLogic Rule',          'ip-auto', '&#10003; Auto'],
    ['Physical','Mass',         mass + ' kg',           'ip-read', '&#8856; Read-Only'],
    ['Custom',  'Material',     mat,                    'ip-auto', '&#10003; Auto']
  ];

  var grid = document.getElementById('ipropGrid');
  if (!grid) return;
  grid.innerHTML = rows.map(function(r) {
    return '<div class="ip-row">' +
      '<span class="ip-tab">'   + r[0] + '</span>' +
      '<span class="ip-field">' + r[1] + '</span>' +
      '<strong class="ip-val">' + r[2] + '</strong>' +
      '<span class="' + r[3] + '">' + r[4] + '</span>' +
      '</div>';
  }).join('');

  var code = document.getElementById('ipropCode');
  if (code) code.innerHTML =
    '<code>' +
    'iProperties.Value(<span class="str">"Summary"</span>, <span class="str">"Part Number"</span>) =\n' +
    '  ProjNo &amp; <span class="str">"-' + sfx + '"</span>\n' +
    'iProperties.Value(<span class="str">"Summary"</span>, <span class="str">"Description"</span>) =\n' +
    '  PartName &amp; <span class="str">" — "</span> &amp; Material\n' +
    'iProperties.Value(<span class="str">"Project"</span>, <span class="str">"Revision"</span>) = <span class="str">"' + rev + '"</span>' +
    '</code>';
}

/* ── TAB 4 : Feature Toggle ──────────────────────────────── */
var ftList = [
  { id: 'ftLift',   name: 'LiftingLug_Feature',   label: 'Lifting Lugs',   icon: '&#128297;' },
  { id: 'ftDrain',  name: 'DrainNozzle_Feature',  label: 'Drain Nozzle',   icon: '&#128703;' },
  { id: 'ftGusset', name: 'Gusset_Extrude',       label: 'Gusset Plates',  icon: '&#128737;' },
  { id: 'ftRail',   name: 'HandrailPost_Pattern',  label: 'Handrail Posts', icon: '&#128682;' }
];

function runFeatureDemo() {
  var list = document.getElementById('featureStateList');
  var code = document.getElementById('featCode');
  if (!list) return;

  var states = ftList.map(function(f) {
    var el = document.getElementById(f.id);
    return { name: f.name, icon: f.icon, label: f.label, active: el ? el.checked : true };
  });

  list.innerHTML = states.map(function(f) {
    var cls   = f.active ? 'fs-active' : 'fs-suppressed';
    var label = f.active ? '&#9679; Active' : '&#9675; Suppressed';
    return '<div class="fs-row">' +
      '<span class="fs-icon">' + f.icon + '</span>' +
      '<span class="fs-name">' + f.name + '</span>' +
      '<span class="fs-state ' + cls + '">' + label + '</span>' +
      '</div>';
  }).join('');

  if (code) {
    var lines = states.map(function(f) {
      return 'Feature.IsActive(<span class="str">"' + f.name + '"</span>) = <span class="kw">' + (f.active ? 'True' : 'False') + '</span>';
    }).join('\n');
    code.innerHTML = '<code><span class="cm">\' Module 04 — Feature Control</span>\n' + lines +
      '\niLogicVb.UpdateWhenDone = <span class="kw">True</span></code>';
  }
}

/* ── FAQ Accordion ───────────────────────────────────────── */
document.querySelectorAll('.faq-q').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var item   = btn.closest('.faq-item');
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(function(i) { i.classList.remove('open'); });
    if (!isOpen) item.classList.add('open');
  });
});

/* ── Enroll Form ─────────────────────────────────────────── */
var enrollForm = document.getElementById('enrollForm');
if (enrollForm) {
  enrollForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var btn  = this.querySelector('button[type="submit"]');
    var orig = btn.innerHTML;
    btn.textContent = 'Sending…'; btn.disabled = true;
    setTimeout(function() {
      enrollForm.reset(); btn.innerHTML = orig; btn.disabled = false;
      var msg = document.getElementById('formSuccess');
      if (msg) { msg.classList.add('visible'); setTimeout(function() { msg.classList.remove('visible'); }, 6000); }
    }, 1400);
  });
}

/* ── Book a Demo Modal ───────────────────────────────────── */
var demoModal = document.getElementById('demoModal');

function openDemoModal(e) {
  if (e) e.preventDefault();
  if (demoModal) { demoModal.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeDemoModal(e) {
  if (e && e.target !== demoModal) return;
  if (demoModal) { demoModal.classList.remove('open'); document.body.style.overflow = ''; }
}
function closeDemoModalBtn() {
  if (demoModal) { demoModal.classList.remove('open'); document.body.style.overflow = ''; }
}
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeDemoModalBtn(); });

var demoForm = document.getElementById('demoForm');
if (demoForm) {
  demoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var btn  = this.querySelector('button[type="submit"]');
    var orig = btn.innerHTML;
    btn.textContent = 'Booking…'; btn.disabled = true;
    setTimeout(function() {
      demoForm.reset(); btn.innerHTML = orig; btn.disabled = false;
      var msg = document.getElementById('demoFormSuccess');
      if (msg) { msg.classList.add('visible'); setTimeout(function() { msg.classList.remove('visible'); }, 6000); }
    }, 1400);
  });
}

/* ── Mascot ──────────────────────────────────────────────── */
var mascotMsgs = [
  'iLogic uses VBA syntax — easier than you think!',
  'AI can generate scripts, but YOU will understand them.',
  'Every automation rule is just IF-THEN logic!',
  '50 hours of live content. Zero jargon.',
  'Join the next batch — spots fill fast!'
];
var msgIdx = 0;
var mascot = document.getElementById('aiMascot');
var bubble = document.getElementById('mascotBubble');
if (mascot && bubble) {
  mascot.addEventListener('click', function() {
    bubble.textContent = mascotMsgs[msgIdx % mascotMsgs.length]; msgIdx++;
    bubble.style.opacity = '1'; bubble.style.transform = 'translateY(0)'; bubble.style.pointerEvents = 'auto';
    clearTimeout(mascot._t);
    mascot._t = setTimeout(function() {
      bubble.style.opacity = '0'; bubble.style.transform = 'translateY(8px)'; bubble.style.pointerEvents = 'none';
    }, 4000);
  });
}

/* ══════════════════════════════════════════════════════════
   PRICING & PAYMENT
   ══════════════════════════════════════════════════════════ */

/* ── Config — replace key when Razorpay account is ready ── */
var RAZORPAY_KEY  = 'rzp_test_oGb6qzW8qfCM3s';
var PRICE_INR     = 18999;   // ₹18,999
var PRICE_USD     = 349;     // $349
var isIndia       = true;    // default; updated by IP detection below

/* ── Detect visitor country via free IP API ─────────────── */
(function detectCountry() {
  fetch('https://ipapi.co/json/')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      isIndia = (data.country_code === 'IN');
      updatePricingDisplay();
    })
    .catch(function() {
      // On any error assume India (primary market)
      isIndia = true;
      updatePricingDisplay();
    });
})();

/* ── Update every price element on the page ─────────────── */
function updatePricingDisplay() {
  var currency = isIndia ? '₹' : '$';
  var amount   = isIndia ? '18,999' : '349';
  var flag     = isIndia ? '🇮🇳' : '🌍';
  var location = isIndia ? 'India pricing · GST included' : 'International pricing · USD';
  var note     = isIndia ? 'includes GST' : 'all-inclusive';

  document.querySelectorAll('.price-currency').forEach(function(el) { el.textContent = currency; });
  document.querySelectorAll('.price-amount').forEach(function(el) { el.textContent = amount; });
  document.querySelectorAll('.price-flag').forEach(function(el) { el.textContent = flag; });
  document.querySelectorAll('.price-location-label').forEach(function(el) { el.textContent = location; });
  document.querySelectorAll('.price-note').forEach(function(el) { el.textContent = note; });
}

/* ── Open Razorpay checkout ──────────────────────────────── */
function openPayment() {
  if (RAZORPAY_KEY === 'rzp_test_YOUR_KEY_HERE') {
    alert('Payment gateway setup in progress!\n\nTo enroll, please use the "Book a Demo" form and our team will contact you within 24 hours.');
    return;
  }

  if (typeof Razorpay === 'undefined') {
    alert('Payment gateway is loading. Please try again in a moment.');
    return;
  }

  var options = {
    key:         RAZORPAY_KEY,
    amount:      isIndia ? PRICE_INR * 100 : PRICE_USD * 100, // paise / cents
    currency:    isIndia ? 'INR' : 'USD',
    name:        'CAD Automator',
    description: 'iLogic Automation — Full Live Course',
    image:       '',
    prefill: {
      name:    document.querySelector('#enrollForm [name="name"]')    ? document.querySelector('#enrollForm [name="name"]').value    : '',
      email:   document.querySelector('#enrollForm [name="email"]')   ? document.querySelector('#enrollForm [name="email"]').value   : '',
      contact: document.querySelector('#enrollForm [name="phone"]')   ? document.querySelector('#enrollForm [name="phone"]').value   : ''
    },
    notes: { source: 'cadautomator.com' },
    theme: { color: '#00d4ff' },
    handler: function(response) {
      var msg = document.getElementById('formSuccess');
      if (msg) { msg.textContent = '🎉 Payment successful! Payment ID: ' + response.razorpay_payment_id + '. We\'ll send your batch details within 24 hours.'; msg.classList.add('visible'); }
    }
  };

  new Razorpay(options).open();
}

/* ── Pay + submit the enroll form ────────────────────────── */
function payAndEnroll(btn) {
  var form = document.getElementById('enrollForm');
  if (!form) { openPayment(); return; }

  // Validate form fields first
  var nameEl  = form.querySelector('[name="name"]');
  var emailEl = form.querySelector('[name="email"]');
  var phoneEl = form.querySelector('[name="phone"]');

  if (!nameEl.value.trim() || !emailEl.value.trim() || !phoneEl.value.trim()) {
    nameEl.reportValidity ? nameEl.reportValidity() : alert('Please fill in all required fields.');
    return;
  }

  if (RAZORPAY_KEY === 'rzp_test_YOUR_KEY_HERE') {
    // Fallback: just submit the form for manual follow-up
    animateRunBtn(btn, function() {
      var formData = new FormData(form);
      fetch('/', { method: 'POST', body: formData })
        .catch(function() {});
      form.reset();
      var msg = document.getElementById('formSuccess');
      if (msg) { msg.classList.add('visible'); setTimeout(function() { msg.classList.remove('visible'); }, 7000); }
    });
    return;
  }

  if (typeof Razorpay === 'undefined') {
    alert('Payment gateway loading… please try again in a moment.');
    return;
  }

  var options = {
    key:         RAZORPAY_KEY,
    amount:      isIndia ? PRICE_INR * 100 : PRICE_USD * 100,
    currency:    isIndia ? 'INR' : 'USD',
    name:        'CAD Automator',
    description: 'iLogic Automation — Full Live Course',
    prefill: {
      name:    nameEl.value,
      email:   emailEl.value,
      contact: phoneEl.value
    },
    notes: { source: 'cadautomator.com Enroll Form' },
    theme: { color: '#00d4ff' },
    handler: function(response) {
      // Submit form data to Netlify with payment ID
      var formData = new FormData(form);
      formData.append('razorpay_payment_id', response.razorpay_payment_id);
      fetch('/', { method: 'POST', body: formData }).catch(function() {});
      form.reset();
      var msg = document.getElementById('formSuccess');
      if (msg) {
        msg.textContent = '🎉 Payment successful! ID: ' + response.razorpay_payment_id + '. Batch details coming to your email within 24 hrs.';
        msg.classList.add('visible');
        setTimeout(function() { msg.classList.remove('visible'); }, 10000);
      }
    }
  };

  new Razorpay(options).open();
}

/* ── Helpers ─────────────────────────────────────────────── */
function setText(id, text) {
  var el = document.getElementById(id);
  if (el) el.textContent = text;
}
function val(id) {
  var el = document.getElementById(id);
  return el ? el.value : '';
}

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  _doSkidDemo();
  _doIPropDemo();
  runFeatureDemo();
});
