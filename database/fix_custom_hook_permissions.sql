-- Grant necessary permissions for custom_access_token_hook to read profiles table
-- The hook runs as supabase_auth_admin and needs SELECT access to profiles

-- Grant SELECT permission on profiles table to supabase_auth_admin
GRANT SELECT ON public.profiles TO supabase_auth_admin;

-- Also grant USAGE on the schema if needed
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;

-- Verify the permissions
-- You can check with: SELECT * FROM information_schema.table_privileges WHERE grantee = 'supabase_auth_admin';
