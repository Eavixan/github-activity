#!/usr/bin/env node
// This line tells the computer to run this file using Node.js when used as a CLI command.

// Get the GitHub username from the command line.
// Example: github-activity torvalds
// In that case, process.argv[2] will be "torvalds".
const username = process.argv[2];

// Check if the user did not provide a username.
if (!username) {
  // Show a helpful message.
  console.log("Please provide a GitHub username.");

  // Show an example command.
  console.log("Example: github-activity kamranahmedse");

  // Stop the program because username is required.
  process.exit(1);
}

// Create an async function because fetching data from GitHub takes time.
async function fetchGitHubActivity() {
  // try...catch helps us handle errors without crashing the app.
  try {
    // Create the GitHub API URL using the username.
    const url = `https://api.github.com/users/${username}/events`;

    // Send a request to GitHub and wait for the response.
    const response = await fetch(url);

    // If GitHub says 404, the user was not found.
    if (response.status === 404) {
      // Show a friendly error message.
      console.log("User not found. Please check the username.");

      // Stop the function here.
      return;
    }

    // If the response is not successful, handle it gracefully.
    if (!response.ok) {
      // Show a general error message.
      console.log("Failed to fetch GitHub activity.");

      // Show the status code, for example 403 or 500.
      console.log(`Status code: ${response.status}`);

      // Stop the function here.
      return;
    }

    // Convert GitHub's JSON response into JavaScript data.
    const data = await response.json();

    // If the user has no recent public activity, data will be an empty array.
    if (data.length === 0) {
      // Show a clear message.
      console.log("No recent public activity found.");

      // Stop the function here.
      return;
    }

    // Loop through every activity event GitHub returned.
    for (const event of data) {
      // Get the repository name from the event.
      // Example: "torvalds/linux"
      const repoName = event.repo.name;

      // Check if the event is a push event.
      if (event.type === "PushEvent") {
        // Get the commits from the event payload.
        const commits = event.payload.commits;

        // Check if commits exist and there is at least one commit.
        if (commits && commits.length > 0) {
          // Show how many commits were pushed.
          console.log(`- Pushed ${commits.length} commit(s) to ${repoName}`);
        } else {
          // If commit details are missing, show a simple push message.
          console.log(`- Pushed to ${repoName}`);
        }

        // Check if the event is an issue event.
      } else if (event.type === "IssuesEvent") {
        // Show the issue action, like opened or closed.
        console.log(`- ${event.payload.action} an issue in ${repoName}`);

        // Check if the event is a watch event.
      } else if (event.type === "WatchEvent") {
        // GitHub uses WatchEvent when someone stars a repository.
        console.log(`- Starred ${repoName}`);

        // Check if the event is a fork event.
      } else if (event.type === "ForkEvent") {
        // Show that the user forked a repository.
        console.log(`- Forked ${repoName}`);

        // Check if the event is a create event.
      } else if (event.type === "CreateEvent") {
        // Show what was created, like a branch or tag.
        console.log(`- Created ${event.payload.ref_type} in ${repoName}`);

        // Check if the event is a pull request event.
      } else if (event.type === "PullRequestEvent") {
        // Show the pull request action, like opened or closed.
        console.log(`- ${event.payload.action} a pull request in ${repoName}`);

        // Check if the event is an issue comment event.
      } else if (event.type === "IssueCommentEvent") {
        // Show that the user commented on an issue.
        console.log(`- Commented on an issue in ${repoName}`);

        // Check if the event is a delete event.
      } else if (event.type === "DeleteEvent") {
        // Show what was deleted, like a branch or tag.
        console.log(`- Deleted ${event.payload.ref_type} in ${repoName}`);

        // If the event type is not one we handled above, show a fallback message.
      } else {
        // Print the raw GitHub event type so the user still sees something.
        console.log(`- ${event.type} in ${repoName}`);
      }
    }

    // This catches errors like internet problems or unexpected crashes.
  } catch (error) {
    // Show a general error message.
    console.log("Something went wrong.");

    // Suggest checking internet connection.
    console.log("Please check your internet connection and try again.");
  }
}

// Call the function so the program actually starts.
fetchGitHubActivity();