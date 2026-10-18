/* List GitHub Pages projects and curated Quarto-hosted projects */
const GH_USER = 'R16-srihari';
const LIST = document.getElementById('repo-list');

/*
 * Curated Quarto projects.
 * Replace example entries below with real page slugs as needed.
 */
const quartoProjects = [
  {
    name: 'Gravitational Perturbation Potential for Earth',
    url: 'https://r16srihari.quarto.pub/gravitational-perturbation-potential-for-earth/',
    description: 'Quarto page for Earth gravitational perturbation potential analysis.',
    language: 'Quarto',
    type: 'quarto'
  },
];

function normalizeGithubProject(repo) {
  return {
    name: repo.name,
    url: `https://${GH_USER}.github.io/${repo.name}/`,
    description: repo.description || 'No description available',
    language: repo.language || 'Unknown',
    stars: repo.stargazers_count || 0,
    updatedDate: new Date(repo.updated_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    type: 'github-pages'
  };
}

function renderProjects(projects) {
  if (!projects.length) {
    LIST.innerHTML = '<div class="no-repos">No web projects found yet.</div>';
    return;
  }

  LIST.innerHTML = projects
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(project => `
      <div class="repo-card">
        <div class="repo-header">
          <h3 class="repo-name">
            <a href="${project.url}" target="_blank" rel="noopener noreferrer">${project.name}</a>
          </h3>
          ${(project.stars || 0) > 0 ? `<span class="repo-stars">⭐ ${project.stars}</span>` : ''}
        </div>
        <p class="repo-description">${project.description || 'No description available'}</p>
        <div class="repo-footer">
          <span class="repo-language">${project.language || 'Unknown'}</span>
          ${project.updatedDate ? `<span class="repo-updated">Updated: ${project.updatedDate}</span>` : ''}
        </div>
      </div>
    `)
    .join('');
}

const requestController = new AbortController();
const requestTimeoutId = setTimeout(() => requestController.abort(), 10000);

fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100`, { signal: requestController.signal })
  .then(response => {
    if (!response.ok) {
      throw new Error('GitHub API request failed');
    }
    return response.json();
  })
  .then(repos => {
    const githubProjects = repos
      .filter(repo => repo.has_pages)
      .map(normalizeGithubProject);

    renderProjects([...githubProjects, ...quartoProjects]);
  })
  .catch(() => {
    renderProjects(quartoProjects);
  })
  .finally(() => {
    clearTimeout(requestTimeoutId);
  });
