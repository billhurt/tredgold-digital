# Search and AI visibility plan

**Goal:** when a specialist contractor in Leeds or Yorkshire (civils, roofing and cladding, landscaping and grounds maintenance) looks for bespoke software, AI or automation, Google, Bing and AI assistants point to tredgolddigital.com.

**Scope:** Yorkshire first. "Working across the UK" stays on the site, but no pages target UK-wide searches. Aviation is out of scope; it belongs on flyatlas.app.

This is a proposal only. No page copy is written here: headings below describe what each section covers, and the wording goes through `copy-proposals.md` when a page is built.

---

## 1. Where things stand

- The site is technically sound: fast (Lighthouse mobile 99), every page has structured data, the canonical URLs are clean, and crawlers are welcome.
- **The gap is content.** The visible text never names a trade or Yorkshire (only "Based in Leeds"). A firm searching "software for landscaping companies Leeds" has nothing on the site to match. Everything below fixes that.
- **There's no search data yet.** These phrases are judgement calls, not keyword-tool numbers. Local B2B searches are small, often under 50 a month each, and the long tail matters more than any one phrase. Once Search Console has 8 to 12 weeks of data, re-rank this list using the queries that actually bring impressions.

---

## 2. Target searches (18), grouped by intent

The **Page** column is the page that should rank. Pages marked *new* are outlined in section 3.

### A. Looking for a supplier, local (highest value)
| # | Search | Page |
|---|---|---|
| 1 | bespoke software developer Leeds | Home |
| 2 | software development company Leeds for contractors | Home |
| 3 | business process automation Leeds | Home |
| 4 | AI automation consultant Leeds | Home, then How we work (*new*) |
| 5 | bespoke software developer Yorkshire construction | Civils (*new*) |

### B. Looking for a solution in their trade
| # | Search | Page |
|---|---|---|
| 6 | software for landscaping companies Leeds | Landscaping & grounds maintenance (*new*) |
| 7 | grounds maintenance job management software Yorkshire | Landscaping & grounds maintenance (*new*), linking to Capstone |
| 8 | automate job management grounds maintenance | Landscaping & grounds maintenance (*new*) |
| 9 | software for civil engineering contractors Yorkshire | Civils (*new*) |
| 10 | AI automation for roofing contractors | Roofing & cladding (*new*) |
| 11 | roofing contractor job management software Yorkshire | Roofing & cladding (*new*) |
| 12 | cladding contractor software bespoke | Roofing & cladding (*new*) |

### C. Problem-aware (they know the pain, not the fix)
| # | Search | Page |
|---|---|---|
| 13 | replace spreadsheets with software construction company | Civils (*new*); also supports Home |
| 14 | track CSCS cards and CHAS renewals automatically | Civils (*new*) |
| 15 | digital timesheets for landscaping crews | Landscaping & grounds maintenance (*new*) |
| 16 | automate quotes and invoices roofing | Roofing & cladding (*new*) |

### D. Checking us out (proof and process)
| # | Search | Page |
|---|---|---|
| 17 | how much does bespoke software cost UK small business | How we work (*new*); this is the one UK-wide phrase, because it's the question people ask straight after a local one |
| 18 | Tredgold Digital / Tredgold Digital reviews | Home, plus the Google Business Profile (see `offsite.md`) |

Searches 7 to 12 are mostly typed without a place name. Each sector page will still rank on its own, but the Yorkshire angle (named areas, local case studies, the Leeds base) is what lets it beat national software vendors for nearby searchers. That's the reason for not building UK-wide pages.

---

## 3. New pages (outlines only)

### URL scheme
| Page | URL |
|---|---|
| Civils sector | `/civils-contractors` |
| Roofing & cladding sector | `/roofing-cladding-contractors` |
| Landscaping & grounds maintenance sector | `/landscaping-grounds-maintenance` |
| Case studies | `/work/clumber-construction`, `/work/jrw-garden-services`, `/work/penleigh-international` |
| Work index | `/work` (the nav item "Work" moves here once there are case studies) |
| How we work | `/how-we-work` |

