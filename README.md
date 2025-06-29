# Teleparty Chat

A real-time chat application built with Next.js and WebSocket technology, featuring rich text messaging, persistent history, user presence indicators, and a modern dark theme interface.

https://github.com/user-attachments/assets/72cfb3c0-c74a-42d9-9ecb-0b811e1783d9

## 🌐 Deployed URL

The application is deployed and accessible via GitHub Pages.

- **Production URL**: [https://rahul-biswakarma.github.io/teleparty/](https://rahul-biswakarma.github.io/teleparty/)

## 🛠 Local Setup

To run this project locally, follow these steps:

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/rahul-biswakarma/teleparty.git
    cd teleparty
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Run the development server**:

    ```bash
    npm run dev
    ```

4.  **Open the application**:
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## ✨ Features

### 🚀 Core Functionality

- **Real-time Messaging**: Instant message delivery using WebSocket connections.
- **Create & Join Rooms**: Easily create new chat rooms or join existing ones with a unique room ID.
- **Persistent Chat History**: Chat history is saved per room using IndexedDB, allowing you to see previous messages upon rejoining.
- **Multi-Tab Support**: Open the application in multiple browser tabs with independent sessions.
- **Robust Reconnection**: Automatically reconnects and rejoins your last room on page refresh or when switching back to the tab.

### 👥 User Experience

- **Custom Nicknames & Avatars**: Personalize your identity with a nickname and a profile image URL.
- **Live User List**: See all connected users in real-time.
- **Typing Indicators**: Know when other users are typing a message.
- **System Messages**: Get notified when users join or leave the chat.
- **URL Shortener**: Long avatar URLs are automatically shortened to keep the UI clean.
- **Responsive Design**: A seamless experience on both desktop and mobile devices, with a dedicated menu for mobile users.

### 🎨 Modern UI & Rich Text

- **Rich Text Editor**: Powered by TipTap, allowing for formatted messages.
- **Text Formatting**: Supports bold, italic, strikethrough, and inline code.
- **Clickable Links**: Automatically detects and formats links.
- **Dark Theme**: A sleek and modern dark mode interface.
- **Toast Notifications**: User-friendly notifications for important events.

### 🔧 Technical Details

- **Next.js & React**: Built with the latest features of Next.js and React.
- **TypeScript**: Ensures full type safety across the application.
- **Tailwind CSS**: A utility-first CSS framework for modern styling.
- **Dexie.js**: A wrapper for IndexedDB to manage chat history storage.
- **GitHub Actions**: Automated CI/CD pipeline for deploying to GitHub Pages.

## 🏗 Deployment

This project is configured for automated deployment to GitHub Pages using GitHub Actions. Any push to the `main` branch will trigger a workflow that builds the application and deploys the static files to the `gh-pages` branch.

## 📱 How to Use

### Creating a Chat Room

1. Enter your desired nickname
2. Optionally add a profile image URL
3. Click "Create Chat Room"
4. Share the generated room ID with friends

### Joining a Chat Room

1. Enter your nickname
2. Optionally add a profile image URL
3. Enter the room ID you want to join
4. Click "Join Room"

### Messaging Features

- **Send Messages**: Type in the editor and press Shift+Enter or click the send button
- **Format Text**: Use the toolbar to add bold, italic, strikethrough, code, lists, and links
- **Add Links**: Click the link button in the toolbar to insert clickable URLs
- **See Typing**: Watch real-time typing indicators from other users

## 🛠 Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run format:lint` - Format and fix linting issues

### Code Quality

This project uses:

- **ESLint** - Code linting with TypeScript support
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit checks
- **lint-staged** - Run linters on staged files

## 🏗 Architecture

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Radix UI components
- **Rich Text**: TipTap editor with extensions
- **WebSocket**: teleparty-websocket-lib
- **State Management**: React Context API
- **Notifications**: Sonner toast library

### Project Structure

```
├── app/                    # Next.js app directory
├── components/
│   ├── chat/              # Chat-specific components
│   ├── context/           # React context providers
│   └── ui/                # Reusable UI components
├── lib/                   # Utility functions and types
└── public/                # Static assets
```

## Deployment

This project can be deployed to GitHub Pages.

### Configuration

1.  Open `next.config.ts`.
2.  Set the `basePath` and `assetPrefix` to the name of your GitHub repository. For example, if your repository is `https://github.com/your-username/chat`, you would set:

    ```javascript
    const nextConfig = {
      output: "export",
      basePath: "/chat",
      images: {
        unoptimized: true,
      },
    };
    ```

### Manual Deployment

To deploy the site, run the following command:

```bash
npm run deploy:all
```

This will build the application and push the static files to the `gh-pages` branch of your repository. You will then need to configure your repository's settings to deploy from this branch.

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

**Note:** For local development, the application runs at `http://localhost:3000`. The production build is available at [https://rahul-biswakarma.github.io/chat/](https://rahul-biswakarma.github.io/chat/).
