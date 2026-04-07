-- Fix user_id references in subscriptions and payments to point to users table
-- Drop existing foreign keys first
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_user_id_fkey;
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_user_id_fkey;

-- Add new foreign keys to users table
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.payments ADD CONSTRAINT payments_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;