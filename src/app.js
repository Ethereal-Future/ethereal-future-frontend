import { projects, visibleProjects } from './projects.js';

const grid = document.querySelector('#project-grid');
const filter = document.querySelector('#status-filter');

function card(project) {
  const percentage = Math.min(100, Math.round((project.raised / project.goal) * 100));
  const state = percentage >= 100 ? 'Complete' : 'Active';
  return `<article class="card">
    <div class="card-top"><span class="tag">${project.category}</span><span class="state">${state}</span></div>
    <h3>${project.name}</h3><p>${project.summary}</p>
    <div class="meter" role="progressbar" aria-label="${project.name} progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percentage}"><span style="width:${percentage}%"></span></div>
    <div class="stats"><span><strong>${percentage}%</strong> funded</span><span><strong>${project.supporters}</strong> supporters</span></div>
    <button type="button" data-project="${project.id}">View contribution path</button>
  </article>`;
}

function render() {
  const items = visibleProjects(filter.value);
  grid.innerHTML = items.length ? items.map(card).join('') : '<p class="empty">No projects match this filter.</p>';
}

filter.addEventListener('change', render);
grid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-project]');
  if (button) button.textContent = 'Contribution path coming soon';
});
render();
