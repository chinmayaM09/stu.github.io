/* ============================================================
   Swadhaya Practice Tests - Static Website JavaScript
   - Tab switching
   - Product list generation (24 packages)
   - Multi-select order with live total calculation
   - Order ID generation (timestamp + random)
   - FormSubmit.co integration (no backend, no stored data)
   ============================================================ */

/* ============================================================
   CONFIGURATION
   ------------------------------------------------------------
   These are the ONLY values you need to change before going live.
   Replace the placeholder email, price, and per-hour rate below.
   ============================================================ */
const CONFIG = {
  // The destination email where order + doubt submissions will be sent.
  // IMPORTANT: This must match the action URL in <form action="..."> in index.html.
  // To change it, you must update BOTH this CONFIG.email AND every
  // form's `action` attribute in index.html.
  email: "xyz@gmail.com",

  // Price per product package, in Rupees.
  // Replace the string "X" shown on the site with this value.
  pricePerProduct: 100, // <-- set your real price here (e.g. 150, 200)

  // Hourly rate for doubt clearance, in Rupees.
  // Replace the string "Y" shown on the site with this value.
  pricePerHour: 500, // <-- set your real hourly rate here (e.g. 300, 750)

  // Currency symbol used in the UI.
  currency: "Rs.",
};

/* ---------- Product catalogue ---------- */
// 24 packages: 4 subjects x 3 classes x 2 semesters
const SUBJECTS = [
  { code: "Phy",   name: "Physics",   color: "#2563eb" },
  { code: "Chem",  name: "Chemistry", color: "#059669" },
  { code: "Maths", name: "Mathematics", color: "#7c3aed" },
  { code: "Bio",   name: "Biology",   color: "#dc2626" },
];
const CLASSES = [8, 9, 10];
const SEMESTERS = [1, 2];

// Build the 24-product list in the user-specified order:
//   for each class -> for each subject -> for each semester
//   (Phy_8_1, Phy_8_2, Chem_8_1, Chem_8_2, ..., Bio_10_2)
function buildProductList() {
  const products = [];
  CLASSES.forEach(cls => {
    SUBJECTS.forEach(sub => {
      SEMESTERS.forEach(sem => {
        products.push({
          code: `${sub.code}_${cls}_${sem}`,
          subject: sub.name,
          subjectCode: sub.code,
          class: cls,
          semester: sem,
          price: CONFIG.pricePerProduct,
        });
      });
    });
  });
  return products;
}

const PRODUCTS = buildProductList();

/* ============================================================
   Tab navigation
   - Anchor-based tabs (<a href="#tab-...">) so they work even without JS
   - JS adds smooth switching without page jump, syncs .active classes
   - URL hash is updated so deep-linking works
   ============================================================ */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  function activateTab(tabName, { updateHash = true } = {}) {
    // toggle button states
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    // toggle panel visibility
    tabPanels.forEach(panel => {
      const isActive = panel.id === `tab-${tabName}`;
      panel.classList.toggle('active', isActive);
    });
    // update URL hash for deep-linking (without triggering scroll jump)
    if (updateHash && window.location.hash !== `#tab-${tabName}`) {
      history.replaceState(null, '', `#tab-${tabName}`);
    }
    // move focus for accessibility
    const activePanel = document.querySelector(`#tab-${tabName}`);
    if (activePanel) {
      activePanel.focus({ preventScroll: true });
    }
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); // stop the default anchor jump
      activateTab(btn.dataset.tab);
    });
  });

  // On page load: if URL hash points to a tab, activate that tab.
  // Otherwise, default to the first tab (about).
  const initialHash = window.location.hash.replace('#tab-', '').replace('#', '');
  const validTabs = Array.from(tabButtons).map(b => b.dataset.tab);
  if (initialHash && validTabs.includes(initialHash)) {
    activateTab(initialHash, { updateHash: false });
  } else {
    // Default to first tab
    activateTab(validTabs[0] || 'about', { updateHash: false });
  }
}

/* ============================================================
   Render Product Line grid
   ============================================================ */
function renderProductGrid(filter = 'all') {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  const filtered = filter === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => String(p.class) === String(filter));

  grid.innerHTML = filtered.map(p => `
    <article class="product-card" data-subject="${p.subjectCode}">
      <p class="pc-subject">${p.subject}</p>
      <span class="pc-code">${p.code}</span>
      <p class="pc-meta">Class <strong>${p.class}</strong> &middot; Semester <strong>${p.semester}</strong></p>
      <p class="pc-price">${CONFIG.currency} ${p.price} per package</p>
    </article>
  `).join('');

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#6b7280; padding:20px;">No products to display.</p>';
  }
}

function initProductFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProductGrid(btn.dataset.class);
    });
  });
}

/* ============================================================
   Render the multi-select checkbox list on the Contact Us tab
   ============================================================ */
function renderOrderProductCheckboxes() {
  const container = document.getElementById('orderProductList');
  if (!container) return;

  container.innerHTML = PRODUCTS.map(p => `
    <label class="order-product-item">
      <input type="checkbox" name="Products_Selected" value="${p.code}" data-price="${p.price}" />
      <span>
        <span class="opi-code">${p.code}</span><br />
        <span class="opi-desc">${p.subject} &middot; Class ${p.class} &middot; Sem ${p.semester} &middot; ${CONFIG.currency} ${p.price}</span>
      </span>
    </label>
  `).join('');
}

/* ============================================================
   Order ID generator
   Format: SWA-YYYYMMDDHHMMSS-XXXX  (timestamp + 4-char random)
   ============================================================ */
