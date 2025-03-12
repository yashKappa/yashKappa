const fetch = require("node-fetch");
const fs = require("fs");

const username = "yashKappa";  // Change this to your GitHub username
const apiUrl = `https://api.github.com/users/${yashKappa}/repos?sort=updated`;

async function getRepos() {
    const response = await fetch(apiUrl);
    const repos = await response.json();

    let htmlContent = `# 🚀 My Recently Updated Projects\n\n`;
    htmlContent += `<div style="display: flex; flex-wrap: wrap; gap: 15px;">\n\n`;

    repos.slice(0, 6).forEach(repo => {
        htmlContent += `
        <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; width: 30%;">
            <h3><a href="${repo.html_url}">${repo.name}</a></h3>
            <p>${repo.description || "No description available"}</p>
            <p><b>Language:</b> ${repo.language || "Unknown"}</p>
        </div>\n\n`;
    });

    htmlContent += `</div>`;

    // Write the generated content to README.md
    fs.writeFileSync("README.md", htmlContent);
}

getRepos();
