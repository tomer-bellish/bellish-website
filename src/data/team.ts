// The people on the Studio page, in the order it shows them. The "Team members" number on that page is the
// length of this list. Alfi (the studio dog) has his own card on the page and is not counted.
// To add someone: add an entry here; with a portrait, put a 900×1125 .webp in public/assets/ and name it in `photo`.

export interface Member {
  /** Lowercase display name, e.g. 'tomer bellish'. */
  name: string;
  role: string;
  /** Portrait file in public/assets/. Omit to show the placeholder. */
  photo?: string;
}

export const team: Member[] = [
  { name: 'tomer bellish', role: 'Founder & Architect', photo: 'team-tomer-bellish.webp' },
  { name: 'jenine bellish', role: 'Founder & Urban Planner', photo: 'team-jenine-bellish.webp' },
  { name: 'carmit ezra', role: 'Architecture Practical Engineer' },
  { name: 'adi sabo', role: 'Architecture Practical Engineer' },
  { name: 'yarden ben hamo', role: 'Architecture Practical Engineer' },
  { name: 'efrat yakuti', role: 'Architecture Practical Engineer', photo: 'team-efrat-yakuti.webp' },
  { name: 'hadar hatav', role: 'Architecture Practical Engineer' },
  { name: 'eitan shalom', role: 'Architecture Practical Engineer' },
  { name: 'gil amsalem', role: 'Financial Manager' },
];

/** 'tomer bellish' → 'Tomer Bellish' (portrait alt text). */
export const properName = (name: string) => name.replace(/\b\w/g, (c) => c.toUpperCase());
