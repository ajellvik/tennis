# Tennis Video Analysis Application

## Overview

This is a full-stack tennis video analysis application that allows users to upload tennis videos and receive AI-powered analysis with estimated world rankings. The application uses a modern tech stack with React frontend, Express backend, and in-memory storage for development. Users can upload videos, pay $10 for analysis, and receive detailed performance metrics including world ranking estimates among 100+ million players.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Framework**: Shadcn/UI components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom tennis-themed color scheme
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation via Hookform Resolvers

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **File Uploads**: Multer for handling video file uploads (up to 500MB)
- **Payment Processing**: Stripe integration for payment handling
- **Session Management**: Express sessions with PostgreSQL session store
- **API Design**: RESTful API with structured error handling and request logging

### Database Schema
- **Users Table**: Basic user authentication (id, email, username, password, created_at)
- **Video Analyses Table**: Stores video analysis data including:
  - File metadata (name, size)
  - Processing status (uploading, processing, completed, failed)
  - Analysis results (world ranking, scores for footwork, technique, strategy, fitness)
  - Payment status and Stripe integration
  - Timestamps for creation and completion

## Key Components

### File Upload System
- Drag-and-drop interface with progress tracking
- File validation (MP4, MOV, AVI formats only)
- Size limit enforcement (500MB maximum)
- Real-time upload progress feedback

### Payment Integration
- Stripe Elements for secure payment processing
- Payment intent creation and confirmation flow
- Payment status tracking linked to video analyses

### Analysis Engine
- Mock analysis system generating realistic tennis performance metrics
- Scoring system covering multiple aspects: footwork, technique, strategy, fitness
- World ranking estimation based on performance metrics
- Detailed results stored as JSON for extensibility

### User Interface
- Responsive design with mobile-first approach
- Tennis-themed color palette and branding
- Loading states and progress indicators
- Toast notifications for user feedback
- Dashboard for viewing analysis history

## Data Flow

1. **Upload Flow**: User uploads video → File validation → Create analysis record → Payment processing → Start analysis
2. **Analysis Flow**: Video processing simulation → Generate scores → Calculate ranking → Update database → Notify completion
3. **Results Flow**: Fetch analysis results → Display metrics and ranking → Show detailed breakdown

## External Dependencies

### Payment Processing
- **Stripe**: Complete payment infrastructure including:
  - Client-side payment element integration
  - Server-side payment intent creation
  - Webhook handling for payment confirmations
  - $10 flat rate per video analysis

### Database
- **PostgreSQL Database**: Production database with users and video_analyses tables
- **Drizzle ORM**: Full database integration with type-safe queries and operations

### Development Tools
- **Replit Integration**: Custom plugins for development environment
- **TypeScript**: Full type safety across frontend and backend
- **ESLint/Prettier**: Code quality and formatting

## Deployment Strategy

### Build Process
- Frontend: Vite builds React app to `dist/public`
- Backend: ESBuild bundles Express server to `dist/index.js`
- Database: Drizzle migrations managed via `db:push` command

### Environment Configuration
- Development: Uses tsx for TypeScript execution
- Production: Node.js runs bundled JavaScript
- Database: Configured via DATABASE_URL environment variable
- Stripe: Requires both public and secret keys

### File Storage
- Local filesystem for video uploads during development
- Uploads stored in `/uploads` directory
- Production would require cloud storage integration (S3, etc.)

### Session Management
- PostgreSQL-backed sessions using connect-pg-simple
- Secure session configuration for production deployment

## Recent Changes

### January 2025
- ✓ Complete tennis video analysis platform implemented
- ✓ Stripe payment integration configured with $10 per analysis
- ✓ Mock AI analysis engine generating realistic performance metrics
- ✓ Responsive UI with tennis-themed design
- ✓ Full upload-to-results workflow functional
- ✓ TypeScript errors resolved and application running successfully
- ✓ Video upload functionality fixed - FormData handling corrected
- ✓ PostgreSQL database integrated - replaced in-memory storage with persistent database
- ✓ Database tables created and populated with demo user

The application follows a modular architecture with clear separation of concerns, making it easy to extend with additional features like real AI analysis, cloud storage, or advanced user management.