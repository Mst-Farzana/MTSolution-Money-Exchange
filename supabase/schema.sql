create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create unique index if not exists admin_users_single_owner_idx
  on public.admin_users ((true));

create table if not exists public.exchange_rates (
  id text primary key,
  pair text not null,
  rate text not null,
  change text not null default '+0.00%',
  logo text not null default '💱',
  sort_order integer not null default 0
);

create table if not exists public.payment_methods (
  id text primary key,
  name text not null,
  emoji text not null default '💱',
  color text not null default '#1a7fff',
  sort_order integer not null default 0
);

create table if not exists public.services (
  id text primary key,
  title text not null,
  bengali text not null default '',
  description text not null default '',
  steps text not null default '',
  accent text not null default '#1a7fff',
  sort_order integer not null default 0
);

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  phone text not null default '+8801975836717',
  email text not null default 'mt.solution2425@gmail.com',
  address text not null default 'Chittagong, Bangladesh',
  hours text not null default 'Always Open (24/7)',
  language text not null default 'bn' check (language in ('bn', 'en')),
  theme text not null default 'dark' check (theme in ('dark', 'light')),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_conversations (
  id uuid primary key,
  access_token_hash text not null,
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists support_conversations_status_updated_idx
  on public.support_conversations (status, updated_at desc);

create table if not exists public.support_messages (
  id bigint generated always as identity primary key,
  conversation_id uuid not null references public.support_conversations (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'admin')),
  content text not null check (length(content) between 1 and 4000),
  created_at timestamptz not null default now()
);

create index if not exists support_messages_conversation_created_idx
  on public.support_messages (conversation_id, created_at, id);

create table if not exists public.support_chat_rate_limits (
  key_hash text primary key,
  window_started_at timestamptz not null,
  request_count integer not null check (request_count >= 1)
);

alter table public.support_conversations enable row level security;
alter table public.support_messages enable row level security;
alter table public.support_chat_rate_limits enable row level security;

revoke all on public.support_conversations from anon, authenticated;
revoke all on public.support_messages from anon, authenticated;
revoke all on public.support_chat_rate_limits from anon, authenticated;
revoke all on sequence public.support_messages_id_seq from anon, authenticated;

alter table public.admin_users enable row level security;
alter table public.exchange_rates enable row level security;
alter table public.payment_methods enable row level security;
alter table public.services enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Admins can read their own admin membership" on public.admin_users;
create policy "Admins can read their own admin membership"
  on public.admin_users for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Anyone can read exchange rates" on public.exchange_rates;
create policy "Anyone can read exchange rates"
  on public.exchange_rates for select to anon, authenticated using (true);
drop policy if exists "Admins can manage exchange rates" on public.exchange_rates;
create policy "Admins can manage exchange rates"
  on public.exchange_rates for all to authenticated
  using (exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  ));

drop policy if exists "Anyone can read payment methods" on public.payment_methods;
create policy "Anyone can read payment methods"
  on public.payment_methods for select to anon, authenticated using (true);
drop policy if exists "Admins can manage payment methods" on public.payment_methods;
create policy "Admins can manage payment methods"
  on public.payment_methods for all to authenticated
  using (exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  ));

drop policy if exists "Anyone can read services" on public.services;
create policy "Anyone can read services"
  on public.services for select to anon, authenticated using (true);
drop policy if exists "Admins can manage services" on public.services;
create policy "Admins can manage services"
  on public.services for all to authenticated
  using (exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  ));

drop policy if exists "Anyone can read site settings" on public.site_settings;
create policy "Anyone can read site settings"
  on public.site_settings for select to anon, authenticated using (true);
drop policy if exists "Admins can manage site settings" on public.site_settings;
create policy "Admins can manage site settings"
  on public.site_settings for all to authenticated
  using (exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  ));

grant select on public.exchange_rates, public.payment_methods, public.services, public.site_settings to anon;
grant select on public.admin_users to authenticated;
grant select, insert, update, delete on public.exchange_rates, public.payment_methods, public.services, public.site_settings to authenticated;

insert into public.exchange_rates (id, pair, rate, change, logo, sort_order) values
  ('1', 'Binance USDT', '120', '+0.22%', '🟡', 0),
  ('2', 'Fasset', '121', '+0.30%', '💠', 1),
  ('3', 'Payoneer USD', '118', '+0.15%', '🟧', 2),
  ('4', 'PayPal USD', '110', '-0.05%', '🅿️', 3),
  ('5', 'Trust Wallet', '118', '+0.10%', '🔵', 4),
  ('6', 'Bybit', '120', '+0.18%', '🟠', 5),
  ('7', 'Redotpay', '120', '+0.20%', '🔴', 6),
  ('8', 'Skrill USD', '115', '+0.12%', '💜', 7),
  ('9', 'Neteller', '115', '+0.08%', '🟢', 8)
on conflict (id) do nothing;

insert into public.payment_methods (id, name, emoji, color, sort_order) values
  ('1', 'Binance', '🟡', '#F0B90B', 0),
  ('2', 'Fasset', '💠', '#0066FF', 1),
  ('3', 'Payoneer', '🟧', '#FF4800', 2),
  ('4', 'PayPal', '🅿️', '#003087', 3),
  ('5', 'Trust Wallet', '🔵', '#3375BB', 4),
  ('6', 'Bybit', '🟠', '#F7A600', 5),
  ('7', 'Redotpay', '🔴', '#E2136E', 6),
  ('8', 'Skrill', '💜', '#8B0075', 7),
  ('9', 'Neteller', '🟢', '#00b272', 8),
  ('10', 'bKash', '📱', '#E2136F', 9),
  ('11', 'Nagad', '📲', '#F7941D', 10),
  ('12', 'Bank Transfer', '🏦', '#1a7fff', 11)
on conflict (id) do nothing;

insert into public.services (id, title, bengali, description, steps, accent, sort_order) values
  ('1', 'USD/USDT Exchange', 'ডলার কেনা-বেচা', 'Buy and sell USD and USDT at the best market rates. Fast processing within minutes after payment confirmation.', 'Contact via WhatsApp|Confirm amount & rate|Send payment|Receive within 10 minutes', '#1a7fff', 0),
  ('2', 'Currency Exchange', 'কারেন্সি এক্সচেঞ্জ', 'Exchange between PayPal, Payoneer, Skrill, Binance, bKash, Nagad and more. Safe and instant transfers.', 'Choose your method|Get live rate|Initiate transfer|Done in minutes', '#00d46a', 1)
on conflict (id) do nothing;

insert into public.site_settings (id) values (1) on conflict (id) do nothing;
