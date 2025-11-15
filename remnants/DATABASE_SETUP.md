# Family Audio Library - Database Setup Guide

## 📊 Database Schema Overview

This application uses **Prisma ORM** with **PostgreSQL** for data management.

### Models:

1. **User** - Individual user accounts with voice cloning
2. **Family** - Family groups that share audio
3. **FamilyMember** - Junction table for users in families with roles
4. **AudioRecording** - Voice recordings and cloned audio files
5. **SharedAudio** - Permissions for audio sharing

## 🚀 Setup Instructions

### Option 1: Local Development with Prisma Postgres

1. **Start local Prisma Postgres server:**
```bash
npx prisma dev
```

2. **Generate Prisma Client:**
```bash
npx prisma generate
```

3. **Run migrations:**
```bash
npx prisma migrate dev --name init
```

### Option 2: Vercel Postgres (Production)

1. **Create a Vercel Postgres database:**
   - Go to your Vercel project dashboard
   - Navigate to Storage → Create Database → Postgres
   - Copy the connection string

2. **Update `.env` file:**
```bash
DATABASE_URL="postgres://username:password@host/database?sslmode=require"
```

3. **Generate and migrate:**
```bash
npx prisma generate
npx prisma migrate deploy
```

### Option 3: Other PostgreSQL Providers

**Supabase:**
```bash
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**Railway:**
```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/railway"
```

**Neon:**
```bash
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"
```

## 📝 Schema Breakdown

### User Table
- Stores user accounts
- Links to ElevenLabs voiceId from initial voice memo
- Tracks voice memo URL

### Family Table
- Groups of users
- Has unique invite codes for joining
- Tracks creator and metadata

### FamilyMember Table
- Links users to families
- Defines roles: ADMIN, MEMBER, VIEWER
- Controls permissions

### AudioRecording Table
- Stores all voice recordings
- Links to audio files (Vercel Blob/S3)
- Tracks voice cloning usage
- Supports tagging and privacy settings

### SharedAudio Table
- Fine-grained sharing permissions
- Controls download and edit access

## 🔐 Environment Variables

Add these to your `.env` file:

```bash
# Database
DATABASE_URL="your_postgres_connection_string"

# ElevenLabs
ELEVENLABS_API_KEY="your_elevenlabs_api_key"

# NextAuth (if using authentication)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate_with: openssl rand -base64 32"

# File Storage (optional)
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"
```

## 🛠️ Common Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Deploy migrations (production)
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Seed database (if you create a seed file)
npx prisma db seed
```

## 📦 Required Dependencies

```bash
npm install @prisma/client bcryptjs
npm install -D prisma @types/bcryptjs
```

## 🔄 Workflow

1. **User signs up** → Create User record with voice memo
2. **Clone voice** → Store ElevenLabs voiceId
3. **Create/Join family** → Create Family and FamilyMember records
4. **Upload audio** → Create AudioRecording
5. **Share audio** → Create SharedAudio permissions
6. **Generate audio** → Use stored voiceId to create new recordings

## 🎯 Next Steps

1. Install bcryptjs for password hashing:
   ```bash
   npm install bcryptjs @types/bcryptjs
   ```

2. Set up file storage for audio files (Vercel Blob recommended):
   ```bash
   npm install @vercel/blob
   ```

3. Implement authentication (NextAuth.js recommended)

4. Create API routes for:
   - User registration with voice memo upload
   - Family creation/joining
   - Audio upload and retrieval
   - Voice cloning integration

## 📚 API Route Examples

### Create User
`POST /api/auth/register`

### Create Family
`POST /api/families`

### Upload Audio
`POST /api/audio/upload`

### Join Family
`POST /api/families/[id]/join`

### Share Audio
`POST /api/audio/[id]/share`
