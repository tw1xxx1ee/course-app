alter table public.games
  drop constraint if exists games_platform_id_fkey;

alter table public.games
  add constraint games_platform_id_fkey
  foreign key (platform_id) references public.platforms(id)
  on update cascade on delete restrict;

create index if not exists games_owner_status_idx
  on public.games(owner_id, status);

create index if not exists games_platform_id_idx
  on public.games(platform_id);
