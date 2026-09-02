/**
 * Hand-built JSON-LD fixtures matching the shape jobs.ch and jobup.ch actually
 * serve (captured from live pages, then trimmed). Tests run fully offline.
 */

function ldScript(payload: unknown): string {
  return `<script type="application/ld+json">${JSON.stringify(payload)}</script>`
}

export function searchPageHtml(
  options: { title?: string; items?: unknown[]; extraScripts?: string } = {},
): string {
  const title = options.title ?? "110 Python jobs in Zurich - jobs.ch"
  const items = options.items ?? [SEARCH_ITEM_FULL, SEARCH_ITEM_SPARSE]
  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item,
    })),
  }
  return [
    "<html><head>",
    `<title>${title}</title>`,
    // The real page ships WebSite/CollectionPage/BreadcrumbList in the same
    // array as the ItemList, so the parser must select by @type, not by index.
    ldScript([
      { "@context": "https://schema.org", "@type": "WebSite", name: "jobs.ch" },
      { "@context": "https://schema.org", "@type": "CollectionPage", name: "Python jobs" },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [] },
      list,
    ]),
    options.extraScripts ?? "",
    "</head><body></body></html>",
  ].join("\n")
}

export const SEARCH_ITEM_FULL = {
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: "Senior AI Machine Learning Engineer 100% (f/m/d)",
  description: "We are looking for a Senior AI Machine Learning Engineer.",
  identifier: {
    "@type": "PropertyValue",
    name: "jobs.ch",
    value: "4fb22d9e-9326-4f87-b5f9-4289c8b414a6",
  },
  datePosted: "2026-08-27T17:17:49+02:00",
  employmentType: "Permanent position",
  hiringOrganization: {
    "@type": "Organization",
    name: "UBS Card Center AG",
    sameAs: "https://www.jobs.ch/en/companies/fae27eab-ubs-card-center-ag/",
  },
  jobLocation: {
    "@type": "Place",
    address: { "@type": "PostalAddress", addressLocality: "Glattbrugg", addressCountry: "CH" },
  },
  url: "https://www.jobs.ch/en/vacancies/detail/4fb22d9e-9326-4f87-b5f9-4289c8b414a6/",
}

/** A card with no locality and no identifier - both occur on live result pages. */
export const SEARCH_ITEM_SPARSE = {
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: "Senior ServiceNow AI Engineer",
  datePosted: "2026-08-24T10:44:38+02:00",
  hiringOrganization: { "@type": "Organization", name: "Finders SA" },
  jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressCountry: "CH" } },
  url: "https://www.jobs.ch/en/vacancies/detail/1411661d-f16c-4668-93d3-e31b7799b499/",
}

export const DETAIL_POSTING = {
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: "AI Engineer",
  description:
    "<p><strong>Your role</strong></p><ul><li>Build RAG systems</li><li>Ship to production</li></ul><p>Apply now &amp; join us.</p>",
  identifier: { "@type": "PropertyValue", name: "Job ID", value: "53999177-f686-41e2-854b-2acefbfc8c19" },
  url: "https://www.jobs.ch/en/vacancies/detail/53999177-f686-41e2-854b-2acefbfc8c19/",
  datePosted: "2026-08-31T05:02:25+02:00",
  jobStartDate: "2026-09-30T05:02:25.000Z",
  hiringOrganization: {
    "@type": "Organization",
    name: "ti&m AG",
    sameAs: "https://www.ti8m.ch/",
  },
  employerOverview: "ti&m is a Swiss digitization company founded in 2005.",
  employmentType: "Permanent position",
  workHours: "42 - 42 hours/week",
  potentialAction: {
    "@type": "ApplyAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate:
        "https://www.jobs.ch/en/vacancies/detail/53999177-f686-41e2-854b-2acefbfc8c19/apply",
    },
  },
  jobLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Buckhauserstrasse 24",
      addressRegion: "Zürich",
      postalCode: "8047",
      addressCountry: "CH",
    },
  },
  occupationalCategory: { "@type": "CategoryCode", codeValue: "98", name: "Information Technology" },
  // The live shape when no salary is disclosed: the node exists, the value is empty.
  baseSalary: { "@type": "MonetaryAmount", currency: "CHF", value: { "@type": "QuantitativeValue" } },
}

export function detailPageHtml(posting: unknown = DETAIL_POSTING): string {
  return [
    "<html><head><title>AI Engineer - jobs.ch</title>",
    ldScript({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [] }),
    ldScript(posting),
    "</head><body></body></html>",
  ].join("\n")
}
