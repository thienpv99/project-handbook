/**
 * main.js - Handbook deployment pages
 * Handles: authentication, sidebar navigation, accordion, role tabs, DoD checklist
 */

// ============================================================
// AUTHENTICATION
// Credentials are intentionally client-side for this static
// internal tool. Not suitable for high-security prod systems.
// ============================================================
const AUTH_KEY = 'handbook_auth';
const AUTH_USER = 'admin';
const AUTH_PASS = 'Admin@!23';
const AUTH_TTL_MS = 24 * 60 * 60 * 1000;

function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

function getAuthRecord() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    clearAuth();
    return null;
  }
}

function isAuthenticated() {
  const record = getAuthRecord();
  if (!record || record.status !== 'authenticated' || typeof record.authenticatedAt !== 'number') {
    clearAuth();
    return false;
  }

  if (Date.now() - record.authenticatedAt > AUTH_TTL_MS) {
    clearAuth();
    return false;
  }

  return true;
}

function persistAuth() {
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({
      status: 'authenticated',
      authenticatedAt: Date.now(),
    })
  );
}

function syncAuthState() {
  const overlay = document.getElementById('login-overlay');

  if (isAuthenticated()) {
    document.body.classList.remove('locked');
    if (overlay) overlay.classList.add('hidden');
    return;
  }

  document.body.classList.add('locked');
  if (overlay) overlay.classList.remove('hidden');
}

/** Check auth state on every page load */
(function initAuth() {
  syncAuthState();
})();

/** Handle login form submit */
function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const errorBox = document.getElementById('login-error');
  const submitBtn = document.getElementById('login-submit');

  submitBtn.disabled = true;
  submitBtn.classList.add('loading');
  errorBox.classList.remove('show');

  setTimeout(() => {
    if (username === AUTH_USER && password === AUTH_PASS) {
      persistAuth();
      syncAuthState();
    } else {
      errorBox.textContent = 'Incorrect username or password. Please try again.';
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
  clearAuth();
  syncAuthState();
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
  document.getElementById('login-error').classList.remove('show');
}

/** Toggle password visibility */
function togglePw() {
  const input = document.getElementById('login-password');
  const toggle = document.querySelector('.pw-toggle');
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  toggle.textContent = isHidden ? 'Hide' : 'Show';
}

// ============================================================
// SIDEBAR - Mobile toggle
// ============================================================
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function (e) {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebar-toggle');
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
// SIDEBAR NAV - Active link on click
// ============================================================
function setActive(el) {
  document.querySelectorAll('#sidebar-nav a').forEach(a => a.classList.remove('active'));
  el.classList.add('active');
  if (window.innerWidth <= 900) {
    document.getElementById('sidebar').classList.remove('open');
  }
}

// ============================================================
// SIDEBAR NAV - Auto-highlight on scroll
// ============================================================
const navMap = {
  'section-governance': 'nav-governance',
  'section-phase1': 'nav-phase1',
  'section-phase2': 'nav-phase2',
  'section-phase3': 'nav-phase3',
  'section-phase4': 'nav-phase4',
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
// ACCORDION - Expand / collapse
// ============================================================
function toggleAccordion(btn) {
  const expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!expanded));
  btn.nextElementSibling.classList.toggle('open', !expanded);
}

// ============================================================
// ROLE TABS - Switch perspective panels
// ============================================================
function switchRole(role) {
  document.querySelectorAll('.role-tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });

  document.querySelectorAll('.role-panel').forEach(p => p.classList.remove('active'));

  const tab = document.getElementById('tab-' + role);
  const panel = document.getElementById('panel-' + role);
  if (tab) {
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
  }
  if (panel) panel.classList.add('active');
}

// ============================================================
// DOD CHECKLIST - Toggle items & update progress bar
// ============================================================
function toggleDod(item) {
  item.classList.toggle('checked');
  item.setAttribute('aria-checked', String(item.classList.contains('checked')));
  updateDod();
}

document.querySelectorAll('.dod-item').forEach(item => {
  item.addEventListener('keydown', e => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleDod(item);
    }
  });
});

function updateDod() {
  const items = document.querySelectorAll('.dod-item');
  const checked = document.querySelectorAll('.dod-item.checked').length;
  const total = items.length;
  const pct = Math.round((checked / total) * 100);

  document.getElementById('dod-count').textContent = `${checked} / ${total} complete`;
  document.getElementById('dod-bar').style.width = `${pct}%`;

  const banner = document.getElementById('dod-complete-banner');
  banner.classList.toggle('show', checked === total);
}

// ============================================================
// RESPONSIVE - 2-column grid fallback for narrow viewports
// ============================================================
function applyGrids() {
  document.querySelectorAll('.grid-2col').forEach(g => {
    g.style.gridTemplateColumns = window.innerWidth < 720 ? '1fr' : '1fr 1fr';
  });
}

applyGrids();
window.addEventListener('resize', applyGrids);
window.addEventListener('storage', e => {
  if (e.key === AUTH_KEY) syncAuthState();
});
