insert into public.platforms (id, name)
values
  ('pc', 'PC'),
  ('ps5', 'PlayStation 5'),
  ('xbox', 'Xbox Series X|S'),
  ('switch', 'Nintendo Switch'),
  ('mobile', 'Мобильные устройства')
on conflict (id) do update
set name = excluded.name;
