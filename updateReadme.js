const fs = require("fs");
const fetch = require("node-fetch");

const GITHUB_USERNAME = "yashKappa";
const GITHUB_TOKEN = "YOUR_GITHUB_TOKEN"; // Replace with your token

async function fetchTopRepos() {
  const query = `
    {
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
    }`;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  return data.data.user.repositories.nodes;
}

async function updateReadme() {
  const repos = await fetchTopRepos();
  let markdown = `### 🚀 My Top GitHub Projects\nHere are my top 6 repositories based on stars:\n\n`;

  repos.forEach((repo, index) => {
    markdown += `${index + 1}. [${repo.name}](${repo.url}) ⭐ ${repo.stargazers.totalCount}\n`;
  });

  fs.writeFileSync("README.md", markdown, "utf8");
  console.log("README updated successfully!");
}

updateReadme();
