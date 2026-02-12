/* Automatically list every public repo that has a gh-pages branch */
const GH_USER = 'R16-srihari';          // <-- change to your GitHub username
const LIST   = document.getElementById('repo-list');

fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100`)
  .then(r => r.json())
  .then(repos => {
     const withPages = repos.filter(r => r.has_pages);
     if (!withPages.length) {
       LIST.innerHTML = '<div class="no-repos">No GitHub Pages found yet. Push one!</div>';
       return;
     }
     LIST.innerHTML = withPages
       .sort((a,b) => a.name.localeCompare(b.name))
       .map(r => {
         const description = r.description || 'No description available';
         const updatedDate = new Date(r.updated_at).toLocaleDateString('en-US', { 
           year: 'numeric', 
           month: 'short', 
           day: 'numeric' 
         });
         const language = r.language || 'Unknown';
         const stars = r.stargazers_count || 0;
         
         return `
           <div class="repo-card">
             <div class="repo-header">
               <h3 class="repo-name">
                 <a href="https://${GH_USER}.github.io/${r.name}/" target="_blank">${r.name}</a>
               </h3>
               ${stars > 0 ? `<span class="repo-stars">⭐ ${stars}</span>` : ''}
             </div>
             <p class="repo-description">${description}</p>
             <div class="repo-footer">
               <span class="repo-language">${language}</span>
               <span class="repo-updated">Updated: ${updatedDate}</span>
             </div>
           </div>
         `;
       })
       .join('');
  })
  .catch(() => { LIST.innerHTML = '<div class="error">Could not load repository list. Please try again later.</div>'; });