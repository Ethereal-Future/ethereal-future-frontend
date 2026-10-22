export const projects = [
  { id: 'commons-index', name: 'Commons Index', summary: 'A public catalog for reusable community infrastructure.', category: 'Infrastructure', raised: 7200, goal: 12000, supporters: 38 },
  { id: 'open-orchard', name: 'Open Orchard', summary: 'Track local food-growing projects with transparent milestones.', category: 'Climate', raised: 9400, goal: 9400, supporters: 61 },
  { id: 'learning-lantern', name: 'Learning Lantern', summary: 'Fund open learning modules with verifiable release plans.', category: 'Education', raised: 3100, goal: 10000, supporters: 19 },
];

export function visibleProjects(status, items = projects) {
  if (status === 'active') return items.filter((project) => project.raised < project.goal);
  if (status === 'complete') return items.filter((project) => project.raised >= project.goal);
  return items;
}
