-- Migration: Grant Super Admin privileges to Matiorton786@gmail.com

-- 1. If user already exists in profiles, promote to admin immediately:
update public.profiles
set role = 'admin', updated_at = now()
where lower(email) = 'matiorton786@gmail.com';

-- 2. Update handle_new_user() trigger to automatically grant admin role upon registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email, phone, role)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    new.email,
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    case 
      when lower(new.email) in ('matiorton786@gmail.com') then 'admin'
      else 'customer'
    end
  )
  on conflict (id) do update
  set role = case 
    when lower(excluded.email) in ('matiorton786@gmail.com') then 'admin'
    else public.profiles.role
  end;
  return new;
end;
$$;
