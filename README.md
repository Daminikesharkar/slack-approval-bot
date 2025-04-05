# slack-approval-bot
A Slack app that lets users request approvals through a slash command. Approvers can approve or reject directly from Slack via buttons.

---

## Go to

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Expose Local Server Using ngrok](#expose-local-server-using-ngrok)
- [Slack App Configuration](#slack-app-configuration)
- [How It Works](#how-it-works)
- [Architecture Diagram](#architecture-diagram)


---

## Features

- Slash command (/approval-test) to open an approval modal
- Modal for submitting requests
- Interactive messages with Approve/Reject buttons
- Slack DM notifications for both requester and approver
- Unit tests for controllers and routes

---

## Tech Stack

- Node.js
- Express.js
- Slack Web API (via `@slack/web-api`)
- Jest for testing
- ngrok (for local Slack testing)

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Daminikesharkar/slack-approval-bot.git
cd slack-approval-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
PORT=3000
```

---

## Expose Local Server Using ngrok

Slack requires publicly accessible URLs to receive slash commands and interaction events. You can use **ngrok** to expose your local server to the internet.

### 1. Install ngrok

```bash
npm install -g ngrok
```

### 2.  Start your local server

```bash
npm start
```

### 3.  Start ngrok on the same port

```bash
ngrok http 3000
```

---

## Slack App Configuration

To use this slack-approval-bot with your Slack workspace, follow these steps to configure your Slack app:

### 1. Create a Slack App

- Go to [https://api.slack.com/apps](https://api.slack.com/apps)
- Click **Create New App**
- Choose **From scratch** give it a name (`Approval Bot`) and select your workspace

### 2. Enable Slash Commands

- Go to **Slash Commands** > **Create New Command**
- Command: `/approval-test`
- Request URL: `https://<your-ngrok-url>/command`
- Short description: `Trigger approval request modal`
- Save

### 3. Enable Interactivity

- Go to **Interactivity & Shortcuts**
- Turn it **ON**
- Request URL: `https://<your-ngrok-url>/interactions`
- Save

### 4. Add OAuth Scopes

Go to **OAuth & Permissions** > **Scopes** and add the following:

#### Bot Token Scopes:

- `commands` – to use slash commands
- `chat:write` – to send messages
- `users:read` – to get user details for mentions/selects
- `im:write` – to send direct messages

### 5. Install the App to Your Workspace

- Go to **Install App**
- Click **Install to Workspace**
- Authorize the app

### 6. Copy the Bot Token

- After installation, you'll see a **Bot User OAuth Token** 
- Copy it and add it to your project’s `.env` file as: SLACK_BOT_TOKEN=xoxb-1234-abc...


--- 

## How It Works

1. Trigger the approval modal using the `/approval-test` slash command in Slack.
2. A modal will pop up allowing you to
   - Select an approver
   - Enter a approval request message
3. Once submitted, the selected approver will receive a direct message containing:
   - The approval request message
   - Interactive buttons: **Approve** and **Reject**
4. Based on Approvals selection:
   - Requester will receive a notification with their decision.

---

## Architecture Diagram

[Click here to view the Architecture Diagram](https://app.eraser.io/workspace/wgLHz8RLFa4hT9vrXIKd)