Each new page gets: one H1, a unique title and meta description, a canonical URL, a sitemap entry, a BreadcrumbList, a WebPage node, and the shared nav, footer and grain. Pages with real questions answered on the page also get FAQPage markup.

### 3.1 Sector pages (one template, three pages)
**Sections, in order:**
1. **H1 and intro:** names the trade and the area.
2. **"What slows [trade] firms down":** 3 or 4 problems specific to that trade (see the topic lists below), using the problem-section layout from the homepage.
3. **What we build for them:** 3 or 4 examples, each linked to the service it belongs to.
4. **Proof:** the relevant case study tile, plus Capstone on the landscaping page.
5. **How we work:** a short version of the five stages, linking to `/how-we-work`.
6. **Questions:** 4 to 6 real questions a firm in that trade asks, answered on the page (FAQPage markup).
7. **Contact CTA:** links to `/#contact`. Later this can pre-fill the trade.

**Topics per trade** (to choose from; you'll know which are true for your clients):
| Civils | Roofing & cladding | Landscaping & grounds maintenance |
|---|---|---|
| Pre-start packs, RAMS, permits | Surveys and photos to quotes | Quotes from enquiry and photos |
| CSCS / CPCS / NPORS card tracking | Working-at-height and compliance records | Recurring maintenance schedules and rounds |
| CHAS, SMAS, Constructionline renewals | O&M / handover packs, warranties | Weather rescheduling |
| Daywork sheets, timesheets, plant | Subcontractor coordination | Crew timesheets, invoicing (Capstone) |
| Reporting to main contractors | Chasing payments and retentions | Client reports with before/after photos |

**Target searches:** civils #5, 9, 13, 14; roofing #10, 11, 12, 16; landscaping #6, 7, 8, 15.

**Facts needed from you:** which problems you've actually solved in each trade; any numbers (hours saved, enquiries handled); and whether you have permission to name clients on each page.

### 3.2 Case study pages (one template, three pages)
**Sections:**
1. **H1:** client name and what was achieved, in one line.
2. **At a glance:** trade, location, what we built, timescale, and the result in one line.
3. **The problem:** how things ran before. Tools, hours, the risk.
4. **What we built:** the system, and how the discovery session shaped it.
5. **The outcome:** measurable where possible (hours a week, response time, renewals missed, leads).
6. **In their words:** a quote, with name, role and permission.
7. **Related:** link to the sector page, `/how-we-work`, and the contact CTA.

**Markup:** WebPage + BreadcrumbList (Home › Work › Client). Add a `Review` only if the client gives a written review that's shown on the page. Google doesn't show review stars for a business's reviews of itself, so don't expect stars.

| Case study | What it covers | Supports | Target search | Facts still needed |
|---|---|---|---|---|
| **Clumber Construction** (construction) | Training matrix and certificate tracking; H&S accreditation support; fleet tracking; takeoffs; pre-start packs | Civils sector page | bespoke software developer Yorkshire construction; track CSCS cards and CHAS renewals automatically (#5, #13, #14) | Location and trade mix; what they used before; which accreditations; hours or errors saved; renewals no longer missed; quote; permission to name; logo use |
| **JRW Garden Services** (landscaping) | Consultancy: website rebuild, GA4/GTM, Google Ads, PQS accreditation, setting up commercial subcontracting. **This work led to Capstone.** | Landscaping & grounds maintenance sector page, linking to /products (Capstone) | software for landscaping companies Leeds (#6); also supports #7 and #8 through the Capstone link | Location; before and after (enquiries, ad results, commercial work won); which PQS; how it led to Capstone; quote from Jack; permission |
| **Penleigh International** (executive search, oil and gas) | Web design and online visibility | **No sector page.** Use as a credibility and web design example on `/work` only | None of the contractor searches; brand and proof only | What you built; results (enquiries, visibility); quote; permission |

Clumber's work maps closely onto the civils topic list (pre-start packs, card tracking, accreditation renewals), so the civils page can lead with it. JRW's story, from consultancy to a product, is the strongest proof for the landscaping page. Keep Penleigh off the contractor pages so that the sector pages stay focused on contractors.

**Visible copy check:** the homepage client card now credits certification tracking to the construction client and the website rebuild, Google Ads and accreditation support to the landscaping client (updated 18 November 2026, with your wording).

### 3.3 How we work / discovery session (`/how-we-work`)
**Sections:**
1. **H1 and intro:** what a discovery session is and who it's for.
2. **What happens in the session:** who attends, on site or call, how long, what you look at.
3. **What you get afterwards:** the written plan (scope, cost, timeline) and sign-off.
4. **The five stages:** the homepage stages in full, with the stage drawings.
5. **What it costs and how long builds take:** ranges if you're willing to publish them. This answers search #17 and is the most-asked question on any bespoke-software page.
6. **Questions:** real Q&As (FAQPage), e.g. ownership of the code, support after launch, working with existing systems.
7. **Contact CTA.**

**Target searches:** #4, #17. It also supports every sector page.
**Facts needed:** session length, price (free or paid), typical build ranges, support terms, who owns the code.

### 3.4 Leeds and Yorkshire area page: not recommended for now
With one base and no local differences in what you offer, an area page would repeat the homepage, and Google treats thin location pages as doorway pages. Location signals work better spread across real content:
- named areas in the sector pages and case studies (wherever clients are)
- the ProfessionalService `areaServed` (already done)
- the Google Business Profile service areas

**Revisit if:** Search Console shows location searches ("… Leeds", "… York", "… Sheffield") landing on the homepage with low click-through, or you start doing a lot of on-site work in one town.

---

## 4. Internal linking

```
Home ──► each sector page   (from the trades line in the problem section, and the footer)
 │  ──► /how-we-work        (from the hero "See how it works" and the How we work section)
 │  ──► /work and each case study (from the Work section)
 │  ──► /products
Sector page ──► its case study(ies) ──► back to the sector page
Sector page ──► /how-we-work ──► /#contact
Sector page ──► the other two sector pages ("Also work with …")
Landscaping sector page ◄──► /products (Capstone)
Case study ──► its sector page, /how-we-work, /#contact
/how-we-work ──► all three sector pages, /work
Footer (every page): the three sector pages, /work, /how-we-work, /products, /privacy
```

Rules:
- Every page is reachable from the homepage in two clicks.
- Link text names the destination ("landscaping and grounds maintenance software", not "click here").
- Add each new page to `sitemap.xml` and `llms.txt`, and update its `lastmod` when the content changes.

---

## 5. AI assistants (ChatGPT, Claude, Perplexity, Gemini, Copilot)

They answer from what they've crawled and from search indexes (Bing matters as well as Google). What gets a business named:
1. **Consistent facts everywhere**: name, what you do, who for, where. The site, LinkedIn, Google Business Profile, Companies House and directories all need to agree (`offsite.md` §5).
2. **Other sites mentioning you**: directories, trade bodies, client websites and trade press. These count for more than anything on your own site.
3. **Clear, specific pages**: sector pages and case studies that answer "who does bespoke software for roofers in Yorkshire" in plain words.
4. **Machine-readable summaries**: llms.txt and structured data (done on this branch; the wording is waiting on approval).

---

## 6. Order of work

1. Approve `copy-proposals.md`, then merge this branch.
2. Off-site quick wins: Search Console, Bing, Google Business Profile, reviews (`offsite.md`).
3. Gather the case study facts and quotes.
4. Build the landscaping sector page and the JRW case study first (the consultancy that led to Capstone gives that page the strongest proof). Then civils + Clumber, then roofing & cladding (which has no case study yet). Add Penleigh to `/work` as a web design example.
5. Build `/how-we-work`.
6. After 8 to 12 weeks of Search Console data, revisit section 2 and the area-page decision.
