# Swadhaya Practice Tests — Static Website

A 4-tab static website (HTML + CSS + vanilla JavaScript, no frameworks, no build step) designed to be hosted on **GitHub Pages**. No backend, no database, no cookies, no `localStorage` — student data is forwarded directly to your team email and then cleared from the browser.

## File Structure

```
swadhaya-practice-tests/
├── index.html         Main 4-tab page (About Us, Product Line, Contact Us, Doubt Clearance)
├── thank-you.html     Shown after a form is submitted (FormSubmit redirect target)
├── styles.css         All site styling
├── script.js          Tab switching, product generation, Order ID, FormSubmit integration
└── README.md          This file
```

## The 4 Tabs

| # | Tab            | Purpose                                                                                       |
|---|----------------|-----------------------------------------------------------------------------------------------|
| 1 | About Us       | Organisation intro, swadhaya philosophy, what we offer / don't offer, package contents.       |
| 2 | Product Line   | 24 packages (Physics, Chemistry, Maths, Biology × Classes 8, 9, 10 × Semester 1, 2).          |
| 3 | Contact Us     | Order form: multi-select products, name, phone, auto-generated Order ID, email to your team. |
| 4 | Doubt Clearance | Chargeable doubt-clearance request form: name, mobile, doubt description, email to your team. |

## Configuration (BEFORE you upload)

Open `script.js` and edit the `CONFIG` block at the top — this is the **only** place you need to change:

```js
const CONFIG = {
  email:           "xyz@gmail.com",  // <-- replace with your real team email
  pricePerProduct: 100,               // <-- replace X with your real per-package price
  pricePerHour:    500,               // <-- replace Y with your real per-hour doubt rate
  currency:        "Rs.",
};
```

**Then ALSO update both `<form>` `action` URLs** in `index.html` — there are two of them (the Contact Us order form and the Doubt Clearance form). Change `xyz@gmail.com` to your real email in each:

```html
<!-- Order form (Contact Us tab) -->
<form id="orderForm" ... action="https://formsubmit.co/your-real-email@gmail.com" method="POST">

<!-- Doubt form (Doubt Clearance tab) -->
<form id="doubtForm" ... action="https://formsubmit.co/your-real-email@gmail.com" method="POST">
```

You must update **both** the CONFIG and the form `action` attributes, because FormSubmit only knows about the email address in the `action` URL.

## Activating Email (FormSubmit.co)

This site uses [FormSubmit.co](https://formsubmit.co/) — a free, no-signup service that forwards form submissions to your email. It works on GitHub Pages because it needs no backend.

**First-time activation (one-time only):**

1. Upload the site to GitHub Pages (see next section) — or test it locally.
2. Open the live site in your browser and submit a form for the first time
   (either the Contact Us order form or the Doubt Clearance form).
3. FormSubmit will detect the first submission and send a confirmation email
   to the address you put in the `action` URL.
4. Open that email and click the activation link inside it.
5. From that point on, all form submissions will arrive in your inbox as
   clean tabular emails.

You only have to do this once per email address.

## Uploading to GitHub Pages

1. **Create a GitHub account** (if you don't have one) at <https://github.com>.

2. **Create a new repository**:
   - Click the **+** icon in the top-right → **New repository**.
   - Repository name: anything you like, e.g. `swadhaya-tests`.
   - Set it to **Public** (GitHub Pages on free accounts only works with public repos).
   - Tick **Add a README file** (optional).
   - Click **Create repository**.

3. **Upload the 5 files** (`index.html`, `thank-you.html`, `styles.css`, `script.js`, `README.md`):
   - Click **Add file → Upload files**.
   - Drag the 5 files into the upload box (or browse for them).
   - Click **Commit changes**.

4. **Enable GitHub Pages**:
   - Go to **Settings → Pages** (left sidebar).
   - Under **Build and deployment → Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` and `/ (root)`, then click **Save**.
   - Wait 1–2 minutes. The page will refresh and show your published URL, e.g.
     `https://your-username.github.io/swadhaya-tests/`.

5. **Visit your published URL** and submit a test form to trigger the
   FormSubmit activation email (see above).

## Anonymity & Data Handling

- **Static site** — no server, no database, no backend code runs anywhere.
- **No client-side storage** — student name, phone, doubts, and Order IDs are
  never written to `localStorage`, `sessionStorage`, cookies, or files.
- **Form data is forwarded by email** via FormSubmit.co to your team address.
  FormSubmit's own privacy policy is available on their site; once the email
  arrives in your inbox, no copy of the data is stored on *this* website.
- **Order ID** is generated in the browser at submit time using a timestamp
  + 4-character random string (format: `SWA-YYYYMMDDHHMMSS-XXXX`). It is not
  stored anywhere; it is included in the email body and shown on the
  thank-you page so the student can save it for future correspondence.

## Updating Prices / Email Later

To change prices or the destination email after the site is live, just edit
`script.js` (and the `action` URLs in `index.html`) and commit to GitHub.
The change goes live within 1–2 minutes — no rebuild needed.

## Customising the Look

All colours, fonts, spacing, and component styles live in `styles.css`.
The main palette is:

| Token        | Colour     | Used for                          |
|--------------|------------|-----------------------------------|
| Primary      | `#1e3a8a`  | Headings, primary buttons, links  |
| Accent       | `#f59e0b`  | Highlights, active-tab underline  |
| Background   | `#faf7f2`  | Page background                   |
| Text         | `#1f2937`  | Body copy                         |
| Warning      | `#dc2626`  | Privacy/anonymity callouts        |

Search-and-replace these hex values in `styles.css` to rebrand the whole site.

## Browser Support

Tested in modern Chrome, Firefox, Edge, and Safari. No external CDN
dependencies — the site loads instantly and works offline once cached.

## License

You own this code. Modify freely.
