# News Analysis Application

## Overview

This is a full-stack news analysis application that combines news search capabilities with AI-powered content analysis. The application allows users to search for news articles using the GNews API and then analyze them using OpenAI's GPT-4o model for summarization and sentiment analysis. Built with a modern tech stack including React, Express, PostgreSQL, and various AI services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client and server code:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
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
- **Database Layer**: Drizzle ORM with PostgreSQL, using Neon serverless for cloud deployment
- **Service Layer**: Separate services for external API integrations (GNews, OpenAI)
- **Error Handling**: Centralized error handling middleware
- **Request Logging**: Custom logging middleware for API requests

### Database Schema
- **Users**: Basic user authentication structure (id, username, password)
- **Articles**: Stores news article metadata (title, description, content, source, etc.)
- **Analyses**: Stores AI analysis results linked to articles (summary, sentiment scores)

## Data Flow

1. **Search Flow**: User searches → GNews API → Display results
2. **Analysis Flow**: User selects article → Store article → OpenAI analysis → Store analysis → Display results
3. **History Flow**: Retrieve stored analyses → Display in table format with filtering options

## External Dependencies

### APIs and Services
- **GNews API**: For fetching news articles based on search queries
- **OpenAI API**: GPT-4o model for article summarization and sentiment analysis
- **Neon Database**: Serverless PostgreSQL hosting

### Key Libraries
- **UI Components**: Extensive use of Radix UI primitives via shadcn/ui
- **Database**: Drizzle ORM with PostgreSQL driver
- **HTTP Client**: Native fetch API with custom wrapper
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React for consistent iconography

## Deployment Strategy

### Development Setup
- **Dev Server**: Vite dev server with HMR for frontend
- **Backend**: tsx for TypeScript execution in development
- **Database**: Drizzle Kit for schema migrations

### Production Build
- **Frontend**: Vite builds to `dist/public` directory
- **Backend**: esbuild bundles server code to `dist` directory
- **Static Serving**: Express serves built frontend in production
- **Database**: Environment-based connection string configuration

### Environment Configuration
- Database URL for PostgreSQL connection
- API keys for GNews and OpenAI services
- NODE_ENV for environment-specific behavior

The architecture prioritizes type safety, developer experience, and scalability while maintaining a clean separation of concerns between different layers of the application.