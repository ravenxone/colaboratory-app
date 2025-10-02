-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  twitter text,
  linkedin text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create projects table
create table projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  video_url text not null,
  user_problem text not null,
  talked_to_users boolean default false not null,
  roles_needed text[] not null,
  status text check (status in ('open', 'closed')) default 'open' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create collaboration_requests table
create table collaboration_requests (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  full_name text not null,
  email text not null,
  phone text,
  skills text[] not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index projects_user_id_idx on projects(user_id);
create index projects_status_idx on projects(status);
create index projects_created_at_idx on projects(created_at desc);
create index collaboration_requests_project_id_idx on collaboration_requests(project_id);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table projects enable row level security;
alter table collaboration_requests enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Projects policies
create policy "Projects are viewable by everyone"
  on projects for select
  using ( true );

create policy "Authenticated users can create projects"
  on projects for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own projects"
  on projects for update
  using ( auth.uid() = user_id );

create policy "Users can delete own projects"
  on projects for delete
  using ( auth.uid() = user_id );

-- Collaboration requests policies
create policy "Project owners can view collaboration requests for their projects"
  on collaboration_requests for select
  using (
    exists (
      select 1 from projects
      where projects.id = collaboration_requests.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Anyone can insert collaboration requests"
  on collaboration_requests for insert
  with check ( true );

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
