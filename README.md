# MT Solution

## Run locally

1. Install Node.js 20.9 or newer and pnpm.
2. Copy `.env.example` to `.env.local`. `.env.local` is ignored by Git and is not committed.
3. Set `NEXT_PUBLIC_SITE_URL` to the canonical public origin of the deployed website (for example, `https://www.example.com`). Use the same origin users and search engines should treat as canonical.
4. In Supabase, open **Project Settings → API** and copy the Project URL and publishable key into `.env.local`:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```

   Do not put a Postgres connection string, `service_role` key, or secret key in a `NEXT_PUBLIC_*` variable.

5. In the Supabase Dashboard, click **Connect**, choose the **Transaction pooler** connection string, and set it as `DATABASE_URL` in `.env.local`. Keep this server-only variable private and URL-encode reserved characters in the database password. The app uses this connection through the `pg` driver; Supabase Auth continues to use the project URL and publishable key above.

6. Set a Google AI Studio API key in the server-only `GEMINI_API_KEY` variable to enable AI support. `GEMINI_MODEL` is optional and defaults to `gemini-2.5-flash`. Never use a `NEXT_PUBLIC_*` prefix for these values. Optionally set `SUPPORT_CHAT_SECRET` to a long random server-only secret; if omitted, the app derives its HMAC key from `DATABASE_URL`.
7. Run `supabase/schema.sql` in the Supabase SQL Editor. It creates the public content tables and RLS policies, plus the support conversation, message, and rate-limit tables. The support tables have RLS enabled and are not granted to browser roles; the app accesses them through its server-side PostgreSQL connection.
8. Click **Admin → Register** on the site and register the owner's email/password. If Supabase email confirmation is enabled, confirm the message in the owner's inbox. Registration does **not** grant dashboard access. Copy the owner UUID shown after registration and activate the single owner slot in Supabase SQL Editor:

   ```sql
   insert into public.admin_users (user_id)
   values ('OWNER_AUTH_USER_UUID');
   ```

   The owner table is limited to a single account. Then click **Admin → Login** and use the owner's confirmed email/password to open the dashboard.

9. Start the app with `pnpm dev` and open `http://localhost:3000`.

The public website reads rates, payment methods, services, and settings from PostgreSQL. Writes use parameterized SQL in a server-only API route, which verifies the signed-in Supabase user against the single-owner allowlist before every change. Language and theme preferences are site-wide and can be changed from the dashboard's **Settings** tab. Supabase Auth must allow email/password signup for the first owner registration; turn off public signups after creating and approving that account if you don't want any more accounts registered.

The support chat stores messages in PostgreSQL for the owner-visible **Support Inbox** and sends conversation context and current business information to Google Gemini to generate replies. A notice is displayed in the chat before use. Configure the Gemini key only in the server environment. The owner should periodically review and remove support records according to the business's privacy and retention requirements; conversations are not automatically deleted.

The root page also publishes canonical/social metadata, a FinancialService JSON-LD description, `/robots.txt`, `/sitemap.xml`, and `/llms.txt`. Set `NEXT_PUBLIC_SITE_URL` to the production domain before deployment so those URLs point to the real website. Update the structured business details and AI-readable service summary if the company contact details, service area, or offerings change.

If database requests fail, confirm `.env.local` contains `DATABASE_URL` copied from the Supabase **Transaction pooler**, then restart `pnpm dev`. Only the Supabase project URL and publishable key belong in the browser-facing environment; never use the database URL/password, service-role key, or secret API key in any `NEXT_PUBLIC_*` variable.
