# AutoPilot Mobile Design System

This document is the visual source of truth for new AutoPilot Mobile screens and components. It records the design language already implemented in `app/`. New frontend work should extend this system rather than introduce a separate palette or visual style.

## 1. Visual Direction

AutoPilot is a quiet, work-focused financial operations product. Interfaces should feel precise, trustworthy, and easy to scan.

- Use light slate canvas backgrounds with white surfaces.
- Use near-black slate for primary text and high-emphasis actions.
- Use violet as the main product accent for selected, intelligent, and conversational states.
- Use emerald for success, connected, approved, and positive financial states.
- Reserve red and amber for states that require attention.
- Prefer compact information hierarchy over decorative layouts.
- Use icons to support recognition, not as decoration.

## 2. Color Tokens

Use semantic token names in shared components. Do not add a new color when an existing semantic color communicates the same state.

| Token | Value | Usage |
| --- | --- | --- |
| `canvas` | `#F8F9FB` | Default screen background |
| `surface` | `#FFFFFF` | Cards, headers, tab bar, inputs on darkened canvas |
| `surfaceSubtle` | `#F1F5F9` | Icon wells, inactive controls, input fills |
| `border` | `#E2E8F0` | Card, input, header, and navigation borders |
| `divider` | `#F1F5F9` | Dividers inside white surfaces |
| `textPrimary` | `#0F172A` | Titles, values, primary body text |
| `textSecondary` | `#64748B` | Supporting copy and labels |
| `textTertiary` | `#94A3B8` | Timestamps, placeholders, inactive navigation |
| `textMuted` | `#475569` | Strong secondary labels and initials |
| `accent` | `#8B5CF6` | AI, active data emphasis, chat, primary product accent |
| `accentSoft` | `#EDE9FE` | Violet icon and avatar backgrounds |
| `accentTextSoft` | `#DDD6FE` | Text placed on the violet accent surface |
| `success` | `#10B981` | Approved, connected, positive movement, online |
| `successSoft` | `#D1FAE5` | Success icon and empty-state backgrounds |
| `danger` | `#EF4444` | Rejected, overdue, destructive, attention required |
| `dangerSoft` | `#FEF2F2` | Danger icon and secondary action backgrounds |
| `warning` | `#F59E0B` | Syncing, elevated access, pending warning |
| `warningSoft` | `#FEF3C7` | Warning icon backgrounds |
| `info` | `#3B82F6` | General informational states only |
| `infoSoft` | `#DBEAFE` | Informational icon backgrounds |
| `inverse` | `#FFFFFF` | Text and icons on dark or saturated surfaces |
| `darkSurface` | `#1E293B` | Exceptional high-emphasis panels such as storage status |

### Accent Rules

Violet and emerald have different jobs. Violet identifies AutoPilot intelligence, active product emphasis, and conversational UI. Emerald confirms success or healthy status. Do not swap them solely for visual variety.

Near-black slate (`#0F172A`) is the default high-emphasis button color, as established by the sign-in flow. Use violet when the action belongs directly to an AI or conversational workflow, and emerald for explicit approval or confirmation.

## 3. Typography

The current application uses the platform sans-serif through React Native. Continue using it until a branded font is deliberately selected and loaded for every platform.

| Role | Size | Weight | Notes |
| --- | ---: | ---: | --- |
| Display metric | `32` | `800` | Financial totals and prominent amounts |
| Screen title | `28` | `800` | Primary screen heading or user name |
| Profile title | `24` | `800` | Profile identity and large card values |
| Section title | `18` | `700` | Content section headings |
| Item title | `16` | `600` or `700` | List and card titles |
| Body | `15` | `400` | Main reading text; use `22` line height for messages |
| Supporting | `14` | `400` or `600` | Captions, metadata, secondary actions |
| Label | `13` | `600` or `700` | Form labels and uppercase section labels |
| Micro | `11` or `12` | `500` or `600` | Timestamps, status, chart labels |

Use weight and color before increasing size. Keep card headings compact. Uppercase is reserved for small section labels and should not be used for page titles or buttons.

## 4. Spacing and Layout

Use a 4-point spacing rhythm. The common values already present in the app are:

| Token | Value | Typical usage |
| --- | ---: | --- |
| `space1` | `4` | Tight label and status spacing |
| `space2` | `8` | Icon-to-label and compact control spacing |
| `space3` | `12` | Icon wells, message composer, compact gaps |
| `space4` | `16` | Card padding, grid gaps, standard vertical rhythm |
| `space5` | `20` | Default screen gutters and full card padding |
| `space6` | `24` | Section separation and large card padding |
| `space8` | `32` | Major content separation |
| `space10` | `40` | Top breathing room in tab screens |

- Default horizontal screen gutter: `20`.
- Compact detail-screen gutter: `16`.
- Center constrained forms at a maximum width of `440`.
- Keep touch targets at least `40 x 40`; primary form actions should be about `48-56` points high.
- Use `FlatList` for growing API-backed collections. `ScrollView` is suitable for short, bounded screen content.
- Respect safe areas through `react-native-safe-area-context` for new screens.

