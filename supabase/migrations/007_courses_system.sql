-- Course System Tables
-- ============================================

-- Create courses table (one-time purchases)
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'expert')),
    price INTEGER NOT NULL,
    currency TEXT DEFAULT 'TZS',
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    total_duration_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create course_modules for organizing course content
CREATE TABLE IF NOT EXISTS public.course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create course_lessons table
CREATE TABLE IF NOT EXISTS public.course_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content_type TEXT NOT NULL CHECK (content_type IN ('video', 'pdf', 'article', 'quiz')),
    content_url TEXT,
    duration_minutes INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    is_preview BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create course_purchases table
CREATE TABLE IF NOT EXISTS public.course_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'TZS',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_courses_published ON public.courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_featured ON public.courses(is_featured);
CREATE INDEX IF NOT EXISTS idx_course_modules_course ON public.course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_module ON public.course_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_course_purchases_user ON public.course_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_course_purchases_course ON public.course_purchases(course_id);

-- Enable RLS
ALTER TABLE IF EXISTS public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.course_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$
BEGIN
    -- Courses policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view published courses') THEN
        CREATE POLICY "Anyone can view published courses" ON public.courses FOR SELECT USING (is_published = true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own purchased courses') THEN
        CREATE POLICY "Users can view own purchased courses" ON public.course_purchases FOR SELECT USING (user_id = auth.uid());
    END IF;
    
    -- Course modules & lessons - published courses
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view course modules') THEN
        CREATE POLICY "Anyone can view course modules" ON public.course_modules FOR SELECT 
            USING (course_id IN (SELECT id FROM public.courses WHERE is_published = true));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view course lessons') THEN
        CREATE POLICY "Anyone can view course lessons" ON public.course_lessons FOR SELECT 
            USING (module_id IN (SELECT id FROM public.course_modules WHERE course_id IN (SELECT id FROM public.courses WHERE is_published = true)));
    END IF;
END $$;

-- Seed some sample courses
INSERT INTO public.courses (title, description, level, price, is_published, is_featured, total_lessons, total_duration_minutes)
VALUES 
    ('Forex Fundamentals', 'Master the basics of forex trading from scratch. Learn currency pairs, pips, leverage, and more.', 'beginner', 35000, true, true, 12, 180),
    ('Price Action Mastery', 'Learn to trade using pure price action. No indicators needed.', 'intermediate', 50000, true, true, 15, 240),
    ('Advanced Supply & Demand', 'Master supply and demand trading for consistent profits.', 'expert', 75000, true, false, 10, 200),
    ('Risk Management Pro', 'Learn professional risk management techniques to protect your capital.', 'beginner', 25000, true, false, 8, 120),
    ('Trading Psychology', 'Master your mindset and emotions for consistent trading success.', 'intermediate', 40000, true, false, 10, 150)
ON CONFLICT DO NOTHING;

-- Add course_purchase_id column to profiles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'purchased_courses') THEN
        ALTER TABLE public.profiles ADD COLUMN purchased_courses UUID[] DEFAULT '{}';
    END IF;
END $$;