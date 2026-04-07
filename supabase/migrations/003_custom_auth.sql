-- ============================================
-- Custom Users Table Migration
-- For bypassing Supabase Auth email rate limits
-- ============================================

-- Enable uuid extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table for custom authentication
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    phone_number TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Update profiles table to reference our users table instead of auth.users
-- First, add new column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;

-- For existing profiles without user_id, we'll leave them as NULL initially
-- They will be linked when users migrate/regenerate their accounts
-- This allows existing profiles to continue working with Supabase Auth

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE FUNCTION update_users_updated_at();

-- Disable RLS on users table for now
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Allow anonymous access for auth operations
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anon insert on users') THEN
        CREATE POLICY "Allow anon insert on users" ON public.users FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anon select on users') THEN
        CREATE POLICY "Allow anon select on users" ON public.users FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anon update on users') THEN
        CREATE POLICY "Allow anon update on users" ON public.users FOR UPDATE USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service role on users') THEN
        CREATE POLICY "Allow service role on users" ON public.users FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
    END IF;
END $$;

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own data
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own user data') THEN
        CREATE POLICY "Users can view own user data" ON public.users FOR SELECT USING (auth.uid() = id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can create users') THEN
        CREATE POLICY "Anyone can create users" ON public.users FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own user') THEN
        CREATE POLICY "Users can update own user" ON public.users FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;
