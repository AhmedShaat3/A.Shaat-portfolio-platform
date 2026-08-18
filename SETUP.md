# SETUP.md

Step-by-step instructions to run this project locally and deploy it.

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and, at minimum, review:

- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — the login created by the seed
  script. **Change the password before deploying anywhere public.**
- `DATABASE_URL` — defaults to a local SQLite file, no changes needed for
  local development.
- `STORAGE_DRIVER` — defaults to `local`, no changes needed for local
  development.

## 3. Set up the database

This project uses **Drizzle ORM**. No local Postgres install is required for
development — it runs on SQLite out of the box via `better-sqlite3`.

```bash
npm run db:push    # creates db/portfolio.db and all tables from db/schema.ts
npm run db:seed    # inserts your profile, projects, skills, etc.
```

`db:seed` prints the admin login it created, e.g.:

```
Admin login -> email: admin@portfolio.local  password: ChangeMe123!
```

Re-running `npm run db:seed` on a non-empty database will fail on unique
constraints (e.g. the profile row) — this is expected; the seed script is
meant to run once against a fresh database. To start over:

```bash
rm db/portfolio.db db/portfolio.db-*   # delete the SQLite file(s)
npm run db:push
npm run db:seed
```

### Creating additional admin accounts

There's no "invite user" UI in this build (the spec is a single-owner
portfolio). To add another admin, insert a row directly:

```bash
npx tsx -e "
import { db } from './db/client';
import { users } from './db/schema';
import { hashPassword } from './lib/auth/password';
import { nanoid } from './lib/utils/id';

const passwordHash = await hashPassword('SomeStrongPassword1');
await db.insert(users).values({
  id: nanoid(),
  name: 'Second Admin',
  email: 'second@portfolio.local',
  passwordHash,
  role: 'admin',
});
console.log('created');
"
```

## 4. Run the development server

```bash
npm run dev
```

- Public site: `http://localhost:3000` (redirects to `/en`; also try `/ar`)
- Admin login: `http://localhost:3000/admin/login`

## 5. Build for production

```bash
npm run build
npm run start
```

## 6. Deploying to Vercel

1. Push this repo to GitHub/GitLab/Bitbucket and import it in Vercel.
2. **Before your first deploy, decide on your database** — SQLite's local
   file storage does **not** persist on Vercel's serverless functions (the
   filesystem is ephemeral and read-only in production). You must move to
   Postgres for a Vercel deployment. See the next section.
3. **Decide on your file storage** — the same applies to uploads: `local`
   storage will not persist on Vercel. Use Vercel Blob or S3. See
   "Configuring image storage" below.
4. Set your environment variables in the Vercel dashboard (same keys as
   `.env.example`).
5. Deploy.

## 7. Moving to PostgreSQL

The schema in `db/schema.ts` is written in a Postgres-compatible way on
purpose. To switch:

1. Provision a Postgres database (Vercel Postgres, Neon, Supabase, RDS, etc.)
   and get its connection string.
2. Install the Postgres driver:
   ```bash
   npm install postgres
   ```
3. Edit **`db/client.ts`** — replace the SQLite setup with:
   ```ts
   import postgres from "postgres";
   import { drizzle } from "drizzle-orm/postgres-js";
   import * as schema from "./schema";

   const client = postgres(process.env.DATABASE_URL!);
   export const db = drizzle(client, { schema });
   ```
4. Edit **`db/schema.ts`** — change the import from
   `drizzle-orm/sqlite-core` to `drizzle-orm/pg-core`, and swap:
   - `sqliteTable` → `pgTable`
   - `text(...)` stays `text(...)` (compatible)
   - `integer(col, { mode: "boolean" })` → `boolean(col)`
   - `sql\`(current_timestamp)\`` defaults stay the same
5. Edit **`drizzle.config.ts`** — change `dialect: "sqlite"` to
   `dialect: "postgresql"` and remove `dbCredentials.url` in favor of reading
   `DATABASE_URL`.
6. Run `npm run db:generate && npm run db:push` against the new database, then
   `npm run db:seed`.

This is intentionally a small, mechanical change — the rest of the
application (every query, every server action) is written against Drizzle's
query builder and does not change.

## 8. Configuring image storage

The storage abstraction lives in `lib/storage/`. Switch providers with the
`STORAGE_DRIVER` environment variable.

### Vercel Blob

```bash
npm install @vercel/blob
```

Create `lib/storage/vercel-blob.ts`:

```ts
import { put, del } from "@vercel/blob";
import type { StorageAdapter } from "./types";

export const vercelBlobAdapter: StorageAdapter = {
  async upload({ buffer, filename, folder }) {
    const blob = await put(`${folder}/${Date.now()}-${filename}`, buffer, {
      access: "public",
    });
    return { url: blob.url, filename, size: buffer.byteLength };
  },
  async delete(url) {
    await del(url);
  },
};
```

Then register it in `lib/storage/index.ts`'s `resolveAdapter()` switch
statement, and set `STORAGE_DRIVER=vercel-blob` + `BLOB_READ_WRITE_TOKEN` in
your environment.

### AWS S3

```bash
npm install @aws-sdk/client-s3
```

Create `lib/storage/s3.ts` implementing the same `StorageAdapter` interface
using `PutObjectCommand` / `DeleteObjectCommand`, register it the same way,
and set `STORAGE_DRIVER=s3` plus the `AWS_*` variables from `.env.example`.

### Cloudinary

```bash
npm install cloudinary
```

Same pattern — implement `StorageAdapter` in `lib/storage/cloudinary.ts`
using the Cloudinary upload/destroy APIs, register it, set
`STORAGE_DRIVER=cloudinary` plus the `CLOUDINARY_*` variables.

## 9. Completing 2FA (optional, architecture only)

`users.twoFactorSecret` and `users.twoFactorEnabled` already exist in the
schema. To finish the feature:

1. `npm install otplib qrcode`
2. Add a "Enable 2FA" flow in `/admin/security` that generates a secret,
   shows a QR code, and verifies a code before setting `twoFactorEnabled`.
3. In `lib/auth/login.ts`, after password verification succeeds, check
   `twoFactorEnabled` and require a valid TOTP code before calling
   `createSession`.

## 10. Known environment-specific notes

- **Fonts** are self-hosted via `@fontsource` packages rather than
  `next/font/google`, because the environment this was built in could not
  reach Google's font CDN. If your deployment target can reach it, switching
  to `next/font/google` is optional and not required — the current setup
  works everywhere.
- **`proxy.ts`** (formerly `middleware.ts`) handles the `/` → `/en` redirect
  and a fast cookie-presence check for `/admin/*`. The authoritative auth
  check is server-side in `app/admin/(protected)/layout.tsx` — the proxy
  check is just an early filter, not the security boundary.

## Troubleshooting

- **"UNIQUE constraint failed" on seed** — you already have data; see the
  "start over" steps above.
- **Uploads return 401** — you're not logged in; the upload API requires an
  active admin session.
- **Images don't show after uploading (production)** — you're likely still on
  `STORAGE_DRIVER=local` on a host with an ephemeral filesystem (e.g.
  Vercel). Switch to Blob/S3/Cloudinary per section 8.
