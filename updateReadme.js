require("dotenv").config();
const fs = require("fs");
const fetch = require("node-fetch");

const GITHUB_USERNAME = "yashKappa";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Securely load token from .env

if (!GITHUB_TOKEN) {
    console.error("❌ GitHub Token is missing! Add it in .env file.");
    process.exit(1);
}

async function fetchTopRepos() {
    const query = `
        query {
            user(login: "${GITHUB_USERNAME}") {
                repositories(first: 6, orderBy: {field: STARGAZERS, direction: DESC}) {
                    nodes {
                        name
                        url
                        stargazers {
                            totalCount
                        }
                    }
                }
            }
        }
    `;

    const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
    });

    if (!response.ok) {
        console.error("❌ Error fetching GitHub data:", response.statusText);
        return [];
    }

    const data = await response.json();
    if (data.errors) {
        console.error("GraphQL Error:", data.errors);
        return [];
    }

    return data.data.user.repositories.nodes;
}

async function updateReadme() {
    const repos = await fetchTopRepos();
    if (repos.length === 0) {
        console.log("No repositories found.");
        return;
    }

    let markdown = `### 🚀 My Top GitHub Projects\nHere are my top 6 repositories based on stars:\n\n`;

    repos.forEach((repo, index) => {
        markdown += `${index + 1}. [${repo.name}](${repo.url}) ⭐ ${repo.stargazers.totalCount}\n`;
    });

    // Read existing README content
    let readmeContent = fs.readFileSync("README.md", "utf8");

    // Replace between LATEST-REPOS-START and LATEST-REPOS-END
    readmeContent = readmeContent.replace(
        /<!-- LATEST-REPOS-START -->[\s\S]*<!-- LATEST-REPOS-END -->/,
        `<!-- LATEST-REPOS-START -->\n${markdown}\n<!-- LATEST-REPOS-END -->`
    );

    fs.writeFileSync("README.md", readmeContent, "utf8");
    console.log("✅ README updated successfully!");
}

updateReadme();
