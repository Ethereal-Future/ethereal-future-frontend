import { projectMetrics, projects, visibleProjects } from './projects.js';

const grid = document.querySelector('#project-grid');
const search = document.querySelector('#search');
const category = document.querySelector('#category');
const status = document.querySelector('#status');
const dialog = document.querySelector('#project-dialog');
const metrics = projectMetrics();
document.querySelector('#metric-total').textContent = metrics.total;
document.querySelector('#metric-active').textContent = metrics.active;
document.querySelector('#metric-raised').textContent = `$${metrics.raised.toLocaleString()}`;

function card(project) {
  const percentage = Math.min(100, Math.round((project.raised / project.goal) * 100));
  const complete = percentage >= 100;
  const milestones = project.milestones.filter((item) => item.complete).length;
  return `<article class="card"><div class="card-top"><span class="tag">${project.category}</span><span class="state ${complete ? 'complete' : ''}">${complete ? 'Complete' : 'Active'}</span></div><h3>${project.name}</h3><p>${project.summary}</p><div class="meter" role="progressbar" aria-label="${project.name} progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percentage}"><span style="width:${percentage}%"></span></div><div class="stats"><span><strong>${percentage}%</strong> funded</span><span><strong>${milestones}/${project.milestones.length}</strong> milestones</span></div><button class="outline" type="button" data-project="${project.id}">View project path <span aria-hidden="true">→</span></button></article>`;
}
function render() {
  const items = visibleProjects({ query: search.value, category: category.value, status: status.value });
  document.querySelector('#result-count').textContent = `${items.length} of ${projects.length} shown`;
  grid.innerHTML = items.length ? items.map(card).join('') : '<p class="empty">No projects match these filters. Try a broader search.</p>';
}
function openProject(id) {
  const project = projects.find((item) => item.id === id);
  if (!project) return;
  document.querySelector('#dialog-title').textContent = project.name;
  document.querySelector('#dialog-summary').textContent = project.summary;
  document.querySelector('#dialog-milestones').innerHTML = project.milestones.map((item) => `<div class="milestone ${item.complete ? 'done' : ''}"><span>${item.complete ? '✓' : '○'}</span><span>${item.title}</span></div>`).join('');
  dialog.showModal();
}
[search, category, status].forEach((control) => control.addEventListener('input', render));
grid.addEventListener('click', (event) => { const button = event.target.closest('[data-project]'); if (button) openProject(button.dataset.project); });
document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
document.querySelector('#dialog-action').addEventListener('click', (event) => { event.currentTarget.textContent = 'Wallet adapter coming soon'; });
render();
