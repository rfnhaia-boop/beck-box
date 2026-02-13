-- Create user_products table to track purchased products
create table if not exists public.user_products (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id text not null check (product_id in ('adao', 'acao_30k', 'combo')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

-- Enable RLS
alter table public.user_products enable row level security;

-- Policies
create policy "Users can view their own products"
  on public.user_products for select
  using (auth.uid() = user_id);

create policy "Users can insert their own products"
  on public.user_products for insert
  with check (auth.uid() = user_id);
