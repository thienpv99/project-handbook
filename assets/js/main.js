/**
 * main.js — VietBank Deployment Runbook
 * Handles: authentication, sidebar navigation, accordion, role tabs, DoD checklist
 */

// ============================================================
// AUTHENTICATION
// Credentials are intentionally client-side for this static
// internal tool. Not suitable for high-security prod systems.
// ============================================================
const AUTH_KEY  = 'vb_runbook_auth';
const AUTH_USER = 'admin';
const AUTH_PASS = 'Admin@!23';

/** Check session on every page load */
(function initAuth() {
  if (sessionStorage.getItem(AUTH_KEY) !== 'authenticated') {
    // Lock the page — hide all app content
    document.body.classList.add('locked');
  } else {
    // Already logged in — hide login overlay
    const overlay = document.getElementById('login-overlay');
    if (overlay) overlay.classList.add('hidden');
  }
})();

/** Handle login form submit */
function handleLogin(e) {
  e.preventDefault();
  const username  = document.getElementById('login-username').value.trim();
  const password  = document.getElementById('login-password').value;
  const errorBox  = document.getElementById('login-error');
  const submitBtn = document.getElementById('login-submit');

  // Loading state
  submitBtn.disabled = true;
  submitBtn.classList.add('loading');
  errorBox.classList.remove('show');

  // Small delay for UX feel
  setTimeout(() => {
    if (username === AUTH_USER && password === AUTH_PASS) {
      // ✅ Correct — grant access
      sessionStorage.setItem(AUTH_KEY, 'authenticated');
      document.body.classList.remove('locked');
      document.getElementById('login-overlay').classList.add('hidden');
    } else {
      // ❌ Wrong credentials
      errorBox.textContent = '⚠️ Incorrect username or password. Please try again.';
      errorBox.classList.add('show');
      document.getElementById('login-password').value = '';
      document.getElementById('login-password').focus();
    }
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
  }, 400);
}

/** Handle logout */
function handleLogout() {
  sessionStorage.removeItem(AUTH_KEY);
  document.body.classList.add('locked');
  document.getElementById('login-overlay').classList.remove('hidden');
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
  document.getElementById('login-error').classList.remove('show');
}

/** Toggle password visibility */
function togglePw() {
  const input  = document.getElementById('login-password');
  const toggle = document.querySelector('.pw-toggle');
  const isHidden = input.type === 'password';
  input.type      = isHidden ? 'text' : 'password';
  toggle.textContent = isHidden ? '🙈' : '👁';
}

// ============================================================
// SIDEBAR — Mobile toggle
// ============================================================
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function (e) {
  const sidebar = document.getElementById('sidebar');
  const toggle  = document.getElementById('sidebar-toggle');
  if (
    window.innerWidth <= 900 &&
    sidebar.classList.contains('open') &&
    !sidebar.contains(e.target) &&
    !toggle.contains(e.target)
  ) {
    sidebar.classList.remove('open');
  }
});

// ============================================================
// SIDEBAR NAV — Active link on click
// ============================================================
function setActive(el) {
  document.querySelectorAll('#sidebar-nav a').forEach(a => a.classList.remove('active'));
  el.classList.add('active');
  // Close sidebar on mobile after clicking a nav link
  if (window.innerWidth <= 900) {
    document.getElementById('sidebar').classList.remove('open');
  }
}

// ============================================================
// SIDEBAR NAV — Auto-highlight on scroll (Intersection Observer)
// ============================================================
const navMap = {
  'section-governance': 'nav-governance',
  'section-phase1':     'nav-phase1',
  'section-phase2':     'nav-phase2',
  'section-phase3':     'nav-phase3',
  'section-phase4':     'nav-phase4',
};

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const navId = navMap[entry.target.id];
        if (navId) {
          document.querySelectorAll('#sidebar-nav a').forEach(a => a.classList.remove('active'));
          const el = document.getElementById(navId);
          if (el) el.classList.add('active');
        }
      }
    });
  },
  { rootMargin: '-30% 0px -60% 0px' }
);

Object.keys(navMap).forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

// ============================================================
// ACCORDION — Expand / collapse
// ============================================================
function toggleAccordion(btn) {
  const expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!expanded));
  btn.nextElementSibling.classList.toggle('open', !expanded);
}

// ============================================================
// ROLE TABS — Switch perspective panels
// ============================================================
function switchRole(role) {
  // Deactivate all tabs
  document.querySelectorAll('.role-tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });

  // Deactivate all panels
  document.querySelectorAll('.role-panel').forEach(p => p.classList.remove('active'));

  // Activate selected tab and panel
  const tab   = document.getElementById('tab-'   + role);
  const panel = document.getElementById('panel-' + role);
  if (tab)   { tab.classList.add('active');   tab.setAttribute('aria-selected', 'true'); }
  if (panel) { panel.classList.add('active'); }
}

// ============================================================
// DOD CHECKLIST — Toggle items & update progress bar
// ============================================================
function toggleDod(item) {
  item.classList.toggle('checked');
  item.setAttribute('aria-checked', String(item.classList.contains('checked')));
  updateDod();
}

// Keyboard accessibility for DoD items
document.querySelectorAll('.dod-item').forEach(item => {
  item.addEventListener('keydown', e => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleDod(item);
    }
  });
});

function updateDod() {
  const items   = document.querySelectorAll('.dod-item');
  const checked = document.querySelectorAll('.dod-item.checked').length;
  const total   = items.length;
  const pct     = Math.round((checked / total) * 100);

  document.getElementById('dod-count').textContent = `${checked} / ${total} complete`;
  document.getElementById('dod-bar').style.width   = `${pct}%`;

  const banner = document.getElementById('dod-complete-banner');
  banner.classList.toggle('show', checked === total);
}

// ============================================================
// RESPONSIVE — 2-column grid fallback for narrow viewports
// ============================================================
function applyGrids() {
  document.querySelectorAll('.grid-2col').forEach(g => {
    g.style.gridTemplateColumns = window.innerWidth < 720 ? '1fr' : '1fr 1fr';
  });
}

applyGrids();
window.addEventListener('resize', applyGrids);
