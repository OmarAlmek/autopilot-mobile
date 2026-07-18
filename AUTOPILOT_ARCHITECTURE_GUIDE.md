# AutoPilot Mobile (autopilot-mobile) — Engineering Blueprint & Architecture Guide

Welcome to the architecture manual and development blueprint for **AutoPilot Mobile**. This document covers application structure and engineering practices. For all frontend colors, typography, spacing, components, and interaction patterns, follow [`AUTOPILOT_DESIGN_SYSTEM.md`](./AUTOPILOT_DESIGN_SYSTEM.md), which is derived from the currently implemented screens.

---

## 🚀 1. The Supercharged Reasoning Workflow

Because your Copilot setup now routes directly through a high-context reasoning engine, you can utilize developer strategies that standard chat models fail to handle. Keep these paradigms in mind when prompting your workspace agent:

### High-Context Code Synthesis
Do not just pass single components. Feed the model your state management slices, navigation trees, and type definitions simultaneously. `gpt-5.6-sol` can execute complex refactors across multi-file boundaries without dropping edge cases.

### Algorithmic & Architectural Evaluation
When building features like background tracking, heavy data synchronization, or animation layouts, ask the model to evaluate computational complexity first:
```markdown
"Analyze this offline synchronization loop for race conditions and memory leaks before writing the React Native hook implementation."
```

---

## 🏗️ 2. Core Project Architecture

To maintain modular scalability as `autopilot-mobile` grows, we adhere to a strict **Feature-First / Domain-Driven Architecture**. This decouples business logic from UI presentation layers.

### Directory Structure Blueprint

```text
autopilot-mobile/
├── assets/                  # Fonts, static branding vectors, and localized imagery
├── src/
│   ├── api/                 # Axios/Fetch clients, endpoints, intercepted network layer
│   ├── components/          # Globally shared atomic UI atoms, molecules, and organisms
│   │   ├── common/          # Buttons, Inputs, Typography, Loading Skeletons
│   │   └── feedback/        # Modals, Toasts, Empty State states
│   ├── context/             # Global Context providers (e.g., Auth, Theme, Network status)
│   ├── features/            # Domain-driven modular blocks
│   │   ├── authentication/  # Login, Registration, OTP Validation, Hooks
│   │   ├── dashboard/       # Metric Analytics, Core Navigation Views, Feeds
│   │   └── profile/         # Settings, Dark Mode toggles, User Configuration
│   ├── hooks/               # Application-wide hooks (useDebounce, useCachedResources)
│   ├── navigation/          # Expo Router / React Navigation type-safe stacks and tabs
│   ├── store/               # State management architecture (Zustand, Redux Toolkit)
│   ├── utils/               # Cryptographic helpers, Date formatters, Validators
│   └── theme/               # Shared TypeScript design tokens and visual primitives
├── proxy.js                 # Local Azure OpenAI parameter parsing middleware
├── AUTOPILOT_DESIGN_SYSTEM.md # Frontend visual source of truth
└── package.json             # Core dependencies and optimization scripts
```

---

## 🎨 3. Design Tokens & Styling

The current application uses React Native `StyleSheet`. Continue using that styling system until an intentional project-wide migration is made; do not mix NativeWind into individual screens. The complete visual specification is maintained in [`AUTOPILOT_DESIGN_SYSTEM.md`](./AUTOPILOT_DESIGN_SYSTEM.md).

| Design Token Category | Current Value | Purpose / Application Layer |
| :--- | :--- | :--- |
| **Primary Product Accent** | `#8B5CF6` | AI, chat, active data emphasis |
| **Canvas** | `#F8F9FB` | Default screen background |
| **Surface** | `#FFFFFF` | Cards, headers, navigation, inputs |
| **Primary Typography** | `#0F172A` | Headers, values, actionable labels |
| **Secondary Typography**| `#64748B` | Captions, subtext, timestamps |
| **Success Feedback** | `#10B981` | Approved, connected, positive states |
| **Danger / Alert System** | `#EF4444` | Errors, destructive actions, required attention |

---

## 📦 4. Foundational Code Boilerplates

### A. Global State Management Profile Slice (Zustand)
Clean, fast, non-boilerplate state management built for mobile responsiveness. Create this under `src/store/useAuthStore.ts`:

```typescript
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  setCredentials: (user: UserProfile, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setCredentials: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'autopilot-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### B. Declarative Atomic Component with NativeWind Style Boundaries
Create high-performance, responsive presentation controls under `src/components/common/CustomButton.tsx`:

```tsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

interface CustomButtonProps {
  onPress: () => void;
  title: string;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  title,
  isLoading = false,
  variant = 'primary',
  disabled = false,
}) => {
  const getVariantStyles = () => {
    if (disabled || isLoading) return 'bg-slate-300 dark:bg-slate-700';
    switch (variant) {
      case 'secondary': return 'bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700';
      case 'danger': return 'bg-rose-600 dark:bg-rose-700';
      case 'primary':
      default: return 'bg-blue-600 dark:bg-blue-500';
    }
  };

  const getTextStyles = () => {
    if (disabled) return 'text-slate-500 dark:text-slate-400';
    if (variant === 'secondary') return 'text-slate-900 dark:text-slate-100';
    return 'text-white';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      className={`w-full py-4 px-6 rounded-2xl flex-row justify-center items-center h-[56px] transition-all ${getVariantStyles()}`}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'secondary' ? '#000' : '#fff'} />
      ) : (
        <Text className={`text-base font-semibold tracking-wide text-center ${getTextStyles()}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
```

---

## 🛠️ 5. Production Optimization & Engineering Best Practices

Before you initiate native builds via EAS (Expo Application Services), implement these continuous standard verification frameworks:

1. **List Optimization Boundaries:** Never use default `<ScrollView>` structures for dynamic API streams. Always leverage `<FlatList>` or FlashList (`@shopify/flash-list`) to avoid deep memory leaks during screen re-rendering.
2. **Image Performance Caching:** Use `expo-image` rather than the native core React Native `<Image>` wrapper. It implements pre-fetching and disk-level memory optimization out of the box to prevent memory crashes on asset-heavy layout sheets.
3. **Hermes JS Engine Enforcement:** Ensure `"hermesInternal"` is active inside your environment setup configurations. Hermes drastically minimizes application initial bundle download overhead and balances garbage collection runs on lower-end Android targets.
4. **Safe Area Boundary Controls:** Always extend structures inside `<SafeAreaView>` containers derived from `react-native-safe-area-context` to automatically mitigate physical display variations such as speaker notches, camera punches, and home indicators.

---

## 🎯 Next Steps Checklist

- [ ] Create the core modular architectural folders under `src/`.
- [ ] Install state dependencies (`zustand`, `@react-native-async-storage/async-storage`).
- [ ] Test the `CustomButton` implementation with your active model by prompting: `"Refactor CustomButton to support a trailing icon prop."`
