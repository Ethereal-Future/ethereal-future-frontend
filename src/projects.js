export const projects = [
  { id: 'commons-index', name: 'Commons Index', summary: 'A public catalog for reusable community infrastructure and local services.', category: 'Infrastructure', raised: 7200, goal: 12000, supporters: 38, milestones: [{ title: 'Publish the data model', complete: true }, { title: 'Release the public directory', complete: true }, { title: 'Add community verification', complete: false }] },
  { id: 'open-orchard', name: 'Open Orchard', summary: 'Track local food-growing projects with transparent milestones and evidence.', category: 'Climate', raised: 9400, goal: 9400, supporters: 61, milestones: [{ title: 'Map participating gardens', complete: true }, { title: 'Publish seasonal reports', complete: true }, { title: 'Open the next planting round', complete: true }] },
  { id: 'learning-lantern', name: 'Learning Lantern', summary: 'Fund open learning modules with clear release plans and public progress updates.', category: 'Education', raised: 3100, goal: 10000, supporters: 19, milestones: [{ title: 'Interview local educators', complete: true }, { title: 'Publish the first module', complete: false }, { title: 'Run an open feedback round', complete: false }] },
];

export function visibleProjects({ query = '', category = 'all', status = 'all' } = {}, items = projects) {
  const normalized = query.trim().toLowerCase();
  return items.filter((project) => {
    const matchesQuery = !normalized || `${project.name} ${project.summary}`.toLowerCase().includes(normalized);
    const matchesCategory = category === 'all' || project.category === category;
    const matchesStatus = status === 'all' || (status === 'active' ? project.raised < project.goal : project.raised >= project.goal);
    return matchesQuery && matchesCategory && matchesStatus;
  });
}

export function projectMetrics(items = projects) {
  return { total: items.length, active: items.filter((project) => project.raised < project.goal).length, raised: items.reduce((sum, project) => sum + project.raised, 0) };
}
