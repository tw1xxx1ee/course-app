create table public.platforms (
  id text primary key,
  name text not null unique,
  constraint platforms_id_not_blank
    check (id = btrim(id) and id <> ''),
  constraint platforms_name_not_blank
    check (name = btrim(name) and name <> '')
);

create table public.games (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  platform_id text not null references public.platforms(id)
    on update cascade on delete restrict,
  title text not null,
  genre text not null,
  status text not null,
  rating integer,
  note text not null default '',
  created_at timestamptz not null default now(),
  constraint games_title_length
    check (char_length(btrim(title)) between 1 and 100),
  constraint games_genre_length
    check (char_length(btrim(genre)) between 1 and 50),
  constraint games_status_allowed
    check (status in ('planned', 'playing', 'completed')),
  constraint games_rating_range
    check (rating is null or rating between 1 and 10)
);

alter table public.platforms enable row level security;
alter table public.games enable row level security;

revoke all on table public.platforms from anon, authenticated;
revoke all on table public.games from anon, authenticated;

grant select on table public.platforms to anon, authenticated;

create policy "platforms are publicly readable"
on public.platforms
for select
to anon, authenticated
using (true);
