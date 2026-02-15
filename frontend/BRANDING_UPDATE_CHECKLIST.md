# Sampada Rebrand – Verification Checklist

All references to "Infiverse HR" / "BHIV HR" have been updated to **Sampada** with **HR Recruitment System** as the subtitle/tagline. Use this checklist to verify each location in the frontend.

---

## 1. Document & Meta

| Location | What to verify |
|----------|----------------|
| **`index.html`** | Browser tab title shows **"Sampada - HR Recruitment System"** |

---

## 2. Splash Screen (first load / refresh)

| Location | What to verify |
|----------|----------------|
| **`SplashScreen.tsx`** | Main title: **Sampada** (gradient). Subtitle: **HR Recruitment System**. Footer: "Powered by AI • Built for Modern Recruitment" (unchanged). |

---

## 3. Role Selection Page (`/`)

| Location | What to verify |
|----------|----------------|
| **`RoleSelection.tsx`** | Header: **Sampada** (gradient) with **HR Recruitment System** underneath. Footer: **© 2024 Sampada.** Powered by AI • Built for Modern Recruitment |

---

## 4. Authentication Pages

| Location | What to verify |
|----------|----------------|
| **`AuthPage.tsx`** (login/signup) | Left side: logo + **Sampada** with **HR Recruitment System** as subtitle below. |

---

## 5. Public Navbar (pre-login / landing)

| Location | What to verify |
|----------|----------------|
| **`Navbar.tsx`** | Logo letter: **S**. Brand: **Sampada** with **HR Recruitment System** underneath. User email placeholder: **admin@sampada.hr**. |

---

## 6. Role-Specific Navbars (after login)

| Location | What to verify |
|----------|----------------|
| **`RoleNavbar.tsx`** (Recruiter / Client / Candidate) | Logo area: **Sampada** (gradient). Subtitle: **HR Recruitment System**. Mobile view: **Sampada** only. |

---

## 7. Sidebars (role-based)

| Location | What to verify |
|----------|----------------|
| **`ClientSidebar.tsx`** | Fallback email when no user email: **client@sampada.hr** (e.g. in user section at bottom). |
| **`RecruiterSidebar.tsx`** | Fallback email: **recruiter@sampada.hr**. |
| **`CandidateSidebar.tsx`** | Fallback email: **candidate@sampada.hr**. |

---

## 8. Dashboard & Page Headers

| Location | What to verify |
|----------|----------------|
| **`ClientDashboard.tsx`** | Page header: **Sampada Client Portal** with existing subtitle. |

---

## 9. Documentation (optional)

| Location | What to verify |
|----------|----------------|
| **`README.md`** | Title: **Sampada - HR Recruitment System (Frontend)**. Footer: **Built with ❤️ for Sampada - HR Recruitment System**. |
| **`VERCEL_DEPLOYMENT.md`** | Title and intro refer to **Sampada (HR Recruitment System)**. |

---

## Summary of Files Changed

1. `frontend/index.html` – page title  
2. `frontend/src/components/SplashScreen.tsx` – brand + tagline  
3. `frontend/src/pages/auth/AuthPage.tsx` – brand + tagline  
4. `frontend/src/components/navbars/RoleNavbar.tsx` – brand + tagline (desktop & mobile)  
5. `frontend/src/pages/RoleSelection.tsx` – brand + tagline + footer  
6. `frontend/src/components/Navbar.tsx` – brand + tagline + logo initial + admin email  
7. `frontend/src/pages/client/ClientDashboard.tsx` – header title  
8. `frontend/src/components/sidebars/ClientSidebar.tsx` – fallback email  
9. `frontend/src/components/sidebars/RecruiterSidebar.tsx` – fallback email  
10. `frontend/src/components/sidebars/CandidateSidebar.tsx` – fallback email  
11. `frontend/README.md` – project name  
12. `frontend/VERCEL_DEPLOYMENT.md` – project name  

No other instances of "Infiverse" or "BHIV HR" remain in the frontend UI; role names (e.g. "Recruiter Console", "Candidate Portal") are unchanged.
