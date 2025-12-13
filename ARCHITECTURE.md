# Menu Creation Feature - Architecture & Flow Diagram

## 📊 Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Menu Feature                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐              ┌──────────────────┐            │
│  │  Menu List   │ ────────────→ │  Create Menu     │            │
│  │  Page        │              │  Page (4-step)   │            │
│  │              │ ←────────────│                  │            │
│  └──────────────┘              └──────────────────┘            │
│        ▲                               │                        │
│        │                               │                        │
│        └───────────────────────────────┘                        │
│                   (Navigation)                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

```
┌────────────────────────────────────────────────────────────────┐
│                      User Interface                             │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  MenuCreatePage                                          │ │
│  │  ├─ Step 1: DatePicker                                  │ │
│  │  ├─ Step 2: Menu Type Selection                         │ │
│  │  ├─ Step 3: MenuItemSearch                              │ │
│  │  └─ Step 4: Notes Textarea                              │ │
│  └──────────────────────────────────────────────────────────┘ │
│                          │                                     │
│                          ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Form State Management (useState)                       │ │
│  │  {                                                       │ │
│  │    date: "2025-12-13",                                 │ │
│  │    menuType: "breakfast",                              │ │
│  │    menuItems: ["id1", "id2"],                          │ │
│  │    notes: "Today's special"                            │ │
│  │  }                                                       │ │
│  └──────────────────────────────────────────────────────────┘ │
│                          │                                     │
└──────────────────────────┼─────────────────────────────────────┘
                           │
                           ▼
         ┌─────────────────────────────────┐
         │  useCreateMenu Hook             │
         │  (React Query Mutation)          │
         └──────────────┬──────────────────┘
                        │
         ┌──────────────▼──────────────────┐
         │  createMenu API Function         │
         │  axios.post("/menu", payload)   │
         └──────────────┬──────────────────┘
                        │
                        ▼
         ┌─────────────────────────────────┐
         │  Backend API                    │
         │  POST /api/menu                 │
         │  POST /api/publish              │
         └──────────────┬──────────────────┘
                        │
         ┌──────────────▼──────────────────┐
         │  Database                       │
         │  MongoDB Collections            │
         └─────────────────────────────────┘
```

## 🎯 Component Hierarchy

```
MenuCreatePage (app/menu/create/page.tsx)
│
├─ DatePicker (components/ui/date-picker.tsx)
│  └─ Popover (components/ui/popover.tsx)
│     └─ RadixUI PopoverPrimitive
│
├─ MenuItemSearch (app/menu/components/menu-item-search.tsx)
│  ├─ Input (components/ui/input.tsx)
│  └─ Badge (components/ui/badge.tsx)
│
├─ Textarea (components/ui/textarea.tsx)
│
├─ Button (components/ui/button.tsx)
│
└─ Card (components/ui/card.tsx)

MenuPage (app/menu/page.tsx)
│
├─ Card (components/ui/card.tsx)
│  └─ Badge (components/ui/badge.tsx)
│
└─ Button (components/ui/button.tsx)
```

## 📋 Form Flow Diagram

```
START
  │
  ▼
┌─────────────────────────────────┐
│  Step 1: Date Selection         │
│  ✓ DatePicker                   │
│  ✓ Validate date selected       │
└─────────┬───────────────────────┘
          │ [Next]
          ▼
┌─────────────────────────────────┐
│  Step 2: Menu Type              │
│  ✓ breakfast/lunch/dinner       │
│  ✓ Validate type selected       │
└─────────┬───────────────────────┘
          │ [Next]
          ▼
┌─────────────────────────────────┐
│  Step 3: Menu Items             │
│  ✓ Search & Select Items        │
│  ✓ Validate items selected (≥1) │
└─────────┬───────────────────────┘
          │ [Next]
          ▼
┌─────────────────────────────────┐
│  Step 4: Notes                  │
│  ✓ Optional notes               │
│  ✓ Form Complete                │
└─────────┬───────────────────────┘
          │
    [Draft] | [Publish]
          │
          ▼
┌─────────────────────────────────┐
│  useCreateMenu.mutate()         │
│  isDraft: true/false            │
└─────────┬───────────────────────┘
          │
    Success | Error
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
  Toast      Toast
  Success    Error
    │           │
    ▼           ▼
Redirect    Stay on Form
to /menu    (can retry)
    │
    ▼
  END
```

## 🔌 API Integration Points

```
Frontend (React)
    │
    ├─→ useGetMenuItems()
    │   GET /api/menu-items
    │   ↓
    │   Populate MenuItemSearch component
    │
    ├─→ useCreateMenu()
    │   POST /api/menu
    │   Payload: CreateMenuPayload
    │   Response: MenuResponse
    │   ↓
    │   Invalidate useGetMenus()
    │
    ├─→ usePublishMenu()
    │   POST /api/publish
    │   Payload: PublishMenuPayload
    │   Response: { message, data }
    │   ↓
    │   Invalidate useGetMenus()
    │
    └─→ useGetMenus()
        GET /api/menu
        Response: MenuResponse[]
        ↓
        Display in MenuPage
```

