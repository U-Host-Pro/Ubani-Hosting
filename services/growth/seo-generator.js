const industries = [
  "lawyers",
  "designers",
  "restaurants",
  "plumbers",
  "photographers"
];

const cities = ["johannesburg", "cape-town", "pretoria", "durban"];

export function generateSeoSlugs() {
  const slugs = [];
  for (const industry of industries) {
    for (const city of cities) {
      slugs.push(`hosting-for-${industry}-${city}`);
    }
  }
  return slugs;
}
