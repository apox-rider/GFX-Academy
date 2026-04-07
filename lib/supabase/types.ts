export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PackageTier = 'bronze' | 'silver' | 'gold' | 'free'
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'pending'
export type PaymentMethod = 'mpesa' | 'tigo_pesa' | 'airtel_money' | 'halopesa' | 'card'
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'
export type SignalStatus = 'active' | 'closed' | 'cancelled'
export type SignalAction = 'BUY' | 'SELL'
export type TutorialLevel = 'beginner' | 'intermediate' | 'expert'
export type ContentType = 'video' | 'pdf' | 'article'
export type ReferralStatus = 'pending' | 'completed' | 'cancelled' | 'expired'
export type RewardType = 'discount' | 'cash' | 'free_month'
export type RewardStatus = 'pending' | 'applied' | 'cancelled'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone_number?: string | null
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          package_tier: PackageTier
          status: SubscriptionStatus
          start_date: string
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          package_tier: PackageTier
          status?: SubscriptionStatus
          start_date?: string
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          package_tier?: PackageTier
          status?: SubscriptionStatus
          end_date?: string | null
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          subscription_id: string | null
          order_reference: string
          amount: number
          currency: string
          payment_method: PaymentMethod | null
          payment_status: PaymentStatus
          clickpesa_transaction_id: string | null
          provider_reference: string | null
          package_tier: PackageTier
          customer_email: string | null
          customer_phone: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subscription_id?: string | null
          order_reference: string
          amount: number
          currency?: string
          payment_method?: PaymentMethod | null
          payment_status?: PaymentStatus
          clickpesa_transaction_id?: string | null
          provider_reference?: string | null
          package_tier: PackageTier
          customer_email?: string | null
          customer_phone?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          payment_status?: PaymentStatus
          clickpesa_transaction_id?: string | null
          provider_reference?: string | null
          subscription_id?: string | null
          metadata?: Json
          updated_at?: string
        }
      }
      signals: {
        Row: {
          id: string
          pair: string
          action: SignalAction
          entry_price: number
          stop_loss: number
          take_profit: number
          status: SignalStatus
          closing_price: number | null
          closed_at: string | null
          validity_hours: number
          min_tier: PackageTier
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pair: string
          action: SignalAction
          entry_price: number
          stop_loss: number
          take_profit: number
          status?: SignalStatus
          closing_price?: number | null
          closed_at?: string | null
          validity_hours?: number
          min_tier?: PackageTier
          created_at?: string
          updated_at?: string
        }
        Update: {
          pair?: string
          action?: SignalAction
          entry_price?: number
          stop_loss?: number
          take_profit?: number
          status?: SignalStatus
          closing_price?: number | null
          closed_at?: string | null
          validity_hours?: number
          min_tier?: PackageTier
          updated_at?: string
        }
      }
      tutorials: {
        Row: {
          id: string
          title: string
          description: string | null
          content_type: ContentType
          content_url: string | null
          duration_minutes: number | null
          pages_count: number | null
          level: TutorialLevel
          required_tier: PackageTier
          order_index: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          content_type: ContentType
          content_url?: string | null
          duration_minutes?: number | null
          pages_count?: number | null
          level?: TutorialLevel
          required_tier?: PackageTier
          order_index?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          content_type?: ContentType
          content_url?: string | null
          duration_minutes?: number | null
          pages_count?: number | null
          level?: TutorialLevel
          required_tier?: PackageTier
          order_index?: number
          is_published?: boolean
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          name: string
          email: string
          subject: string | null
          message: string
          is_read: boolean
          replied_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject?: string | null
          message: string
          is_read?: boolean
          replied_at?: string | null
          created_at?: string
        }
        Update: {
          name?: string
          email?: string
          subject?: string | null
          message?: string
          is_read?: boolean
          replied_at?: string | null
        }
      }
      settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          description?: string | null
          updated_at?: string
        }
        Update: {
          value?: Json
          description?: string | null
          updated_at?: string
        }
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referred_id: string
          referral_code: string
          status: ReferralStatus
          reward_claimed: boolean
          reward_amount: number
          reward_type: RewardType
          created_at: string
          completed_at: string | null
          expires_at: string | null
        }
        Insert: {
          id?: string
          referrer_id: string
          referred_id: string
          referral_code: string
          status?: ReferralStatus
          reward_claimed?: boolean
          reward_amount?: number
          reward_type?: RewardType
          created_at?: string
          completed_at?: string | null
          expires_at?: string | null
        }
        Update: {
          status?: ReferralStatus
          reward_claimed?: boolean
          reward_amount?: number
          reward_type?: RewardType
          completed_at?: string | null
          expires_at?: string | null
        }
      }
      referral_codes: {
        Row: {
          id: string
          user_id: string
          code: string
          usage_count: number
          max_uses: number
          reward_tier: PackageTier
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          code?: string
          usage_count?: number
          max_uses?: number
          reward_tier?: PackageTier
          is_active?: boolean
          created_at?: string
        }
        Update: {
          code?: string
          usage_count?: number
          max_uses?: number
          reward_tier?: PackageTier
          is_active?: boolean
        }
      }
      referral_rewards: {
        Row: {
          id: string
          user_id: string
          referral_id: string | null
          amount: number
          type: RewardType
          status: RewardStatus
          description: string | null
          created_at: string
          applied_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          referral_id?: string | null
          amount: number
          type: RewardType
          status?: RewardStatus
          description?: string | null
          created_at?: string
          applied_at?: string | null
        }
        Update: {
          amount?: number
          type?: RewardType
          status?: RewardStatus
          description?: string | null
          applied_at?: string | null
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          thumbnail_url: string | null
          level: TutorialLevel
          price: number
          currency: string
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          thumbnail_url?: string | null
          level?: TutorialLevel
          price: number
          currency?: string
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          thumbnail_url?: string
          level?: TutorialLevel
          price?: number
          currency?: string
          is_published?: boolean
          updated_at?: string
        }
      }
      course_purchases: {
        Row: {
          id: string
          user_id: string
          course_id: string
          payment_id: string | null
          amount: number
          currency: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          payment_id?: string | null
          amount: number
          currency?: string
          created_at?: string
        }
        Update: {
          payment_id?: string | null
        }
      }
      course_modules: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          order_index?: number
        }
      }
      course_lessons: {
        Row: {
          id: string
          module_id: string
          title: string
          description: string | null
          content_type: ContentType
          content_url: string | null
          duration_minutes: number
          order_index: number
          is_preview: boolean
          created_at: string
        }
        Insert: {
          id?: string
          module_id: string
          title: string
          description?: string | null
          content_type: ContentType
          content_url?: string | null
          duration_minutes?: number
          order_index?: number
          is_preview?: boolean
          created_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          content_url?: string | null
          duration_minutes?: number
          order_index?: number
          is_preview?: boolean
        }
      }
      trial_conversions: {
        Row: {
          id: string
          user_id: string
          trial_tier: PackageTier
          started_at: string
          converted_at: string | null
          converted_to: PackageTier | null
          status: string
        }
        Insert: {
          id?: string
          user_id: string
          trial_tier: PackageTier
          started_at?: string
          converted_at?: string | null
          converted_to?: PackageTier | null
          status?: string
        }
        Update: {
          converted_at?: string | null
          converted_to?: PackageTier | null
          status?: string
        }
      }
      lifetime_deals: {
        Row: {
          id: string
          user_id: string
          package_tier: PackageTier
          amount_paid: number
          currency: string
          payment_id: string | null
          benefits: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          package_tier: PackageTier
          amount_paid: number
          currency?: string
          payment_id?: string | null
          benefits?: Json
          created_at?: string
        }
        Update: {
          payment_id?: string | null
          benefits?: Json
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
export type Signal = Database['public']['Tables']['signals']['Row']
export type Tutorial = Database['public']['Tables']['tutorials']['Row']
export type Contact = Database['public']['Tables']['contacts']['Row']
export type Settings = Database['public']['Tables']['settings']['Row']

export interface PackagePricing {
  bronze: number
  silver: number
  gold: number
}

export interface UserSession {
  id: string
  email: string
  full_name: string | null
  phone_number: string | null
  subscription: Subscription | null
}

export type Referral = Database['public']['Tables']['referrals']['Row']
export type ReferralCode = Database['public']['Tables']['referral_codes']['Row']
export type ReferralReward = Database['public']['Tables']['referral_rewards']['Row']
export type Course = Database['public']['Tables']['courses']['Row']
export type CoursePurchase = Database['public']['Tables']['course_purchases']['Row']
export type CourseModule = Database['public']['Tables']['course_modules']['Row']
export type CourseLesson = Database['public']['Tables']['course_lessons']['Row']
export type TrialConversion = Database['public']['Tables']['trial_conversions']['Row']
export type LifetimeDeal = Database['public']['Tables']['lifetime_deals']['Row']
