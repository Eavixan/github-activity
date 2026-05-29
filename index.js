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
  console.log(event.type);
}
}

fetchGitHubActivity();