## 🎨 UI State Machine

```
Form States:
┌─────────────┐
│   IDLE      │ (Initial state)
│ (pristine)  │
└──────┬──────┘
       │ [User interaction]
       ▼
┌─────────────┐
│  EDITING    │ (Form being filled)
│ (dirty)     │
└──────┬──────┘
       │ [Submit]
       ▼
┌─────────────┐
│ LOADING     │ (API call in progress)
│ (pending)   │
└──────┬──────┘
       │
    ┌──┴──┐
    │     │
    ▼     ▼
┌────┐ ┌─────┐
│SUCCESS│ ERROR
└─┬──┘ └──┬──┘
  │       │
  ▼       ▼
REDIRECT EDIT
(Reset)   (Keep data)
```

## 🗂️ File Dependency Graph

```
app/menu/create/page.tsx
├── @/components/ui/button
├── @/components/ui/card
├── @/components/ui/date-picker ──→ @/components/ui/popover
├── @/app/menu/components/menu-item-search
│   ├── @/components/ui/input
│   ├── @/components/ui/badge
│   └── @/app/menu-items/hooks (useGetMenuItems)
├── @/components/ui/textarea
├── @/app/menu/hooks (useCreateMenu)
└── @/lib/... (utils, colors, etc)

app/menu/page.tsx
├── @/components/ui/button
├── @/components/ui/card
├── @/components/ui/badge
└── @/app/menu/hooks (useGetMenus)

app/menu/hooks/index.ts
└── @/app/menu/api
    └── @/lib/api-client

components/ui/date-picker.tsx
└── @/components/ui/popover

components/ui/popover.tsx
└── @radix-ui/react-popover
```

## 🔐 Type Safety Flow

```
Backend Response
    │
    ▼
api.ts (TypeScript Interfaces)
    │
    ├── MenuResponse
    ├── CreateMenuPayload
    └── PublishMenuPayload
    │
    ▼
hooks/index.ts (React Query Types)
    │
    ├── useCreateMenu<MenuResponse, Error, CreateMenuPayload>
    ├── usePublishMenu<{message, data}, Error, PublishMenuPayload>
    └── useGetMenus<MenuResponse[], Error>
    │
    ▼
Components (Strongly Typed Props)
    │
    ├── MenuCreatePage uses CreateMenuPayload
    ├── MenuPage uses MenuResponse[]
    └── MenuItemSearch uses string[] (menu IDs)
```

## 📱 Responsive Behavior

```
Mobile (< 640px)
┌──────────────────────┐
│   Single Column      │
│   Full Width         │
│   Stacked Layout     │
└──────────────────────┘
         │
         ▼ (640px+)
Tablet (640px - 1024px)
┌──────────────────────┐
│   Flexible Grid      │
│   Adaptive Spacing   │
└──────────────────────┘
         │
         ▼ (1024px+)
Desktop (> 1024px)
┌──────────────────────┐
│   Optimized Columns  │
│   Comfortable View   │
└──────────────────────┘
```

## 🎪 Feature Toggle / Feature Flags (Future)

```
Environment Variables:
NEXT_PUBLIC_ENABLE_MENU_CREATION=true
NEXT_PUBLIC_API_URL=http://localhost:8000/api

Feature Switches:
├── Draft Menu Support
├── Publish Menu Support
├── Menu Item Search
├── Calendar View
└── Bulk Operations (Future)
```

## 🔄 Cache Invalidation Strategy

```
useCreateMenu()
    │
    ├─ On Success:
    │  └─ Invalidate queryKeys.menus
    │     └─ Trigger useGetMenus() refresh
    │
    └─ On Error:
       └─ Keep existing data (optimistic)

usePublishMenu()
    │
    ├─ On Success:
    │  └─ Invalidate queryKeys.menus
    │     └─ Trigger useGetMenus() refresh
    │
    └─ On Error:
       └─ Keep existing data
```

## 📊 Data Structure

```
CREATE MENU REQUEST:
{
  date: "YYYY-MM-DD",
  menuType: "breakfast" | "lunch" | "dinner",
  menuItems: ["ObjectId", "ObjectId", ...],
  notes: "Optional string",
  isDraft: boolean
}

MENU RESPONSE:
{
  _id: "ObjectId",
  date: "2025-12-13",
  menuType: "breakfast",
  menuItems: ["ObjectId1", "ObjectId2"],
  notes: "Special items",
  isDraft: false,
  createdAt: "ISO8601",
  updatedAt: "ISO8601"
}

PUBLISH REQUEST:
{
  menuIds: ["ObjectId", "ObjectId", ...]
}
```

---

This architecture provides:
✅ Separation of concerns
✅ Reusable components
✅ Type safety
✅ Proper error handling
✅ Efficient data fetching
✅ Clean component hierarchy
✅ Responsive design
✅ User feedback at each step
