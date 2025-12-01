-- In Supabase SQL Editor
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  claims jsonb;
  user_tier text;
BEGIN
  -- Fetch the user's tier from profiles
  SELECT tier INTO user_tier
  FROM public.profiles
  WHERE id = (event->>'user_id')::uuid;

  -- Set default if null
  user_tier := COALESCE(user_tier, 'free');

  -- Add tier to the JWT claims
  claims := event->'claims';
  claims := jsonb_set(claims, '{user_tier}', to_jsonb(user_tier));

  -- Return the modified event
  RETURN jsonb_set(event, '{claims}', claims);
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO postgres;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM authenticated, anon, public;


-- SELECT auth.enable_hook('com.supabase.custom-access-token', 'public.custom_access_token_hook');
