// Open positions on /career/. The list, the "N roles · updated <month>" line, the form's Position options and the
// page description all come from here — to change roles, edit this list only.
// "updated" is the month the site was built; deploy.yml rebuilds the site on the 1st of every month to keep it current.

export interface Job {
  /** Role name as it appears in the form's Position list, e.g. 'Interior Designer'. The list shows it lowercase. */
  title: string;
  type: 'Full-time' | 'Part-time';
  /** 'Tiberias' or 'Tel Aviv' (the Glilot office, on the Tel Aviv border; its address is Ramat HaSharon). */
  office: string;
}

export const jobs: Job[] = [
  { title: 'Architect', type: 'Full-time', office: 'Tel Aviv' },
  { title: 'Interior Designer', type: 'Full-time', office: 'Tel Aviv' },
  { title: 'Urban Planner', type: 'Full-time', office: 'Tiberias' },
];

/** The build month in Israel time, e.g. 'October 2026'. */
export const updatedMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'Asia/Jerusalem' });

const names = jobs.map((j) => j.title.toLowerCase());
const list = names.length > 2 ? `${names.slice(0, -1).join(', ')}, and ${names.at(-1)}` : names.join(' and ');

export const careerDescription = jobs.length
  ? `Open positions at Bellish Architects — ${list}. Join a young, growing studio.`
  : 'Careers at Bellish Architects: no open positions right now, but open applications are always welcome. Join a young, growing studio.';
