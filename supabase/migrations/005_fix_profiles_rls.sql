-- ============================================
-- FIX: Re-apply RLS policies for profiles table
-- Drops all existing policies and recreates them cleanly.
-- Run this in Supabase SQL Editor.
-- ============================================

-- Enable RLS (idempotent)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on profiles to start clean
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_service_all" ON profiles;

-- 1. Allow authenticated users to SELECT their own profile row
CREATE POLICY "profiles_select_own"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 2. Allow authenticated users to UPDATE their own profile (role column blocked by trigger)
CREATE POLICY "profiles_update_own"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 3. Allow service_role (Edge Functions) full access — bypasses RLS anyway, but explicit
CREATE POLICY "profiles_service_all"
  ON profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
