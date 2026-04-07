-- Free Trial and Lifetime Deals
-- ============================================

-- Add new subscription types to existing enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'subscription_type') THEN
        ALTER TABLE public.subscriptions ADD COLUMN subscription_type TEXT DEFAULT 'monthly' CHECK (subscription_type IN ('monthly', 'trial', 'lifetime'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'trial_ends_at') THEN
        ALTER TABLE public.subscriptions ADD COLUMN trial_ends_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'is_lifetime') THEN
        ALTER TABLE public.subscriptions ADD COLUMN is_lifetime BOOLEAN DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'referral_discount') THEN
        ALTER TABLE public.subscriptions ADD COLUMN referral_discount INTEGER DEFAULT 0;
    END IF;
END $$;

-- Create trial_conversions table to track trial signups
CREATE TABLE IF NOT EXISTS public.trial_conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    trial_tier TEXT NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    converted_at TIMESTAMPTZ,
    converted_to TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'converted', 'expired', 'cancelled'))
);

-- Create lifetime_deals table for lifetime purchases
CREATE TABLE IF NOT EXISTS public.lifetime_deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    package_tier TEXT NOT NULL,
    amount_paid INTEGER NOT NULL,
    currency TEXT DEFAULT 'TZS',
    payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
    benefits JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_trial_conversions_user ON public.trial_conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_lifetime_deals_user ON public.lifetime_deals(user_id);

-- Enable RLS
ALTER TABLE IF EXISTS public.trial_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.lifetime_deals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own trials') THEN
        CREATE POLICY "Users can view own trials" ON public.trial_conversions FOR SELECT USING (user_id = auth.uid());
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own trials') THEN
        CREATE POLICY "Users can manage own trials" ON public.trial_conversions FOR ALL USING (user_id = auth.uid());
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own lifetime deals') THEN
        CREATE POLICY "Users can view own lifetime deals" ON public.lifetime_deals FOR SELECT USING (user_id = auth.uid());
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create lifetime deals') THEN
        CREATE POLICY "Users can create lifetime deals" ON public.lifetime_deals FOR INSERT WITH CHECK (user_id = auth.uid());
    END IF;
END $$;

-- Update settings with new pricing
INSERT INTO public.settings (key, value, description) VALUES
    ('trial_packages', '{"bronze": {"days": 7, "price": 0}, "silver": {"days": 3, "price": 5000}}', 'Free trial configuration by tier'),
    ('lifetime_packages', '{"bronze": {"price": 150000}, "silver": {"price": 350000}, "gold": {"price": 500000}}', 'Lifetime deal prices in TZS'),
    ('lifetime_benefits', '{"bronze": ["Basic Course Access", "Limited Signals"], "silver": ["Intermediate Course", "Daily Signals", "Priority Support"], "gold": ["Full Course Access", "Premium Signals", "1-on-1 Mentorship", "Weekly Webinars"]}', 'Lifetime deal benefits by tier')
ON CONFLICT (key) DO NOTHING;

-- Add referral_id column to payments if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'referral_id') THEN
        ALTER TABLE public.payments ADD COLUMN referral_id UUID REFERENCES public.referrals(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'is_lifetime') THEN
        ALTER TABLE public.payments ADD COLUMN is_lifetime BOOLEAN DEFAULT false;
    END IF;
END $$;