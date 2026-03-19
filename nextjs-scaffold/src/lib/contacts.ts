export interface Contact {
  id: string;
  fname: string;
  lname: string;
  company: string;
  title: string;
  email: string;
  status: 'pending' | 'approached' | 'conversation' | 'sent';
  notes: string;
  category?: string;
}

export const LEGAL_CONTACTS: Contact[] = [
  {
    id: 'legal-1',
    fname: 'T.',
    lname: 'Dean',
    company: 'Attorney For Cannabis',
    title: 'Cannabis Attorney',
    email: 'tdean@attorneyforcannabis.com',
    status: 'pending',
    notes: 'Specialized Cannabis attorney in Phoenix. Prime vendor partner to refer CHIT treasury solutions to his dispensary clients.'
  },
  {
    id: 'legal-2',
    fname: 'Unknown',
    lname: 'Contact',
    company: 'RSN Law - Rutila, Seibt & Nash PLLC',
    title: 'Legal Counsel',
    email: 'contact@rsnlawaz.com',
    status: 'pending',
    notes: 'Cannabis licensing and compliance law firm. Strong strategic partner for mapping regulatory frameworks for CHIT coin.'
  },
  {
    id: 'legal-3',
    fname: 'Donald W.',
    lname: 'Hudspeth',
    company: 'The Law Offices of Donald W. Hudspeth, P.C.',
    title: 'Business Law Expert',
    email: 'dhudspeth@azbuslaw.com',
    status: 'pending',
    notes: 'Healthcare business law expert advising on med spa and peptide clinic compliance.'
  },
  {
    id: 'legal-4',
    fname: 'Unknown',
    lname: 'Contact',
    company: 'ARTEMiS Law Firm',
    title: 'Attorney',
    email: 'info@artemislawfirm.com',
    status: 'pending',
    notes: 'Law firm specializing in business and litigation.'
  },
  {
    id: 'legal-5',
    fname: 'Principal Partner',
    lname: '[Emerge Law Group]',
    company: 'Emerge Law Group',
    title: 'Principal Partner',
    email: 'adminstaff@emergelawgroup.com',
    status: 'pending',
    notes: 'Cannabis and Psychedelics Law firm.'
  },
  {
    id: 'legal-6',
    fname: 'Principal Partner',
    lname: '[Feldman Legal Advisors]',
    company: 'Feldman Legal Advisors',
    title: 'Principal Partner',
    email: 'cbarnes@feldmanlegaladvisors.com',
    status: 'pending',
    notes: 'Psychedelics Corporate Law experts.'
  },
  {
    id: 'legal-7',
    fname: 'Brett',
    lname: 'Gelfand',
    company: 'CannaBIZ Collects',
    title: 'Partner',
    email: 'info@cannabizcollects.com',
    status: 'pending',
    notes: 'Cannabis-focused collections and legal services.'
  },
  {
    id: 'legal-8',
    fname: 'Unknown',
    lname: 'Contact',
    company: 'Vicente Sederberg LLP',
    title: 'Partner',
    email: '',
    status: 'pending',
    notes: 'Leading national cannabis law firm.'
  },
  {
    id: 'legal-9',
    fname: 'Unknown',
    lname: 'Contact',
    company: 'Greenspoon Marder LLP',
    title: 'Attorney',
    email: '',
    status: 'pending',
    notes: 'Full-service law firm with strong cannabis practice.'
  },
  {
    id: 'legal-10',
    fname: 'Unknown',
    lname: 'Contact',
    company: 'Canna Legal Solutions',
    title: 'Legal Advisor',
    email: '',
    status: 'pending',
    notes: 'Cannabis-specific legal advisory.'
  },
  {
    id: 'legal-11',
    fname: 'Unknown',
    lname: 'Contact',
    company: 'Arizona Cannabis Law Group',
    title: 'Attorney',
    email: '',
    status: 'pending',
    notes: 'Arizona-based cannabis law specialists.'
  }
];

export const ONLI_SIGNATURE = `
Best regards,

The ONLI Team
onli.com | info@onli.com
`;

export const TEMPLATES = {
  onli_intro: {
    subject: "ONLI — Unlocking a New Channel for {company}",
    body: `Hi {first_name},

I wanted to reach out because I think ONLI could be a strong fit for {company}.

ONLI is a next-generation marketing platform built to help companies like yours reach high-intent audiences more efficiently — with AI-personalized outreach, real-time analytics, and seamless campaign management all in one place.

We're seeing tremendous results for our early partners: on average, 3× more responses than traditional cold outreach and a 40% reduction in cost per acquisition.

Would it make sense to set aside 15 minutes this week to see if there's a fit?

Looking forward to connecting,
[Your Name]
ONLI | [your@email.com]`
  },
  onli_followup: {
    subject: "Circling back — ONLI x {company}",
    body: `Hi {first_name},

Just circling back on my note from earlier.

I know inboxes get full, so I'll be brief: ONLI helps teams like {company} run smarter outreach campaigns with significantly less overhead. We handle the personalization, timing, and analytics — you handle the relationships.

If you're evaluating your marketing stack at any point this quarter, I'd love to be on your radar. Happy to send over a quick overview if that's helpful.

Best,
[Your Name]
ONLI | [your@email.com]`
  }
};
