/* Automatically list every public repo that has a gh-pages branch */
const GH_USER = 'R16-srihari';          // <-- change to your GitHub username
const LIST   = document.getElementById('repo-list');

fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100`)
  .then(r => r.json())
  .then(repos => {
     const withPages = repos.filter(r => r.has_pages);
     if (!withPages.length) {
       LIST.innerHTML = '<li>No GitHub Pages found yet. Push one!</li>';
       return;
     }
     LIST.innerHTML = withPages
       .sort((a,b) => a.name.localeCompare(b.name))
       .map(r => `<li><a href="https://${GH_USER}.github.io/${r.name}/">${r.name}</a> — ${r.description || ''}</li>`)
       .join('');
  })
  .catch(() => { LIST.innerHTML = '<li>Could not load repo list.</li>'; });