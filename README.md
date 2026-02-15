 # 📈 GalileeFX Academy

**Master Forex. Trade with Confidence.** A high-performance, slate-themed Forex education and signals platform built with **Next.js 14+**, specifically optimized for the Tanzanian trading community with localized mobile money integration.

---

## 🚀 Tech Stack

* **Frontend:** [Next.js 14 (App Router)](https://nextjs.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Animations:** Framer Motion (Ready for integration)
* **Typography:** Orbitron (Headings) & Inter (Body)

---

## ✨ Features Implemented

### 🎨 Premium Slate Aesthetic
* **Dark-Mode First:** Deep `slate-950` backgrounds combined with `yellow-500` (Gold) accents for a professional, high-trust financial feel.
* **Glassmorphism:** Navigation and signal cards feature backdrop-blur effects to maintain depth and modern UI standards.
* **Responsive Design:** Mobile-optimized navigation and layouts, ensuring accessibility for traders using mobile data.

### 📊 Professional Signal Feed
* **Institutional Indicators:** Real-time BUY/SELL alerts with precise Entry, Stop Loss (SL), and Take Profit (TP) levels.
* **Conversion Optimization:** Public "teaser" signals feature blurred data points to encourage user registration and subscription.

### 📚 Education & Mentorship
* **Tiered Packages:** * **Bronze:** Entry-level basics.
    * **Silver:** Advanced strategies and 1-month mentorship.
    * **Gold:** Lifetime access, VIP signals, and direct mentorship.
* **Integrated Learning:** Video-grid components with lock/unlock logic based on user subscription status.

### 💳 Tanzanian Localized Payments
* **Mobile Money Ready:** Dedicated UI/UX for **M-Pesa**, **Tigo Pesa**, and **Airtel Money**.
* **Currency Localisation:** Pricing structured in **TZS** to remove conversion friction for local students.

---

## 📁 Project Structure

```bash
GFX-ACADEMY/
├── src/
│   ├── app/                # Next.js App Router (Pages & API)
│   │   ├── auth/           # Login, Register, Password Recovery
│   │   ├── dashboard/      # Protected User Area (Courses, Signals, Profile)
│   │   ├── admin/          # Management Dashboard
│   │   └── page.tsx        # High-Conversion Landing Page
│   ├── components/
│   │   ├── common/         # Navbar, Footer, Button Components
│   │   ├── home/           # Hero, SignalsTeaser, PackagesSection, Testimonials
│   │   └── dashboard/      # Signal Cards, Course Players, Referral Trackers
│   ├── assets/             # Global CSS and Brand Assets
│   └── lib/                # Shared utilities and constant definitions
├── public/                 # Optimized Images and Video Placeholders
└── tailwind.config.ts      # Custom Slate/Gold Theme Config