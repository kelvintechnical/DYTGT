## DYTGT (Did You Thank God Today)

DYTGT is a minimalist, gratitude‑focused Bible app built with React Native and Expo.  
Each day the app shows a single verse, a short reflection, and invites you to tap one quiet button: **“I Thanked God Today.”**  
No feeds, no noise—just Scripture, reflection, and a growing streak of daily gratitude.

---

### Features

- **Daily verse & reflection**
  - One carefully chosen verse per day (static JSON for the MVP).
  - A 1–2 sentence reflection to gently prompt gratitude.
- **Single daily action**
  - An **“I Thanked God Today”** button that can be tapped once per day.
  - Locks after completion to keep the practice simple and intentional.
- **Streaks**
  - Local streak counter that tracks consecutive days of gratitude.
  - Simple streak summary screen to celebrate consistency.
- **Onboarding & Authentication**
  - Lightweight onboarding that explains the rhythm of the app.
  - Authentication flow designed for:
    - Anonymous sign‑in (MVP first).
    - Apple / Google sign‑in via Firebase (scaffolded, not yet wired).
- **Subscriptions & Paywall (Scaffolded)**
  - Mandatory subscription model concept:
    - 7‑day free trial.
    - **$4.99 / month**.
    - **$9.99 / year**.
  - RevenueCat SDK wired in at the client level (configuration, entitlement check helpers).
  - Paywall screen with monthly & yearly options and restore‑purchases entry point.
- **Settings**
  - Stubs for:
    - Restore purchases.
    - Logout.
    - Delete account.
- **Design**
  - Dark‑mode‑first aesthetic that feels like evening prayer.
  - Centralized olive/sage palette ready for light and dark modes.

---

### Tech Stack

- **Framework**: React Native + Expo (TypeScript template)
- **Language**: TypeScript
- **Navigation**: React Navigation (native stack)
- **State & Storage**:
  - React Context for subscription and streak state.
  - `@react-native-async-storage/async-storage` for local persistence.
- **Auth (planned)**: Firebase Authentication
  - Anonymous
  - Apple
  - Google
- **Subscriptions (planned)**: RevenueCat SDK
  - Native in‑app purchases via App Store / Google Play.
  - Entitlement management and receipt validation.

---

### Subscription Model & Pricing

All app access is designed to sit behind a subscription managed by RevenueCat:

- **7‑day free trial** for all new users.
- **$4.99 / month** subscription.
- **$9.99 / year** subscription (best value).

Access logic (conceptual):

```text
IF subscriptionActive OR trialActive
  → allow access to daily verse
ELSE
  → show paywall
```

In the current scaffold:

- RevenueCat is set up at the client level (API key placeholders and entitlement check helpers).
- The `SubscriptionContext` is ready to be extended with real entitlement state.
- Purchase and restore flows in the Paywall and Settings screens are stubbed with TODOs.

---

### App Philosophy

- **Extremely minimal UI**
  - One primary action per day.
  - No complex menus, feeds, or distractions.
- **Reverent & calm**
  - Dark mode by default, tuned to feel like quiet evening prayer—not harsh “system dark.”
  - Copy is gentle, non‑performative, and focused on gratitude.
- **Intentionally limited**
  - No full Bible reader.
  - No verse search.
  - No social feed or public streaks.
- **Respectful of attention**
  - No ads.
  - No engagement tricks—just an invitation to thank God once a day.

---

### Project Structure (High Level)