function generateOrderId() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const stamp =
    now.getFullYear() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds());
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SWA-${stamp}-${rand}`;
}

/* ============================================================
   Order form: live total + Order ID + submit
   ============================================================ */
function initOrderForm() {
  const form = document.getElementById('orderForm');
  if (!form) return;

  const checkboxes = () => form.querySelectorAll('input[name="Products_Selected"]');
  const summaryCount = document.getElementById('summaryCount');
  const summaryTotal = document.getElementById('summaryTotal');
  const summaryOrderId = document.getElementById('summaryOrderId');
  const orderIdField = document.getElementById('order_id_field');
  const submitBtn = document.getElementById('submitOrderBtn');
  const clearBtn = document.getElementById('clearOrderBtn');

  function recalculate() {
    const checked = Array.from(checkboxes()).filter(cb => cb.checked);
    const count = checked.length;
    const total = checked.reduce((sum, cb) => sum + Number(cb.dataset.price || 0), 0);
    summaryCount.textContent = count;
    summaryTotal.textContent = `${CONFIG.currency} ${total}`;
    submitBtn.disabled = (count === 0);
  }

  // Re-calculate on every checkbox toggle
  form.addEventListener('change', e => {
    if (e.target.matches('input[name="Products_Selected"]')) {
      recalculate();
    }
  });

  // Generate Order ID when the user starts the form interaction
  // (we don't generate at page-load so it doesn't become stale)
  function ensureOrderId() {
    if (!orderIdField.value) {
      const id = generateOrderId();
      orderIdField.value = id;
      summaryOrderId.textContent = id;
    }
  }

  // Generate as soon as the user checks the first product OR focuses a field
  form.addEventListener('focus', ensureOrderId, { once: true });
  form.addEventListener('change', e => {
    if (e.target.matches('input[name="Products_Selected"]')) ensureOrderId();
  });

  // Pre-submit validation + build a clean summary email
  form.addEventListener('submit', (e) => {
    const checked = Array.from(checkboxes()).filter(cb => cb.checked);
    if (checked.length === 0) {
      e.preventDefault();
      alert('Please select at least one product before generating the order.');
      return false;
    }
    if (!form.querySelector('#studentName').value.trim()) {
      e.preventDefault();
      alert('Please enter the student name.');
      return false;
    }
    if (!form.querySelector('#studentPhone').value.trim()) {
      e.preventDefault();
      alert('Please enter the phone number.');
      return false;
    }

    // Ensure an Order ID exists
    ensureOrderId();

    // Build a comma-separated list of selected product codes for the email body
    // (FormSubmit sends all named fields in a single email)
    const productCodes = checked.map(cb => cb.value).join(', ');
    const total = checked.reduce((sum, cb) => sum + Number(cb.dataset.price || 0), 0);

    // Add a hidden field for the comma-separated list (easier to read in the email)
    let productsField = form.querySelector('input[name="Products_List"]');
    if (!productsField) {
      productsField = document.createElement('input');
      productsField.type = 'hidden';
      productsField.name = 'Products_List';
      form.appendChild(productsField);
    }
    productsField.value = productCodes;

    let totalField = form.querySelector('input[name="Total_Amount"]');
    if (!totalField) {
      totalField = document.createElement('input');
      totalField.type = 'hidden';
      totalField.name = 'Total_Amount';
      form.appendChild(totalField);
    }
    totalField.value = `${CONFIG.currency} ${total}`;

    // Disable button to prevent double-submit
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Form will submit to FormSubmit.co - browser navigates to thank-you.html
    return true;
  });

  // Clear selection button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      checkboxes().forEach(cb => { cb.checked = false; });
      form.querySelector('#studentName').value = '';
      form.querySelector('#studentPhone').value = '';
      orderIdField.value = '';
      summaryCount.textContent = '0';
      summaryTotal.textContent = `${CONFIG.currency} 0`;
      summaryOrderId.textContent = '\u2014';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Generate Order & Send';
    });
  }

  // Initial state
  recalculate();
}

/* ============================================================
   Doubt form: basic client-side validation only
   (No data is stored anywhere - FormSubmit handles the email)
   ============================================================ */
function initDoubtForm() {
  const form = document.getElementById('doubtForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    const name = form.querySelector('#doubtName').value.trim();
    const mobile = form.querySelector('#doubtMobile').value.trim();
    const desc = form.querySelector('#doubtDesc').value.trim();

    if (!name || !mobile || !desc) {
      e.preventDefault();
      alert('Please fill in your name, mobile number and a description of your doubt.');
      return false;
    }
    if (desc.length < 15) {
      e.preventDefault();
      alert('Please describe your doubt in a bit more detail (at least 15 characters) so we can help you effectively.');
      return false;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }
    return true;
  });
}

/* ============================================================
   Inject live prices into About / Product Line / Doubt text
   This replaces the placeholder text "Rs. X" and "Rs. Y per hour"
   shown in index.html with the actual values from CONFIG.
   ============================================================ */
function injectPrices() {
  // Update the "Rs. X" placeholder shown on the Product Line tab
  const pricePerProductEl = document.getElementById('pricePerProduct');
  if (pricePerProductEl) {
    pricePerProductEl.textContent = `${CONFIG.currency} ${CONFIG.pricePerProduct}`;
  }
  // Update the "Rs. Y per hour" placeholder shown on the Doubt Clearance tab
  const pricePerHourEl = document.getElementById('pricePerHour');
  if (pricePerHourEl) {
    pricePerHourEl.textContent = `${CONFIG.currency} ${CONFIG.pricePerHour} per hour`;
  }
}

/* ============================================================
   Footer year
   ============================================================ */
function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   Init on DOM ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  renderProductGrid();
  initProductFilters();
  renderOrderProductCheckboxes();
  initOrderForm();
  initDoubtForm();
  injectPrices();
  setFooterYear();
});
