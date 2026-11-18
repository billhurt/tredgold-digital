# Copy proposals for approval

## Decision (18 November 2026)

- **Applied: metadata only, option A wherever there was a choice.** That covers titles, meta descriptions, OG/Twitter tags, OG alt text, structured data (including the three optional extra services) and llms.txt / llms-full.txt.
- **Not applied: all visible page copy stays exactly as it is.** That means `home.leadership` and `home.trades` (section 2) are not used. They stay here as options for later.
- **Profiles:** LinkedIn and the Companies House officer page are added to the Person `sameAs`.
- **Verification:** Search Console is already verified; both meta tags are removed, and Bing will import from Search Console.
- **Prices:** none, so Capstone and Ask Atlas won't qualify for Google's software rich result.

---

The original proposals follow, unchanged. Voice used throughout: plain English, short sentences, no jargon. That matches the homepage.

---

## 1. Already live, written by me in the redesign

You haven't approved these yet. The three marked **placeholder** have been taken out of the code on this branch. The others are accessibility labels: I've left them in place, because removing them would make the site worse for screen-reader users.

### `products.title`: /products `<title>`, `og:title`, `twitter:title`, and the WebPage name in JSON-LD (placeholder)
- Live now: `Products: Capstone and Ask Atlas | Tredgold Digital`
- [ ] **A (keep):** `Products: Capstone and Ask Atlas | Tredgold Digital`
- [ ] **B:** `Our Software: Capstone and Ask Atlas | Tredgold Digital`

### `products.description`: /products meta description, `og:description`, `twitter:description` (placeholder)
- Live now: `Capstone and Ask Atlas: software we build, run and support ourselves.`
- [ ] **A (keep):** `Capstone and Ask Atlas: software we build, run and support ourselves.`
- [ ] **B:** `Capstone, job management for trades, and Ask Atlas, AI training support for aviation. Software we build, run and support ourselves in Leeds.`

### `og.alt`: `og:image:alt` on every page (placeholder)
- Live now: `Tredgold Digital: We automate what slows you down.`
- [ ] **A (keep):** `Tredgold Digital: We automate what slows you down.`
- [ ] **B (describes the image):** `Tredgold Digital. "We automate what slows you down." Tangled grey lines pulling into one blue line on a black background.`

### Accessibility labels (left in place; screen readers announce them)
| Where | Text |
|---|---|
| Skip link, every page | `Skip to content` |
| Mobile menu button | `Open menu` / `Close menu` |
| Homepage section labels | `Introduction` (hero), `What slows you down` (marquee), `Manifesto` |
| /products section label | `Products` |
| Breadcrumb names in JSON-LD | `Tredgold Digital`, `Products`, `Privacy Policy` (reused from existing page text) |

- [ ] Approve all as they are

---

## 2. Copy changes the audit turned up (visible or indexed, already live)