```text
DYTGT/
  App.tsx                    # Root app; wraps providers and navigation
  app.json                   # Expo app configuration
  src/
    navigation/
      index.tsx              # Root stack navigator
    components/
      PrimaryButton.tsx      # Reusable primary CTA button
      ScreenContainer.tsx    # Shared layout & safe area wrapper
    screens/
      OnboardingScreen.tsx   # Intro to the daily rhythm
      AuthScreen.tsx         # Anonymous / Apple / Google auth stubs
      PaywallScreen.tsx      # Trial + subscription paywall UI
      HomeScreen.tsx         # Daily verse, reflection, and gratitude button
      StreakScreen.tsx       # Streak summary view
      SettingsScreen.tsx     # Restore, logout, delete account stubs
    state/
      SubscriptionContext.tsx# Onboarding + entitlement state (scaffolded)
      StreakContext.tsx      # Local streak state & persistence
      RevenueCatClient.ts    # RevenueCat configure + entitlement helper
    config/
      subscriptions.ts       # RevenueCat keys, entitlement & product IDs (placeholders)
    data/
      dailyVerses.ts         # Static JSON-like daily verse + reflection set
    theme/
      colors.ts              # Shared light/dark palette (olive/sage)
```

---

### Environment Variables & Configuration

For local development you will need configuration for:

- **Firebase**
  - API key
  - Auth domain / project ID
  - App ID, etc.
- **RevenueCat**
  - iOS public SDK key.
  - Android public SDK key.
  - Entitlement ID (e.g. `pro`).
  - Product identifiers:
    - `dytgt_monthly`
    - `dytgt_yearly`

In the current scaffold:

- `src/config/subscriptions.ts` contains placeholder values for:
  - `REVENUECAT_API_KEY_IOS`
  - `REVENUECAT_API_KEY_ANDROID`
  - `ENTITLEMENT_PRO`
  - `MONTHLY_PRODUCT_ID`
  - `YEARLY_PRODUCT_ID`
- Replace these values with your actual keys and IDs, or move them into an environment system such as **Expo config plugins** or `.env` files using libraries like `expo-constants` or `react-native-dotenv`.

Firebase configuration is not yet wired—add your own Firebase initialization file (e.g. `src/config/firebase.ts`) and call it early in the app lifecycle when you are ready.

---

### Local Development Setup

#### Prerequisites

- Node.js (LTS recommended)
- npm or yarn
- Expo CLI tooling (`npx` will install as needed)
- iOS Simulator (Xcode) or Android Emulator, or a physical device with the Expo Go app installed

#### Install dependencies

```bash
npm install
```

#### Run the development server

```bash
npm run start
```

Then:

- Press **`a`** to open the Android emulator (if configured).
- Press **`i`** to open the iOS simulator (macOS only).
- Or scan the QR code with the Expo Go app on your device.

---

### Build & Run (Native)

For native builds using EAS (recommended):

```bash
npx expo login          # if not already logged in
npx expo install expo-dev-client
npx expo prebuild       # configure native projects
npx expo run:android    # or run:ios (on macOS)
```

When you are ready for app store builds, configure:

- App icons, splash screens, and branding in `app.json`.
- EAS build profiles in `eas.json` (not yet created in this scaffold).

---

### Implementation Notes & Next Steps

- **Auth wiring**
  - Connect Firebase Auth for:
    - Anonymous sign‑in on first run.
    - Apple / Google sign‑in from the Auth screen.
  - Persist Firebase user ID alongside local streak data when ready for sync.
- **RevenueCat integration**
  - Add real RevenueCat keys to `src/config/subscriptions.ts`.
  - Call `configureRevenueCat()` early in app startup.
  - Replace the stubbed navigation in the Paywall and Settings screens with:
    - Real purchase flows.
    - Real restore‑purchases handling.
  - Extend `SubscriptionContext` to:
    - Track entitlement state (`subscriptionActive` / `trialActive`).
    - Gate navigation so the Home screen is only accessible with an active entitlement.
- **Cloud sync (optional, later)**
  - Use Firebase Firestore (or another backend) to sync:
    - Streak count.
    - Daily completion history.
    - User preferences.

---

### Philosophy Recap

DYTGT is intentionally small:

- One Bible verse.
- One short reflection.
- One “thank You” to God.

Everything in the app—architecture, design, and subscriptions—is there to support that single daily moment of gratitude.  
Nothing more. Nothing less.


