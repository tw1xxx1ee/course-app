alter table public.games
  alter column owner_id set default auth.uid();

revoke all on table public.games from anon, authenticated;
grant select, insert, update, delete
  on table public.games to authenticated;

create policy "games select own"
on public.games for select to authenticated
using ((select auth.uid()) is not null
  and (select auth.uid()) = owner_id);

create policy "games insert own"
on public.games for insert to authenticated
with check ((select auth.uid()) is not null
  and (select auth.uid()) = owner_id);

create policy "games update own"
on public.games for update to authenticated
using ((select auth.uid()) is not null
  and (select auth.uid()) = owner_id)
with check ((select auth.uid()) is not null
  and (select auth.uid()) = owner_id);

create policy "games delete own"
on public.games for delete to authenticated
using ((select auth.uid()) is not null
  and (select auth.uid()) = owner_id);
