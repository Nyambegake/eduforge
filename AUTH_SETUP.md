# Authentication setup (Supabase and Vercel)
1. SQL Editor: run migrations 001 to 007 in order.
2. Authentication, Sign In / Providers, Email: enabled, "Confirm email" ON, minimum password length 8.
3. Authentication, URL Configuration: Site URL `https://eduforge-pefi.vercel.app`. Redirect URLs: `https://eduforge-pefi.vercel.app/**` and `http://localhost:3000/**`.
4. Production email: add your own SMTP (Authentication, SMTP Settings). Supabase's built-in sender is rate-limited.
5. Register once, verify the email, then make yourself Super Administrator with the SQL at the bottom of migration 003.
6. Vercel: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (public values only).

## Admin user management (migration 008)
1. Run `database/migrations/008_admin_user_management.sql` in the Supabase SQL Editor.
2. Log in as Super Administrator and open `/admin/users` (dashboard link "Users").
3. Approve pending institution administrators, change roles, suspend or restore accounts.
Rules enforced in the database: nobody can change their own role/status; only a Super Administrator can grant or change `super_admin`.
