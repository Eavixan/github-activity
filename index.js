#!/usr/bin/env node

const username = process.argv[2];

if (!username) {
  console.log("Please provide a GitHub username.");
  console.log("Example: github-activity kamranahmedse");
  process.exit(1);
}

async function fetchGitHubActivity() {
  try {
    const url = `https://api.github.com/users/${username}/events`;

    const response = await fetch(url);

    if (response.status === 404) {
      console.log("User not found. Please check the username.");
      return;
    }

    if (!response.ok) {
      console.log("Failed to fetch GitHub activity.");
      console.log(`Status code: ${response.status}`);
      return;
    }

    const data = await response.json();

    if (data.length === 0) {
      console.log("No recent public activity found.");
      return;
    }

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
      } else if (event.type === "PullRequestEvent") {
        console.log(`- ${event.payload.action} a pull request in ${repoName}`);
      } else if (event.type === "IssueCommentEvent") {
        console.log(`- Commented on an issue in ${repoName}`);
      } else if (event.type === "DeleteEvent") {
        console.log(`- Deleted ${event.payload.ref_type} in ${repoName}`);
      } else {
        console.log(`- ${event.type} in ${repoName}`);
      }
    }
  } catch (error) {
    console.log("Something went wrong.");
    console.log("Please check your internet connection and try again.");
  }
}

fetchGitHubActivity();