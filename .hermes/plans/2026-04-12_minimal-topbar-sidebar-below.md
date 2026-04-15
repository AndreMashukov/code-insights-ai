# Plan: Minimal Top Bar + Sidebar Below It

## Context
Redesign the app shell layout per approved wireframes:
- Top bar: minimal (logo + theme toggle), 100% viewport width, 48px height
- Sidebar: sits BELOW the top bar (not overlapping), contains all navigation + user profile footer
- Remove Dashboard/Profile links from top bar (already in sidebar)
- Move user info (avatar, email, sign out) from top bar to sidebar footer

## Files to Change

### 1. MainLayout.tsx (topbar)
- Remove: nav links (Dashboard, Profile), user welcome/email/avatar/sign-out section
- Change: height 64px → 48px, remove sidebar margin-left offset, width 100vw always
- Keep: logo (left), theme toggle (right)
- Remove mobile hamburger (sidebar handles its own mobile state)

### 2. Sidebar.styles.ts
- Change: `top-0` → `top-[48px]` (below topbar)
- Add: sidebarFooter, userInfo, userEmail, userLabel, signOutBtn styles
- Add: navSectionLabel style

### 3. Sidebar.tsx
- Add: user profile footer (avatar, email, sign out button)
- Add: nav section labels ("Navigation", "Account")
- Import: useAuth, useSignOut from firebase hooks
- Keep: collapse toggle, nav items, active states

### 4. Page.tsx
- Sidebar is now below topbar, so content margin-top = 0 (topbar handled by MainLayout)
- Keep sidebar marginLeft for content offset

## Exit Criteria
| Phase | Must satisfy |
|-------|-------------|
| IMPLEMENT | Topbar is 48px, 100% width, minimal. Sidebar below it. User profile in sidebar footer. |
| TEST | L4 visual — screenshots match wireframe intent |
