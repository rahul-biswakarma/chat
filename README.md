# Teleparty Chat

A real-time chat application built with Next.js and WebSocket technology, featuring rich text messaging, user presence indicators, and a modern dark theme interface.

https://github.com/user-attachments/assets/72cfb3c0-c74a-42d9-9ecb-0b811e1783d9

## ✨ Features

### 🚀 Core Chat Functionality

- **Real-time messaging** - Instant message delivery using WebSocket connections
- **Create & Join Rooms** - Create new chat rooms or join existing ones with room IDs
- **User Management** - Set custom nicknames and profile images
- **Connection Status** - Real-time connection status indicators

### 💬 Rich Text Messaging

- **Rich Text Editor** - Powered by TipTap with formatting toolbar
- **Text Formatting** - Bold, italic, strikethrough, and inline code
- **Lists** - Bulleted and numbered lists support
- **Link Support** - Add clickable links with automatic HTTPS prefixing
- **Message History** - Persistent chat history during session

### 👥 User Experience

- **Live User List** - See all connected users in real-time
- **Typing Indicators** - See when other users are typing
- **User Avatars** - Custom profile images with fallback initials
- **User Status** - Online presence indicators
- **Mobile Responsive** - Optimized for mobile devices with collapsible user menu

### 🎨 Modern UI/UX

- **Dark Theme** - Beautiful dark mode interface
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Smooth Animations** - Polished transitions and micro-interactions
- **Toast Notifications** - User-friendly success and error messages
- **Auto-scroll** - Messages automatically scroll to latest

### 🛠 Technical Features

- **TypeScript** - Full type safety throughout the application
- **Next.js 15** - Latest React framework with App Router
- **Tailwind CSS** - Modern utility-first styling
- **Radix UI** - Accessible component primitives
- **WebSocket Integration** - Real-time communication via teleparty-websocket-lib
- **Code Quality** - ESLint, Prettier, and Husky pre-commit hooks

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
