// this part gets the username typed after node index.js in the terminal
//node is process.argv[0], index.js is process.argv[1], and the username is process.argv[2]

const username = process.argv[2];

if (!username) {
  console.log("Please provide a GitHub username.");
  console.log("Example: node index.js kamranahmedse");
  process.exit(1);
}

async function fetchGitHubActivity() {
  const url = `https://api.github.com/users/${username}/events`;

  const response = await fetch(url);
  const data = await response.json();

for (const event of data) {
  const repoName = event.repo.name;

  if (event.type === "PushEvent") {
    const commits = event.payload.commits;

    if (commits && commits.length > 0) {
    console.log(`- Pushed ${commits.length} commit(s) to ${repoName}`);
    } else {
    console.log(`- Pushed to ${repoName}`);
    }
  } else if (event.type === "IssuesEvent") {
    console.log(`- ${event.payload.action} an issue in ${repoName}`);
  } else if (event.type === "WatchEvent") {
    console.log(`- Starred ${repoName}`);
  } else if (event.type === "ForkEvent") {
    console.log(`- Forked ${repoName}`);
  } else if (event.type === "CreateEvent") {
    console.log(`- Created ${event.payload.ref_type} in ${repoName}`);
  } else {
    console.log(`- ${event.type} in ${repoName}`);
  }
}
}

fetchGitHubActivity();