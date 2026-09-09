# PAK BILL — Pakistan Electricity Bill Checker

A professional, responsive static website for navigating users to official electricity bill portals.

## Files
- index.html — page structure
- styles.css — responsive professional UI
- script.js — company list, validation, saved number, calculator and bill links

## Run locally
Double-click `index.html`, or use a local server:

```bash
python -m http.server 5500
```

Then open http://localhost:5500

## Free hosting
Upload these three files to GitHub Pages, Cloudflare Pages, or another static host.

## Important
This frontend does not scrape or copy bills. For Reference Number lookups it opens the relevant PITC company URL:
https://bill.pitc.com.pk/

Customer ID mode opens the official company page because the exact query parameter/form flow can vary by company. The user then selects Customer ID on the official page.

K-Electric is handled separately because it uses its own official billing system.

Before commercial launch:
1. Verify each company slug/URL against the live official portal.
2. Add your own domain and analytics only after writing a proper privacy policy.
3. Do not store reference numbers on your server unless necessary and clearly disclosed.
4. If you later add a backend/API, obtain permission and follow the source provider's terms/rate limits.
