import fetch from "node-fetch";
import fs from "fs";

const GITHUB_USERNAME = "your-github-username";
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated`;

async function fetchRepositories() {
    try {
        const response = await fetch(GITHUB_API_URL);
        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status}`);
        }
        const repositories = await response.json();
        
        let repoCards = repositories.slice(0, 6).map(repo => `
            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; width: 30%;">
                <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
                <p>${repo.description ? repo.description : "No description available"}</p>
                <p><b>Language:</b> ${repo.language || "Unknown"}</p>
            </div>
        `).join("");

        const htmlContent = `
            <h2>🚀 My Recently Updated Projects</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 15px;">
                ${repoCards}
            </div>
        `;

        fs.writeFileSync("README.md", htmlContent);
        console.log("✅ README.md updated successfully!");
    } catch (error) {
        console.error("❌ Error fetching repositories:", error.message);
    }
}

fetchRepositories();
