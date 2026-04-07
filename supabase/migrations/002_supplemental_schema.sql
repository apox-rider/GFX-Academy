-- ============================================
-- Supplemental Migration - Add missing parts
-- ============================================

-- Add missing columns to profiles if they don't exist
DO $$ 
BEGIN
   IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone_number') THEN
       ALTER TABLE public.profiles ADD COLUMN phone_number TEXT;
   END IF;
END $$;

-- Add missing columns to contacts if they don't exist  
DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'replied_at') THEN
       ALTER TABLE public.contacts ADD COLUMN replied_at TIMESTAMPTZ;
   END IF;
END $$;

-- Create settings table if not exists
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tutorials table if not exists
CREATE TABLE IF NOT EXISTS public.tutorials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    content_type TEXT NOT NULL CHECK (content_type IN ('video', 'pdf', 'article')),
    content_url TEXT,
    duration_minutes INTEGER,
    pages_count INTEGER,
    level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'expert')),
    required_tier TEXT DEFAULT 'bronze' CHECK (required_tier IN ('bronze', 'silver', 'gold', 'free')),
    order_index INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create signals table if not exists
CREATE TABLE IF NOT EXISTS public.signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pair TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('BUY', 'SELL')),
    entry_price DECIMAL(12, 5) NOT NULL,
    stop_loss DECIMAL(12, 5) NOT NULL,
    take_profit DECIMAL(12, 5) NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'cancelled')),
    closing_price DECIMAL(12, 5),
    closed_at TIMESTAMPTZ,
    validity_hours INTEGER DEFAULT 24,
    min_tier TEXT DEFAULT 'bronze' CHECK (min_tier IN ('bronze', 'silver', 'gold')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns to payments if they don't exist
DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'subscription_id') THEN
       ALTER TABLE public.payments ADD COLUMN subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL;
   END IF;
   IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'clickpesa_transaction_id') THEN
       ALTER TABLE public.payments ADD COLUMN clickpesa_transaction_id TEXT;
   END IF;
   IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'provider_reference') THEN
       ALTER TABLE public.payments ADD COLUMN provider_reference TEXT;
   END IF;
END $$;

-- Add missing columns to subscriptions if they don't exist
DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'package_tier') THEN
       ALTER TABLE public.subscriptions ADD COLUMN package_tier TEXT CHECK (package_tier IN ('bronze', 'silver', 'gold', 'free'));
   END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_reference ON public.payments(order_reference);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_signals_status ON public.signals(status);
CREATE INDEX IF NOT EXISTS idx_signals_min_tier ON public.signals(min_tier);
CREATE INDEX IF NOT EXISTS idx_tutorials_required_tier ON public.tutorials(required_tier);
CREATE INDEX IF NOT EXISTS idx_tutorials_published ON public.tutorials(is_published);

-- Enable RLS on new tables
ALTER TABLE IF EXISTS public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.signals ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view settings') THEN
        CREATE POLICY "Anyone can view settings" ON public.settings FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view published tutorials') THEN
        CREATE POLICY "Anyone can view published tutorials" ON public.tutorials FOR SELECT USING (is_published = true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view active signals') THEN
        CREATE POLICY "Anyone can view active signals" ON public.signals FOR SELECT USING (true);
    END IF;
END $$;

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to existing tables
DROP TRIGGER IF EXISTS update_signals_updated_at ON public.signals;
CREATE TRIGGER update_signals_updated_at BEFORE UPDATE ON public.signals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tutorials_updated_at ON public.tutorials;
CREATE TRIGGER update_tutorials_updated_at BEFORE UPDATE ON public.tutorials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed settings data
INSERT INTO public.settings (key, value, description) VALUES
    ('site_name', '"GalileeFX Academy"', 'Website name'),
    ('tagline', '"Master Forex Trading"', 'Website tagline'),
    ('contact_email', '"meshackaidan3@gmail.com"', 'Contact email'),
    ('whatsapp_number', '"+255700000000"', 'WhatsApp number'),
    ('default_currency', '"TZS"', 'Default currency'),
    ('packages', '{"bronze": 25000, "silver": 100000, "gold": 130000}', 'Package prices in TZS')
ON CONFLICT (key) DO NOTHING;
