import { projectMetrics, projects, visibleProjects } from './projects.js';

const grid = document.querySelector('#project-grid');
const search = document.querySelector('#search');
const category = document.querySelector('#category');
const status = document.querySelector('#status');
const dialog = document.querySelector('#project-dialog');
const intentForm = document.querySelector('#intent-form');
const dialogAction = document.querySelector('#dialog-action');
const apiStatus = document.querySelector('#api-status');
const apiBase = localStorage.getItem('veridian-api-url') || 'http://localhost:3001';
let selectedProject;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]);
}

function updateMetrics() {
  const metrics = projectMetrics(projects);
  document.querySelector('#metric-total').textContent = metrics.total;
  document.querySelector('#metric-active').textContent = metrics.active;
  document.querySelector('#metric-raised').textContent = `$${metrics.raised.toLocaleString()}`;
}

function card(project) {
  const percentage = Math.min(100, Math.round((project.raised / project.goal) * 100));
  const complete = percentage >= 100;
  const milestones = project.milestones.filter((item) => item.complete).length;
  return `<article class="card"><div class="card-top"><span class="tag">${escapeHtml(project.category)}</span><span class="state ${complete ? 'complete' : ''}">${complete ? 'Complete' : 'Active'}</span></div><h3>${escapeHtml(project.name)}</h3><p>${escapeHtml(project.summary)}</p><div class="meter" role="progressbar" aria-label="${escapeHtml(project.name)} progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percentage}"><span style="width:${percentage}%"></span></div><div class="stats"><span><strong>${percentage}%</strong> funded</span><span><strong>${milestones}/${project.milestones.length}</strong> milestones</span></div><button class="outline" type="button" data-project="${escapeHtml(project.id)}">View project path <span aria-hidden="true">→</span></button></article>`;
}

function render() {
  const items = visibleProjects({ query: search.value, category: category.value, status: status.value });
  document.querySelector('#result-count').textContent = `${items.length} of ${projects.length} shown`;
  grid.innerHTML = items.length ? items.map(card).join('') : '<p class="empty">No projects match these filters. Try a broader search.</p>';
}

function openProject(id) {
  selectedProject = projects.find((item) => item.id === id);
  if (!selectedProject) return;
  document.querySelector('#dialog-title').textContent = selectedProject.name;
  document.querySelector('#dialog-summary').textContent = selectedProject.summary;
  document.querySelector('#dialog-milestones').innerHTML = selectedProject.milestones.map((item) => `<div class="milestone ${item.complete ? 'done' : ''}"><span>${item.complete ? '✓' : '○'}</span><span>${escapeHtml(item.title)}</span></div>`).join('');
  dialogAction.textContent = 'Prepare contribution intent';
  intentForm.reset();
  dialog.showModal();
}

async function prepareIntent(amount, wallet) {
  const idempotencyKey = `web-${selectedProject.id}-${Date.now()}`;
  try {
    const response = await fetch(`${apiBase}/projects/${selectedProject.id}/contributions`, { method: 'POST', headers: { 'content-type': 'application/json', 'idempotency-key': idempotencyKey }, body: JSON.stringify({ amount, wallet: wallet || undefined }) });
    if (!response.ok) throw new Error('API unavailable');
    return (await response.json()).contribution;
  } catch {
    const localIntent = { id: `local_${crypto.randomUUID()}`, projectId: selectedProject.id, amount, wallet: wallet || null, status: 'ready_for_wallet', createdAt: new Date().toISOString() };
    const saved = JSON.parse(localStorage.getItem('veridian-intents') || '[]');
    localStorage.setItem('veridian-intents', JSON.stringify([localIntent, ...saved].slice(0, 20)));
    return localIntent;
  }
}

[search, category, status].forEach((control) => control.addEventListener('input', render));
grid.addEventListener('click', (event) => { const button = event.target.closest('[data-project]'); if (button) openProject(button.dataset.project); });
document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
intentForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const amount = Number(new FormData(intentForm).get('amount'));
  const wallet = String(new FormData(intentForm).get('wallet') || '').trim();
  if (!Number.isFinite(amount) || amount <= 0) return;
  dialogAction.disabled = true;
  dialogAction.textContent = 'Preparing…';
  const intent = await prepareIntent(amount, wallet);
  document.querySelector('#intent-result').textContent = `Intent ${intent.id} is ready for wallet review.`;
  dialogAction.textContent = 'Intent prepared';
  apiStatus.textContent = intent.id.startsWith('local_') ? 'Offline demo mode · saved locally' : 'Backend connected · intent recorded';
  dialogAction.disabled = false;
});

updateMetrics();
render();
fetch(`${apiBase}/health`).then((response) => { if (!response.ok) throw new Error(); apiStatus.textContent = 'Backend connected'; }).catch(() => { apiStatus.textContent = 'Offline demo mode'; });
