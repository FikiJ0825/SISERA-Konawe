-- Tabel kecil untuk keep-alive (dipanggil workflow GitHub Actions agar project tidak di-pause).
-- Aman dihapus nanti: drop table public.keepalive;
create table if not exists public.keepalive (
  id int primary key,
  note text not null default 'keep-alive'
);

insert into public.keepalive (id) values (1) on conflict (id) do nothing;

alter table public.keepalive enable row level security;

drop policy if exists "keepalive dapat dibaca anon" on public.keepalive;
create policy "keepalive dapat dibaca anon"
  on public.keepalive for select
  to anon
  using (true);

grant select on public.keepalive to anon;
