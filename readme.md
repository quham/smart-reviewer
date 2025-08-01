# News Analysis Application: Smart Reviewer

## Overview

This is a full-stack news analysis application that combines news search capabilities with AI-powered content analysis. The application allows users to search for news articles using the GNews API and then analyze them through an LLM (currently qwen2.5 but can be changed easily through openrouter service) creating summaries and analysing sentiment. Built with MERN


## System Architecture

The application follows a monorepo structure with clear separation between client and server code:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: MongoDB
- **UI Framework**: Tailwind CSS with shadcn/ui components for consistent design
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture
- **Component Structure**: Uses shadcn/ui component library for consistent UI elements
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query handles all server state and caching
- **Routing**: Simple routing with Wouter, currently supporting home page and 404 fallback
- **Type Safety**: Full TypeScript integration with shared types between client and server

### Backend Architecture
- **API Structure**: RESTful endpoints for news search and article analysis
- **Database Layer**: MongoDB
- **Service Layer**: Separate services for external API integrations (GNews, OpenRouter)
- **Error Handling**: Centralized error handling middleware

### Database Schema
- **Users**: Basic user authentication structure (id, username, password)
- **Articles**: Stores news article metadata (title, description, content, source, etc.)
- **Analyses**: Stores AI analysis results linked to articles (summary, sentiment scores)

## Data Flow

1. **Search Flow**: User searches → GNews API → Display results
2. **Analysis Flow**: User selects article → Store article → OpenRouter analysis → Store analysis → Display results
3. **History Flow**: Retrieve stored analyses → Display in table format with filtering options

## External Dependencies

### APIs and Services
- **GNews API**: For fetching news articles based on search queries
- **OpenRouter API**: Model can be easily changed for article summarization and sentiment analysis
- **Database**: MongoDB

## Getting Started

### Prerequisites

Before running the application, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

### Environment Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd NewsIntellect
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/newsintellect
   
   # API Keys
   GNEWS_API_KEY=your_gnews_api_key_here
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

   **Note**: 
   - For MongoDB Atlas, use your connection string instead of localhost
   - Get your GNews API key from [GNews](https://gnews.io/)
   - Get your OpenRouter API key from [OpenRouter](https://openrouter.ai/)

### Running the Application

#### Development Mode
```bash
npm run dev
```

This will start the development server with hot reloading on `http://localhost:5000`

#### Production Mode
```bash
npm run build
npm start
```

### Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build the application for production
- `npm start` - Start production server

### Accessing the Application

Once the server is running, you can access the application at:
- **Frontend**: `http://localhost:5000`
- **API Endpoints**: `http://localhost:5000/api/*`


