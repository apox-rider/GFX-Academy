-- Referral System Tables
-- ============================================

-- Create referrals table to track referral relationships
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    referral_code TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'expired')),
    reward_claimed BOOLEAN DEFAULT false,
    reward_amount INTEGER DEFAULT 0,
    reward_type TEXT DEFAULT 'discount' CHECK (reward_type IN ('discount', 'cash', 'free_month')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ
);

-- Create referral_codes table for users
CREATE TABLE IF NOT EXISTS public.referral_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,
    usage_count INTEGER DEFAULT 0,
    max_uses INTEGER DEFAULT 10,
    reward_tier TEXT DEFAULT 'bronze' CHECK (reward_tier IN ('bronze', 'silver', 'gold')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create referral_rewards table to track rewards
CREATE TABLE IF NOT EXISTS public.referral_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    referral_id UUID REFERENCES public.referrals(id) ON DELETE SET NULL,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('discount', 'cash', 'free_month')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'cancelled')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    applied_at TIMESTAMPTZ
);

-- Add referral_id column to subscriptions if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'referral_id') THEN
        ALTER TABLE public.subscriptions ADD COLUMN referral_id UUID REFERENCES public.referrals(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON public.referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON public.referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_user ON public.referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON public.referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_user ON public.referral_rewards(user_id);

-- Enable RLS
ALTER TABLE IF EXISTS public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.referral_rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$
BEGIN
    -- Referrals policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own referrals') THEN
        CREATE POLICY "Users can view own referrals" ON public.referrals FOR SELECT USING (referrer_id = auth.uid() OR referred_id = auth.uid());
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can create referrals') THEN
        CREATE POLICY "Anyone can create referrals" ON public.referrals FOR INSERT WITH CHECK (true);
    END IF;
    
    -- Referral codes policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own referral code') THEN
        CREATE POLICY "Users can view own referral code" ON public.referral_codes FOR SELECT USING (user_id = auth.uid());
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view referral codes by code') THEN
        CREATE POLICY "Anyone can view referral codes by code" ON public.referral_codes FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage own referral codes') THEN
        CREATE POLICY "Users can manage own referral codes" ON public.referral_codes FOR ALL USING (user_id = auth.uid());
    END IF;
    
    -- Referral rewards policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own referral rewards') THEN
        CREATE POLICY "Users can view own referral rewards" ON public.referral_rewards FOR SELECT USING (user_id = auth.uid());
    END IF;
END $$;

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN 'GFX-' || result;
END;
$$ LANGUAGE plpgsql;

-- Function to validate and use referral code
CREATE OR REPLACE FUNCTION use_referral_code(p_code TEXT, p_user_id UUID)
RETURNS TABLE(
    valid BOOLEAN,
    referrer_id UUID,
    reward_tier TEXT,
    message TEXT
) AS $$
DECLARE
    ref_code RECORD;
    ref RECORD;
BEGIN
    -- Find the referral code
    SELECT rc.* INTO ref_code
    FROM public.referral_codes rc
    WHERE rc.code = p_code AND rc.is_active = true;

    IF ref_code IS NULL THEN
        RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'Invalid referral code';
        RETURN;
    END IF;

    IF ref_code.usage_count >= ref_code.max_uses THEN
        RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'This referral code has reached its usage limit';
        RETURN;
    END IF;

    IF ref_code.user_id = p_user_id THEN
        RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'You cannot use your own referral code';
        RETURN;
    END IF;

    -- Check if user already used a referral
    SELECT * INTO ref
    FROM public.referrals
    WHERE referred_id = p_user_id AND status != 'cancelled';

    IF ref IS NOT NULL THEN
        RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'You have already used a referral code';
        RETURN;
    END IF;

    RETURN QUERY SELECT true, ref_code.user_id, ref_code.reward_tier, 'Referral code is valid! You will receive a ' || ref_code.reward_tier || ' tier discount on your first subscription.';
END;
$$ LANGUAGE plpgsql;

-- Seed default referral rewards settings
INSERT INTO public.settings (key, value, description) VALUES
    ('referral_rewards', '{"bronze": 5000, "silver": 15000, "gold": 25000}', 'Referral reward amounts in TZS by tier'),
    ('referral_discount_percentage', '{"bronze": 10, "silver": 15, "gold": 20}', 'Discount percentage for referred users by tier')
ON CONFLICT (key) DO NOTHING;