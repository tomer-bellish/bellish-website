export const SITE = 'https://bellish.co.il';

/** Home page JSON-LD. Hebrew alternate names are what Hebrew searches match on. */
export const organization = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Bellish Architects',
  alternateName: ['בליש אדריכלים', 'בליש אדריכלות', 'משרד אדריכלים בליש', 'בליש אדריכלים ומתכנני ערים'],
  founder: [
    { '@type': 'Person', name: 'Tomer Bellish', alternateName: ['תומר בליש', 'אדריכל תומר בליש'], jobTitle: 'Architect' },
    { '@type': 'Person', name: 'Jenine Bellish', alternateName: ["ג'נין בליש", 'גנין בליש', "מתכננת ערים ג'נין בליש"], jobTitle: 'Urban Planner' },
  ],
  description: 'A young, dynamic architecture studio designing residential, office, and commercial buildings — with an emphasis on innovation, sustainability, and minimalism.',
  url: `${SITE}/`,
  logo: `${SITE}/assets/logo.png`,
  image: `${SITE}/assets/lili-house-hero-1920.webp`,
  email: 'office@bellish.co.il',
  telephone: '+97246029585',
  address: [
    { '@type': 'PostalAddress', streetAddress: 'Tarshish 4, Kidmat HaGalil', addressLocality: 'Tiberias', addressCountry: 'IL' },
    { '@type': 'PostalAddress', streetAddress: 'Big Fashion Tower, Floor 5', addressLocality: 'Ramat HaSharon', addressCountry: 'IL' },
  ],
  sameAs: ['https://www.instagram.com/bellisharchitects'],
  knowsAbout: ['Architecture', 'Residential architecture', 'Office buildings', 'Commercial architecture', 'Interior design'],
};

/** BreadcrumbList JSON-LD: Home → …crumbs. */
export function breadcrumbs(...crumbs: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...crumbs].map((c, i) => ({
      '@type': 'ListItem', position: i + 1, name: c.name, item: SITE + c.path,
    })),
  };
}
