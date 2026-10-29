// All projects, in the order the site lists them. The "next project" link follows this order and wraps around.
// Image names are files in public/assets/; "-800" variants are expected next to every .webp for srcset.
// To add a project: add an entry here (first image = hero), add its images to public/assets/, done —
// the project page, projects grid, ItemList, breadcrumbs and sitemap all come from this list.

export type Status = 'Idea' | 'In Progress' | 'Construction' | 'Complete';

export interface Project {
  slug: string;
  /** Lowercase display title, e.g. 'kv house'. */
  title: string;
  /** '<Category> — <Region>' line above the title; the region also goes into the page <title>. */
  eyebrow: string;
  type: 'Private Houses' | 'Residential' | 'Offices' | 'Hospitality';
  status: Status;
  year: string;
  size: string;
  plot?: string;
  /** Full location on the project page. */
  location: string;
  /** Short location on the projects grid. Defaults to location without ', Israel'. */
  place?: string;
  client: string;
  para1: string;
  para2: string;
  para3: string;
  hero: string;
  gallery: string[];
  credits: { team: string; collaborators: string; render: string };
  /** false = photography not ready; the page shows a placeholder instead of the case study. */
  full?: boolean;
}

export const projects: Project[] = [
  {
    slug: "b-house",
    title: "b house",
    eyebrow: "Private Houses — Kefar Tavor",
    type: "Private Houses",
    status: "Construction",
    year: "2025",
    size: "500 m²",
    plot: "1,200 m²",
    location: "Kefar Tavor, Israel",
    client: "Private",
    para1: "Set in the serene landscape of Kefar Tavor, overlooking the iconic silhouette of Mount Tabor, this one-level residential compound was designed as a harmonious retreat for a family across generations.",
    para2: "The project comprises two distinct yet connected homes — one for the parents, the other for their son — thoughtfully arranged to foster closeness while preserving privacy. A tranquil reflecting pool welcomes visitors at the entrance, leading into a flowing interior that opens toward the surrounding landscape.",
    para3: "The design balances modern clarity with subtle classical elements: custom mashrabiya screens, expansive glass walls, and soft transitions between indoors and out — a residence that captures both the calm of its rural setting and the enduring bonds of family.",
    hero: "b-house-hero-1920.webp",
    gallery: ["b-house-01.webp", "b-house-02.webp", "b-house-03.webp", "b-house-04.webp", "b-house-05.webp", "b-house-06.webp", "b-house-07.webp", "b-house-08.webp"],
    credits: { team: "Tomer Bellish, Efrat Yakuti", collaborators: "Nitzan Horovitz Interior Design · Mohr-Avidan Landscape Architects", render: "PB3DVIS" },
  },
  {
    slug: "lili-house",
    title: "lili house",
    eyebrow: "Residential — Tiberias",
    type: "Residential",
    status: "In Progress",
    year: "2025",
    size: "8,500 m²",
    plot: "2,000 m²",
    location: "Tiberias, Israel",
    client: "Private",
    para1: "In the heart of Tiberias' central residential district, a new development is set to redefine the city's urban skyline. Comprising two luxury buildings with 53 residential units, the project rises on a plot long occupied by the family home of the developer's parents — a site rich with memory, now reimagined for the future.",
    para2: "Designed to become a local landmark, the buildings introduce a new standard of refinement to the area, marked by clean lines, high-end materiality, and a quiet architectural confidence. Each structure is shaped not only by function, but by a deep respect for context — a place where personal heritage meets contemporary living.",
    para3: "The project explores two distinct design alternatives, both rooted in the same ambition: to create buildings that do more than house residents — they anchor a new narrative for the city around them.",
    hero: "lili-house-hero-1920.webp",
    gallery: ["lili-house-01-1920.webp", "lili-house-02.webp", "lili-house-03.webp", "lili-house-04.webp", "lili-house-05.webp", "lili-house-06.webp", "lili-house-07.webp"],
    credits: { team: "Tomer Bellish, Efrat Yakuti, Mor Avitan", collaborators: "—", render: "PB3DVIS" },
  },
  {
    slug: "inside-out-house",
    title: "inside/out house",
    eyebrow: "Private Houses — Sea of Galilee",
    type: "Private Houses",
    status: "In Progress",
    year: "2026",
    size: "350 m²",
    plot: "750 m²",
    location: "Sea of Galilee, Israel",
    client: "Private",
    para1: "Set on a generous plot along the shores of the Sea of Galilee, this private residence was designed as a quiet dialogue between architecture, landscape, and water.",
    para2: "The house opens itself toward the surrounding nature, creating a continuous relationship between interior and exterior, built space and open view. Large openings, shaded outdoor areas, and transitional spaces blur the boundary between inside and outside, allowing the changing light, breeze, and horizon to become part of the daily living experience. At the heart of the project is a sense of openness — not only through expansive views, but through spaces that exist in between: covered terraces, open living areas, and moments of pause that connect the home to the landscape around it.",
    para3: "An infinity pool extends the architectural line toward the Sea of Galilee, reflecting the sky and amplifying the feeling of calm, depth, and endless horizon. The result is a private home that feels both grounded and open — a refined living environment shaped by nature, view, and the timeless presence of the lake.",
    hero: "insideout-hero-1920.webp",
    gallery: ["insideout-01.webp", "insideout-02.webp", "insideout-03.webp", "insideout-04.webp", "insideout-05.webp", "insideout-06.webp", "insideout-07.webp", "insideout-08.webp", "insideout-09.webp"],
    credits: { team: "Tomer Bellish, Efrat Yakuti, Mor Avitan", collaborators: "—", render: "PB3DVIS" },
  },
  {
    slug: "g-hotel",
    title: "g hotel",
    eyebrow: "Hospitality — Tiberias",
    type: "Hospitality",
    status: "Idea",
    year: "2025",
    size: "2,700 m²",
    plot: "800 m²",
    location: "Tiberias, Israel",
    client: "Private",
    para1: "Set within one of Tiberias' most historic buildings, this boutique hotel reimagines heritage as hospitality. Located in a prime urban setting, the project transforms a preserved architectural gem into a refined and intimate hospitality experience — where past and present meet with quiet elegance.",
    para2: "The hotel includes 40 rooms in a variety of sizes and layouts, offering guests a range of tailored experiences — from compact urban retreats to expansive suites that reflect the character of the original structure. The design preserves the spirit of the building while introducing contemporary interventions through a curated palette of local stone, natural textures, and custom detailing.",
    para3: "More than a hotel, the project offers a narrative: of Tiberias as a city with layers, depth, and timeless appeal — now revealed through architecture that invites guests to experience history from the inside out.",
    hero: "g-hotel-hero-1920.webp",
    gallery: ["g-hotel-01.webp", "g-hotel-02.webp", "g-hotel-03.webp", "g-hotel-04.webp", "g-hotel-05.webp", "g-hotel-06.webp", "g-hotel-07.webp"],
    credits: { team: "Tomer Bellish, Efrat Yakuti, Yarden Ben Hamo", collaborators: "—", render: "PB3DVIS" },
  },
  {
    slug: "p-office",
    title: "p office",
    eyebrow: "Commercial — Tiberias",
    type: "Offices",
    status: "In Progress",
    year: "2023",
    size: "1,100 m²",
    plot: "900 m²",
    location: "Alhadif St, Tiberias",
    place: "Tiberias",
    client: "Private",
    para1: "Located along the main urban axis of Tiberias, this new commercial and office building on Alhadif Street was designed to revitalize the city's historic center and support its evolving economic landscape.",
    para2: "An open and inviting ground floor dedicated to retail encourages pedestrian movement and strengthens the connection between the public realm and the interior. The upper levels house flexible, well-lit office spaces tailored to the contemporary work environment of a city in renewal.",
    para3: "Architecturally, the project balances clean, modern lines with locally inspired materials — a contemporary expression that respects the surrounding fabric while signaling progress and transformation.",
    hero: "p-office-hero-1920.webp",
    gallery: ["p-office-01.webp", "p-office-02.webp", "p-office-03.webp", "p-office-04.webp", "p-office-05.webp", "p-office-06.webp"],
    credits: { team: "Tomer Bellish, Efrat Yakuti", collaborators: "—", render: "PB3DVIS" },
  },
  {
    slug: "the-concrete-box",
    title: "the concrete box",
    eyebrow: "Private Houses — Ramat HaSharon",
    type: "Private Houses",
    status: "In Progress",
    year: "2026",
    size: "330 m²",
    plot: "330 m²",
    location: "Ramat HaSharon, Israel",
    client: "Private",
    para1: "Set on a compact 330 sqm semi-detached plot, this residence explores how architectural precision can transform limitation into strength.",
    para2: "Conceived as a monolithic home built entirely in exposed concrete, the project embraces material honesty, clean proportions, and a restrained architectural language. Within a narrow and challenging site, every line, opening, and transition was carefully considered to create a sense of depth, privacy, and calm.",
    para3: "The exposed concrete becomes more than a material — it defines the atmosphere of the house: raw yet refined, powerful yet quiet, sculptural yet deeply functional. The result is a compact home with a strong architectural presence, where simplicity, texture, and precision come together to create a timeless living experience.",
    hero: "concrete-box-01.webp",
    gallery: ["concrete-box-02.webp", "concrete-box-hero-1920.webp", "concrete-box-03.webp", "concrete-box-04.webp", "concrete-box-05.webp", "concrete-box-06.webp", "concrete-box-07.webp"],
    credits: { team: "Tomer Bellish, Hadar Hatav, Mor Avitan", collaborators: "—", render: "PB3DVIS" },
  },
  {
    slug: "pg-house",
    title: "pg house",
    eyebrow: "Private Houses — Poriya",
    type: "Private Houses",
    status: "Construction",
    year: "2023",
    size: "230 m²",
    plot: "750 m²",
    location: "Poriya, Israel",
    client: "Private",
    para1: "In the blooming hills of Poriya, this home was designed for a young couple at the beginning of their journey — a couple with a passion for hosting, open spaces, and a lifestyle that blends natural tranquility with social energy.",
    para2: "Set on a plot overlooking the Yavne'el ridge, the house unfolds around an active central courtyard, envisioned as the heart of daily life and social gatherings. The kitchen, dining area, and living room merge into one continuous space that flows seamlessly into the outdoors.",
    para3: "The design embraces clean lines, warm materials, and natural textures — a minimalist yet welcoming aesthetic that honors the simplicity of beginnings while leaving room for future growth.",
    hero: "pg-house-hero.webp",
    gallery: ["pg-house-01.webp", "pg-house-02.webp", "pg-house-03.webp"],
    credits: { team: "Tomer Bellish, Efrat Yakuti", collaborators: "—", render: "PB3DVIS" },
  },
  {
    slug: "h-house",
    title: "h house",
    eyebrow: "Private Houses — Jordan Valley",
    type: "Private Houses",
    status: "Complete",
    year: "2024",
    size: "240 m²",
    plot: "500 m²",
    location: "Ashdot Yaakov, Israel",
    client: "Private",
    para1: "Set against the wide, open landscape of the Jordan Valley, on the edge of Kibbutz Ashdot Yaakov, this home was designed for a family seeking the calm of rural life — in a house that reflects modern values, openness, and thoughtful living.",
    para2: "Rather than standing apart, the home integrates gently into its surroundings, becoming a natural extension of the local fabric. Large openings frame views of the valley's fields, drawing nature inward and creating a seamless connection between kibbutz life and contemporary private living.",
    para3: "The design is defined by clean, simple lines and natural local materials, with a careful spatial arrangement that balances public and private zones — supporting daily family life while allowing space for privacy, reflection, and effortless hospitality.",
    hero: "h-house-hero-1920.webp",
    gallery: ["h-house-01.webp", "h-house-02.webp", "h-house-03.webp", "h-house-04.webp", "h-house-05.webp", "h-house-06.webp", "h-house-07.webp", "h-house-08.webp", "h-house-09.webp", "h-house-10.webp", "h-house-11.webp", "h-house-12.webp", "h-house-13.webp", "h-house-14.webp", "h-house-15.webp", "h-house-16.webp"],
    credits: { team: "Tomer Bellish, Efrat Yakuti", collaborators: "Meytal Cohen Interior Design", render: "PB3DVIS" },
  },
  {
    slug: "kv-house",
    title: "kv house",
    eyebrow: "Private Houses — Sea of Galilee",
    type: "Private Houses",
    status: "Complete",
    year: "2022",
    size: "270 m²",
    plot: "750 m²",
    location: "Sea of Galilee, Israel",
    client: "Private",
    para1: "Nestled among palm trees and the tranquil atmosphere of Kinneret Moshava, this private home was designed as a luxurious retreat — a place to slow down, breathe deeply, and savor the moment.",
    para2: "Each room in the house functions as a self-contained suite, offering privacy, comfort, and a sense of escape from the everyday. At its heart lies a vibrant and expansive communal space — the social core of the home — opening out to the landscape through large glass facades that blur the boundary between indoors and out, bringing the Kinneret into the living experience.",
    para3: "The architectural language emphasizes a complete sense of presence: seamless flooring, natural materials, and soft daylight guiding the space throughout the day — balancing intimate moments with open freedom, and understated luxury with effortless hospitality.",
    hero: "kv-house-hero-1920.webp",
    gallery: ["kv-house-01.webp", "kv-house-02.webp", "kv-house-03.webp", "kv-house-04.webp"],
    credits: { team: "Tomer Bellish, Efrat Yakuti", collaborators: "—", render: "PB3DVIS" },
  },
  {
    slug: "ak-house",
    title: "ak house",
    eyebrow: "Private Houses — Poriya",
    type: "Private Houses",
    status: "In Progress",
    year: "2026",
    size: "240 m²",
    plot: "600 m²",
    location: "Poriya, Israel",
    client: "Private",
    para1: "On the slopes of the Poriya ridge, this home was designed for a young family drawn to the quiet of the hillside and the openness of the view. The plot falls steeply toward the Sea of Galilee, and its demanding topography became the starting point of the design rather than an obstacle to be flattened away.",
    para2: "The house steps with the land, letting each level find its own relationship to the slope and to the water below. Its front elevation is defined by two deep pergolas that fold into one another, tracing the form of an “S” across the facade. More than a gesture, the move stitches the two floors into one continuous composition — shading the interiors through the long Galilee summer, framing the view into measured horizontal bands, and softening the mass of the building as it reads from the road.",
    para3: "Inside, the living spaces open fully onto the terraces, blurring the line between sheltered and open. A restrained palette of pale concrete, warm timber, and slender metal profiles keeps the architecture quiet — leaving the landscape, and the shifting shadows the pergolas cast across the day, as the primary material of the house.",
    hero: "ak-house-02.webp",
    gallery: ["ak-house-01.webp", "ak-house-03.webp", "ak-house-04.webp", "ak-house-05.webp"],
    credits: { team: "Tomer Bellish, Hadar Hatav", collaborators: "—", render: "PB3DVIS" },
  },
  {
    slug: "aa-house",
    title: "aa house",
    eyebrow: "Private Houses — Alumot",
    type: "Private Houses",
    status: "In Progress",
    year: "2026",
    size: "200 m²",
    plot: "500 m²",
    location: "Alumot, Israel",
    client: "Private",
    para1: "In the new neighborhood of Kibbutz Alumot, this single-storey home was designed for a young family, on a plot that opens toward the sweeping view of the Yavne'el valley.",
    para2: "The house is planned on one level, organized along a central corridor that separates the private wing from the public one. Glazed along both of its sides, the corridor draws daylight along its full length — a path of light that connects the areas of the house and carries the outside in.",
    para3: "The material palette combines white plaster, exposed concrete, and steel — a restrained composition that keeps the architecture quiet and lets the landscape of the valley lead.",
    hero: "aa-house-hero-1920.webp",
    gallery: ["aa-house-01.webp", "aa-house-02.webp"],
    credits: { team: "Tomer Bellish, Hadar Hatav", collaborators: "—", render: "PB3DVIS" },
  },
];

export const STATUS_COLORS: Record<Status, string> = {
  'Idea': '#E8B93B',
  'In Progress': '#5FC0E4',
  'Construction': '#D9483B',
  'Complete': '#3E9E5E',
};

/** 'kv house' → 'KV House', 'inside/out house' → 'Inside/Out House'. */
export const displayName = (p: Project) =>
  p.title.replace(/\b\w+/g, (w) => (w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)));

export const place = (p: Project) => p.place ?? p.location.replace(/, Israel$/, '');

export const region = (p: Project) => p.eyebrow.split('—')[1].trim();

export const nextProject = (p: Project) => projects[(projects.indexOf(p) + 1) % projects.length];
