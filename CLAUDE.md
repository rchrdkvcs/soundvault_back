# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Scripts

- `npm run dev` - Start development server with hot module reloading
- `npm run build` - Build the application for production
- `npm start` - Start production server
- `npm test` - Run test suite using Japa
- `npm run lint` - Run ESLint on the codebase
- `npm run format` - Format code using Prettier
- `npm run typecheck` - Run TypeScript type checking

### Database Operations

- `node ace migration:run` - Run pending migrations
- `node ace migration:rollback` - Rollback last migration batch
- `node ace db:seed` - Run database seeders
- `node ace make:migration <name>` - Create new migration
- `node ace make:model <name>` - Create new model
- `node ace make:controller <name>` - Create new controller

### Swagger Documentation

- `node ace docs:generate` - Generate Swagger documentation
- Swagger UI available at `/docs` in development
- API documentation uses adonis-autoswagger

## Architecture Overview

### Project Structure

This is an AdonisJS 6 application following a domain-driven structure:

```
app/
├── auth/           # Authentication controllers and middleware
├── categories/     # Category management (controllers, models)
├── core/          # Core application components (exceptions, middleware)
├── plugins/       # Plugin management (controllers, models)
└── users/         # User management (controllers, models)
```

### Key Technologies

- **Framework**: AdonisJS 6 with TypeScript
- **Database**: PostgreSQL with Lucid ORM
- **Authentication**: Token-based using AdonisJS Auth
- **File Storage**: AdonisJS Drive for plugin files and thumbnails
- **API Documentation**: Swagger via adonis-autoswagger
- **ID Generation**: ULID for all primary keys

### Domain Models

**Plugin Model** (`app/plugins/models/plugin.ts`):

- Core entity for VST plugins and audio tools
- Supports pricing (including sales), file attachments, screenshots
- JSON fields for tags, features, presets
- Belongs to User (author), many-to-many with Categories

**User Model** (`app/users/models/user.ts`):

- Authentication via email/password with scrypt hashing
- Access tokens for API authentication
- Profile fields: username, bio, avatar, slug

**Category Model**:

- Hierarchical categorization for plugins
- Many-to-many relationship with plugins

### Route Organization

Routes are modularized in `start/routes/`:

- `auth.ts` - Authentication endpoints (/auth/\*)
- `plugin.ts` - Plugin CRUD and download (/plugins/\*)
- `category.ts` - Category management (/categories/\*)
- `users.ts` - User profiles and listings (/users/\*)
- `swagger.ts` - API documentation endpoints

### Controller Pattern

Controllers follow a single-action pattern using `execute()` method:

- Import controllers dynamically in routes
- One controller per endpoint for clear separation
- Controllers organized by domain (auth/, plugins/, categories/, users/)

### Database Schema

- Uses PostgreSQL with Lucid ORM
- ULID primary keys (26 characters)
- JSON columns for arrays (tags, features, screenshots)
- File storage paths stored as strings, actual files in storage/

### File Storage

- Plugin files: `storage/plugins/vst/`
- Thumbnails: `storage/plugins/thumbnails/`
- Uses AdonisJS Drive for file management

### Import Mapping

The project uses TypeScript path mapping:

- `#auth/*` → `./app/auth/*.js`
- `#plugins/*` → `./app/plugins/*.js`
- `#users/*` → `./app/users/*.js`
- `#categories/*` → `./app/categories/*.js`
- `#core/*` → `./app/core/*.js`
- `#config/*` → `./config/*.js`
- `#database/*` → `./database/*.js`

### Authentication & Authorization

- Token-based authentication using AdonisJS Auth
- Protected routes use `auth` middleware
- Public endpoints for browsing plugins/categories
- User registration/login via JSON API

### API Design

- RESTful API design with JSON responses
- Force JSON middleware ensures consistent response format
- Swagger documentation auto-generated from decorators
- CORS enabled for frontend integration