## 5. Shape and Elevation

| Element | Radius |
| --- | ---: |
| Small icon well or input | `10-12` |
| Button | `12` |
| Brand mark | `16` |
| Standard card or settings group | `20` |
| Feature or metric card | `24` |
| Avatar and circular icon button | `50%` |

Cards use restrained elevation. On iOS, use `#0F172A` shadows at roughly `0.03` opacity, a vertical offset of `2-4`, and a radius of `4-8`. On Android, use elevation `1-2`. Important saturated cards may use a tinted shadow at up to `0.2` opacity.

Most cards should also have a `1` point `border` outline. Do not stack cards inside cards or turn every section into a floating container.

## 6. Component Recipes

### Screen Header

- White surface with a `1` point bottom border.
- `20` horizontal padding and `20-40` top padding depending on safe-area ownership.
- Screen title uses `28/800`; supporting text uses `15` in `textSecondary`.
- Place one compact icon action or status badge on the trailing edge.

### Standard Card

- White surface, `20` radius, `16-20` padding.
- Optional `border` outline and low elevation.
- Use a `40-44` square icon well with `12` radius.
- Keep metadata secondary and avoid unnecessary labels.

### Metric Card

- Use `24` radius and `20` padding.
- The primary metric uses `24/800`; supporting labels use `12-13`.
- Saturated cards should use `inverse` text and a related pale tint for secondary copy.

### Buttons

- Primary neutral: `textPrimary` background with white text.
- AI/conversational primary: `accent` background with white text.
- Confirm/approve: `success` background with white text.
- Destructive secondary: `dangerSoft` background with `danger` text and icon.
- Use `12` radius, `14-16` horizontal padding, and `10-16` vertical padding.
- Pair text with a Material Community icon when the action benefits from faster recognition.
- Disabled controls use a muted slate fill and must remain legible.

### Inputs

- Use `surface` or `surfaceSubtle`, a `1` point `border`, and `12` radius.
- Use `15` point input text and `textTertiary` placeholders.
- Labels use `13/600` in `textMuted`.
- Show validation near the field; do not communicate errors by color alone.

### Status and Icon Wells

- Violet: AI, invoice intelligence, or selected product emphasis.
- Emerald: healthy, connected, complete, incoming funds.
- Amber: pending, syncing, elevated access.
- Red: rejected, urgent, destructive, approval required.
- Slate: neutral entities and inactive utilities.

### Navigation

- Bottom navigation uses a white surface and top border.
- Active tint is `textPrimary`; inactive tint is `textTertiary`.
- Use Material Community Icons at `22` points and short, literal labels.

## 7. Interaction and States

- Use `activeOpacity={0.7}` for standard touch feedback where appropriate.
- Use motion to explain state changes, such as collapsing an approved item, not as constant decoration.
- Every data view needs loading, empty, error, and populated states.
- Empty states use one clear icon, a short title, and one sentence of supporting text.
- Destructive and financial actions need explicit labels. Do not rely on an icon alone for irreversible actions.
- Keep layout dimensions stable so loading indicators, badges, and dynamic values do not shift surrounding content.

## 8. Accessibility and Responsive Rules

- Maintain readable contrast, especially for pale text on saturated cards.
- Do not use color as the only status signal; pair it with text or an icon.
- Allow text to wrap in cards, rows, and buttons. Avoid fixed heights for text-bearing cards.
- Test narrow mobile widths and large font settings before considering a screen complete.
- Keep financial values aligned and fully visible; never truncate the primary amount.
- Add accessibility labels to icon-only controls whose purpose is not already announced by navigation.

## 9. Implementation Policy

The current project uses React Native `StyleSheet`, not NativeWind. Continue with `StyleSheet` and shared TypeScript tokens unless the project intentionally migrates styling across the whole application. Do not mix styling systems screen by screen.

Material Community Icons from `@expo/vector-icons` are the established icon set. Reuse them before introducing another library.

Before merging a new frontend screen:

1. Reuse the semantic colors and type roles in this document.
2. Compare the screen against `app/(tabs)/dashboard.tsx`, `app/(tabs)/actions.tsx`, and `app/message.tsx`.
3. Verify loading, empty, error, disabled, and pressed states that apply to the workflow.
4. Check the screen at narrow and wide mobile sizes with no clipped or overlapping text.
5. Confirm that accents communicate meaning consistently: violet for product intelligence, emerald for success, amber for pending, and red for danger.

## 10. Current Reference Screens

- `app/(tabs)/dashboard.tsx`: metric cards, chart treatment, quick navigation, and screen spacing.
- `app/(tabs)/actions.tsx`: approval cards, semantic actions, badges, and empty state.
- `app/(tabs)/transactions.tsx`: compact financial list presentation.
- `app/(tabs)/chat.tsx` and `app/message.tsx`: avatars, AI accent, message bubbles, and composer.
- `app/settings.tsx`: grouped settings rows and profile treatment.
- `app/index.tsx`: constrained form layout, input treatment, and neutral primary action.

When a reference screen conflicts with this document, treat repeated patterns across multiple current screens as authoritative and update this blueprint as part of the change.