### `home.title`: homepage `<title>`, `og:title`, `twitter:title`
Live now: `We Automate What Slows You Down | Tredgold Digital` (the `og:` and `twitter:` titles drop the brand, so they don't match).

The title is the strongest on-page signal and doesn't mention software, contractors or Leeds. Under 60 characters is best; Google cuts off longer titles.
- [ ] **A:** `Software & Automation for Contractors in Leeds | Tredgold Digital`
- [ ] **B:** `Bespoke Software for Yorkshire Contractors | Tredgold Digital`
- [ ] **C (keep the headline):** `We Automate What Slows You Down | Tredgold Digital`, with `og:` and `twitter:` titles made to match

### `home.description`: homepage meta description, `og:description`, `twitter:description`, and the ProfessionalService description in JSON-LD
Live now: `We automate business processes for UK specialist contractors, and build our own software: Capstone for trades and Ask Atlas for aviation training.`

It leads with "UK", leaves out the trades and Yorkshire, and spends words on aviation, which is out of scope here.
- [ ] **A:** `Bespoke software, AI and automation for civils, roofing and landscaping contractors in Leeds and across Yorkshire. We start with a discovery session with your team.`
- [ ] **B:** `We build bespoke software and automation for specialist contractors in Leeds and Yorkshire: civils, roofing and cladding, landscaping and grounds maintenance.`

### `home.leadership`: homepage credibility section, the line under the body copy
Live now: `Tredgold Digital is led by William Hurt — working with businesses worldwide on the systems and automation that sit behind their operations.`

"Worldwide" conflicts with the hero's "Working across the UK" and with the Yorkshire focus.
- [ ] **A:** `Tredgold Digital is led by William Hurt — working with specialist contractors in Leeds, across Yorkshire and the wider UK on the systems and automation that sit behind their operations.`
- [ ] **B (keep as is)**

### `home.trades` (optional, new): one visible line naming the trades
At the moment the site's visible text never says civils, roofing, cladding, landscaping or grounds maintenance. Search engines and AI assistants mostly go by visible text, so this is the biggest on-page gap. I suggest one line in the problem section intro (or a slim strip under the marquee) that links to the sector pages once they exist.
- [ ] **A:** `We work with civils, roofing and cladding, and landscaping and grounds maintenance contractors.`
- [ ] **B:** leave until the sector pages are built

---

## 3. Structured data wording (JSON-LD; not visible)

### `schema.knowsAbout`: Organization and ProfessionalService, homepage and every page
A list of topics. It helps search engines and AI assistants connect the business to the trades and services.
- [ ] Proposed list:
  - Bespoke software development
  - Business process automation
  - AI automation
  - Systems integration
  - Job management software
  - Dashboards and reporting
  - Compliance and certification tracking
  - Civil engineering contractors
  - Roofing and cladding contractors
  - Landscaping and grounds maintenance

### Service descriptions: the four existing services on the homepage
The four service names are already live, so these are descriptions only. Each Service is marked as aimed at "Specialist contractors", as you asked.

`schema.service.admin.description`: *Manual admin and internal workflow automation*
- [ ] `We automate repetitive admin for specialist contractors: re-typed data, approvals, timesheets and certificate tracking.`

`schema.service.integration.description`: *Connecting disconnected systems and data*
- [ ] `We connect CRMs, accounts packages, job sheets and spreadsheets so data is entered once and appears everywhere it's needed.`

`schema.service.customer.description`: *Websites, booking systems and customer portals*
- [ ] `Enquiry forms, booking systems and client portals that make contractors easy to buy from and make sure no enquiry is missed.`

`schema.service.reporting.description`: *Dashboards and reporting*
- [ ] `Live dashboards that show contractors what's happening now: jobs, hours, compliance and money.`

### Optional extra Service entries (only added if approved)
These match how the site already describes the work.
- [ ] `Bespoke software development`: `Software built around how a contractor's team actually works, from job management to compliance tracking.`
- [ ] `AI assistants and automation`: `AI that drafts quotes, reports and replies from your own information, with a person checking before anything goes out.`
- [ ] `Discovery session`: `An in-depth session with the people who do the work, on site or on a call, to map how things really run and where the time goes.` (this is the stage text from the homepage, word for word)

---

## 4. llms.txt and llms-full.txt

These are plain-text files in the site root. AI assistants and some crawlers read them for a quick, reliable summary. Everything below uses facts that are already on the site.

### `llms.summary` (the quote line at the top of both files)
- [ ] `Tredgold Digital is a Leeds software and automation company. We build bespoke software, AI and automation for specialist contractors in Yorkshire, especially civils, roofing and cladding, and landscaping and grounds maintenance firms.`

### `llms.intro`
- [ ] `We sit down with the people who do the work, find what's costing them time, and build one system that fixes it. We also build and run our own software, so everything we deliver is production software we support after launch.`

### `llms.who`
- [ ] 
  ```
  - Specialist contractors in Leeds and across Yorkshire: civils, roofing and cladding, and landscaping and grounds maintenance.
  - Firms that run on spreadsheets, email chains, paper forms and apps that don't talk to each other.
  - We also work with contractors elsewhere in the UK.
  ```

### `llms.what`
- [ ] 
  ```
  - Automation of manual admin: re-typed data, approvals, timesheets and certificate tracking.
  - Connected systems: CRM, accounts, job sheets and spreadsheets, so data goes in once.
  - Customer-facing systems: enquiry forms, booking systems and client portals.
  - Dashboards and reporting that show what's happening now.
  - Our own products: Capstone (https://capstoneops.co.uk), job management for UK trades; and Ask Atlas (https://flyatlas.app), AI training support for aviation.
  ```

### `llms.where`
- [ ] `Based in Leeds. We work across West, North and South Yorkshire and the East Riding, on site or by call, and with contractors elsewhere in the UK.`

### `llms.how`
- [ ] 
  ```
  1. Discovery session: an in-depth session with the people who do the work, on site or on a call.
  2. Plan: a clear written plan of what we'll build, what it fixes, what it costs and how long it takes. No code until it's agreed.
  3. Build, alongside you: short cycles, with working software in front of your team early.
  4. Launch: training, data migration and support from day one.
  5. Run and improve: we look after it and keep improving it.
  ```

### `llms.proof`
- [ ] `We build and run two live products of our own, Capstone and Ask Atlas. Client case studies are coming soon.` (switches to links once the case study pages exist)

### Link notes
- [ ] `llms.link.home`: `What we do, how we work, and how to get in touch.`
- [ ] `llms.link.products`: `Capstone and Ask Atlas, the software we build and run ourselves.`
- [ ] `llms.link.privacy`: `How we handle personal data.`
- [ ] `llms.link.full`: `The same information in more detail.`

### `llms-full.body`
The longer file: sections 2 to 6 above, plus the full text of the four problem areas and the five stages, word for word from the homepage.
- [ ] Approve: build it from the approved items above plus the existing homepage copy (no new wording)

---

## 5. Still needed from you (facts, not wording)

- **Person `sameAs`**: your LinkedIn profile URL, your Companies House officer page URL, and any other public profiles (GitHub, etc.). The company's Companies House page is already linked from the Organization.
- **Search Console and Bing verification codes**, or tell me you'll verify through DNS instead and I'll remove the two meta tags.
- **Pricing for Capstone and Ask Atlas**, if you're happy to publish it. Google only shows SoftwareApplication rich results when there's a price (`offers`) or ratings. Without it the markup is valid, just not eligible for the rich result.
