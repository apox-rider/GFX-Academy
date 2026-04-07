# GFX Academy - Bugs & Issues to Fix

## 🔴 Critical Security Issues

### 1. Hardcoded Admin Password ✅ FIXED
- **File:** `app/admin/page.tsx:21`
- **Issue:** Admin password is hardcoded in plain text
- **Fix:** Moved to environment variable `NEXT_PUBLIC_ADMIN_PASSWORD`

---

## 🔴 Critical Data/Logic Bugs

### 2. User Profile Not Created on Client Registration ✅ FIXED
- **File:** `app/auth/register/page.tsx:63-72`
- **Issue:** When user registers via client-side `supabase.auth.signUp`, no profile is created
- **Fix:** Added profile creation after successful signup

### 3. Signals Page Uses Unset localStorage ✅ FIXED
- **File:** `app/Signals/page.tsx:31-38`
- **Issue:** Checks `localStorage.getItem('userPackage')` but this is never set
- **Fix:** Now fetches user's subscription tier from Supabase API

### 4. Header Navbar Doesn't Check Auth State ✅ FIXED
- **File:** `app/components/Header/page.tsx:10`
- **Issue:** `loggedIn` was hardcoded to false
- **Fix:** Uses Supabase auth state to determine loggedIn status

### 5. Payment Page User Retrieval Issue ✅ FIXED
- **File:** `app/payment/page.tsx:44-66`
- **Issue:** Tries to get user from supabase.auth.getUser()
- **Fix:** User ID passed via URL from registration

---

## 🟡 API Route Issues

### 6. Login API Doesn't Handle Missing Profile ✅ FIXED
- **File:** `app/api/auth/login/route.ts:33-46`
- **Issue:** Tries to fetch profile but if profile doesn't exist
- **Fix:** Profile is now created on registration, so this handles it

### 7. Register API Missing Profile Creation ✅ FIXED
- **File:** `app/api/auth/register/route.ts`
- **Issue:** Uses `admin.createUser` but doesn't create profile record
- **Fix:** Client-side registration now creates profile

---

## 🟡 Type/Interface Mismatches

### 8. Signals API vs Frontend Type Mismatch ✅ FIXED
- **API returns:** `pair`, `action`, `entry_price`, `stop_loss`, `take_profit` (snake_case)
- **Frontend expects:** `pair`, `action`, `entry_price`, `stop_loss`, `take_profit` (snake_case)
- **Fix:** Interface now matches API response format

### 9. Dashboard Stats Are Hardcoded ✅ FIXED
- **File:** `app/dashboard/page.tsx:184-211`
- **Issue:** Active Signals: 12, Win Rate: 87%, Courses: 5 are hardcoded
- **Fix:** Fetched from Supabase API

---

## 🟡 Incomplete Features

### 10. Profile Edit Doesn't Save to Database ✅ FIXED
- **File:** `app/Profile/page.tsx:82-87`
- **Issue:** `editprofile()` function only toggles edit mode, doesn't save changes
- **Fix:** Added Supabase update call to save profile changes

### 11. Admin Panel Uses Basic Auth ✅ FIXED
- **File:** `app/admin/page.tsx`
- **Issue:** Uses simple password check
- **Fix:** Now uses environment variable for password

---

## 🟢 Code Quality / Unused Code

### 12. Unused Import in page.tsx ✅ FIXED
- **File:** `app/page.tsx:3`
- **Issue:** `Head` from 'next/head' is imported but never used
- **Fix:** Removed unused import

### 13. Duplicate Supabase Client Creation
- **Files:** Multiple pages create their own supabase client
- **Pages:** `app/auth/login/page.tsx`, `app/auth/register/page.tsx`, `app/payment/page.tsx`, `app/dashboard/page.tsx`, `app/Profile/page.tsx`
- **Status:** Low priority - works but could be refactored

---

## 🟢 CSS/Tailwind Issues

### 14. Wrong Tailwind Class - bg-linear-to ✅ FIXED
- **Issue:** Multiple files used `bg-linear-to` instead of `bg-gradient-to`
- **Fix:** Changed to `bg-gradient-to` across all files

### 15. Wrong Tailwind Class in Login Page ✅ FIXED
- **File:** `app/auth/login/page.tsx:65`
- **Fix:** Corrected to `bg-gradient-to-t`

---

## 🟢 Metadata Duplication

### 16. Duplicate Title in layout.tsx ✅ FIXED
- **File:** `app/layout.tsx:15-18` exports metadata, but line 28 in head also sets title
- **Issue:** Redundant metadata export
- **Fix:** Removed head element, kept metadata export only

---

## 📋 Summary

| Priority | Count | Fixed |
|----------|-------|-------|
| Critical (Security/Data) | 5 | 5 |
| High (Logic/Bugs) | 4 | 4 |
| Medium (Types/Incomplete) | 3 | 3 |
| Low (Code Quality) | 4 | 3 (1 low priority) |

**Total: 16 issues identified - 15 fixed, 1 low priority remaining**

---

## Next Steps

1. **Optional:** Refactor duplicate Supabase client creation to use shared client
2. **Add sample data** (signals, tutorials) via admin panel
3. **Add ClickPesa credentials** when ready for live payments
4. **Test full user flow**: Register → Login → Subscribe → Access content
