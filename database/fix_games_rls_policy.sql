-- Fix Games RLS Policy - Remove Write Access from Client
-- Run this in your Supabase SQL editor

-- Remove the overly permissive policy that allows any authenticated user to manage games
DROP POLICY IF EXISTS "Authenticated users can manage games" ON public.games;

-- Keep the read policy (this is fine for public data)
-- "Anyone can view games" policy already exists and is correct

-- Note: Game management (create, update, delete) is now handled through API routes
-- which provide proper authentication and authorization checks
