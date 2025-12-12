# Menu Creation Feature Documentation

## Overview

This document describes the complete menu creation feature implementation for the Food SaaS Admin system. The feature allows admins to create menus for different dates with various types (breakfast, lunch, dinner), select menu items, add notes, and save as draft or publish.

## Architecture

### Components

#### 1. **Menu Create Page** (`app/menu/create/page.tsx`)

A multi-step form component with 4 steps:

- **Step 1**: Date Selection - Uses custom DatePicker component
- **Step 2**: Menu Type Selection - Choose from breakfast, lunch, dinner
- **Step 3**: Menu Items Selection - Local search to find and select menu items
- **Step 4**: Additional Notes - Add special notes or descriptions

Features:

- Progress indicator showing current step
- Summary panel showing filled form data
- Previous/Next navigation
- Save as Draft button
- Publish button
- Form validation at each step

#### 2. **Menu Page** (`app/menu/page.tsx`)

Displays all created menus grouped by date in a calendar-like view.

Features:

- Groups menus by date
- Shows menu type with color-coded badges
- Indicates draft status
- Shows item count
- Link to create new menu

#### 3. **Menu Item Search Component** (`app/menu/components/menu-item-search.tsx`)

A search and selection component for menu items.

Features:

- Local search functionality
- Shows available items
- Displays selected items as badges
- Quick remove functionality
- Reuses existing menu items from the system

#### 4. **Date Picker Component** (`components/ui/date-picker.tsx`)

Custom calendar-based date picker using Popover.

Features:

- Month/year navigation
- Visual calendar layout
- Selected date highlighting
- Formatted date display in button

#### 5. **Popover Component** (`components/ui/popover.tsx`)

Base component for the date picker using Radix UI.

## API Integration

### Types and Schemas (`app/menu/api.ts`)

```typescript
export interface CreateMenuPayload {
  date: string; // Format: "YYYY-MM-DD"
  menuType: "breakfast" | "lunch" | "dinner";
  menuItems: string[]; // Array of menu item IDs (MongoDB ObjectId)
  notes?: string; // Optional notes
  isDraft: boolean; // true for draft, false for published
}

export interface PublishMenuPayload {
  menuIds: string[]; // Array of menu IDs to publish
}

export interface MenuResponse {
  _id: string;
  date: string;
  menuType: "breakfast" | "lunch" | "dinner";
  menuItems: string[];
  notes?: string;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### API Endpoints

#### Create/Draft Menu

```
POST http://localhost:8000/api/menu
Content-Type: application/json

{
  "date": "2025-12-13",
  "menuType": "breakfast",
  "menuItems": ["693b0740c72b3f62fbac7b56"],
  "notes": "today's special breakfast",
  "isDraft": true
}
```

#### Publish Menu

```
POST http://localhost:8000/api/publish
Content-Type: application/json

{
  "menuIds": ["507f1f77bcf86cd799439011"]
}
```

### React Query Hooks (`app/menu/hooks/index.ts`)

```typescript
// Fetch all menus
const { data: menus, isLoading } = useGetMenus();

// Fetch specific menu
const { data: menu, isLoading } = useGetMenuById(id);

// Create/Draft menu
const createMenuMutation = useCreateMenu();
createMenuMutation.mutate({
  date: "2025-12-13",
  menuType: "breakfast",
  menuItems: ["id1", "id2"],
  notes: "Special items",
  isDraft: true,
});

// Publish menu
const publishMenuMutation = usePublishMenu();
publishMenuMutation.mutate({
  menuIds: ["menuId1", "menuId2"],
});
```

## Form Validation

### Step-by-Step Validation

1. **Date Selection**

   - Required field
   - Must be a valid date string in format YYYY-MM-DD

2. **Menu Type Selection**

   - Required field
   - Must be one of: breakfast, lunch, dinner

3. **Menu Items Selection**

   - At least one item must be selected
   - Items are validated against existing menu items in database
   - Menu item IDs must be valid MongoDB ObjectIds

4. **Notes**
   - Optional field
   - Maximum length: unlimited but recommended to be reasonable

## UI Components Used

- `Button` - Navigation and action buttons
- `Card` - Card containers for sections
- `Input` - Text input field (if needed)
- `Textarea` - Multi-line text input for notes
- `Badge` - Display menu type and status
- `Separator` - Visual divider
- `Spinner` - Loading indicator
- `Popover` - Dropdown container for date picker
- `DatePicker` - Custom date selection component

## Styling

The feature uses:

- **Tailwind CSS** for styling
- **shadcn/ui** component library conventions
- Responsive design for mobile and desktop
- Color-coded menu types:
  - Breakfast: Yellow
  - Lunch: Orange
  - Dinner: Purple

## Database Query Keys

```typescript
export const queryKeys = {
  menus: ["menus"] as const,
  menuById: (id: string) => ["menu", id] as const,
};
```

## Error Handling

- Form validation errors shown as toast notifications
- API errors caught and displayed to user
- Failed mutations show error toast
- Successful operations show success toast
- Loading states managed with spinner

## State Management

Uses React Hook Form concepts with useState for:

- Current step tracking
- Form data accumulation
- Date picker state
- Search query in menu items

## File Structure

```
app/menu/
├── api.ts                      # API functions and schemas
├── hooks/
│   └── index.ts               # React Query hooks
├── components/
│   └── menu-item-search.tsx   # Menu items search component
├── create/
│   └── page.tsx               # Menu create page (4-step form)
└── page.tsx                   # Menu listing page

components/ui/
├── date-picker.tsx             # Custom date picker
└── popover.tsx                 # Popover component
```

## Future Enhancements

1. **Calendar View** - Visual calendar with clickable dates showing menus
2. **Menu Duplication** - Copy a menu from another date
3. **Bulk Operations** - Publish multiple draft menus at once
4. **Menu Templates** - Save and reuse menu templates
5. **Notifications** - Email notifications when menu is published
6. **Analytics** - Track popular menu combinations
7. **Menu Item Grouping** - Organize menu items by category in search

## Dependencies Added

- `@radix-ui/react-popover@^1.1.1` - For popover component

## Installation & Setup

1. Install dependencies:

```bash
pnpm install
```

2. The menu creation feature is now ready to use at `/menu/create`

3. View created menus at `/menu`

## Usage Example

```typescript
// In your component
import { useCreateMenu } from "@/app/menu/hooks";

export function YourComponent() {
  const createMenu = useCreateMenu();

  const handleCreate = () => {
    createMenu.mutate(
      {
        date: "2025-12-13",
        menuType: "breakfast",
        menuItems: ["itemId1", "itemId2"],
        notes: "Special breakfast",
        isDraft: false,
      },
      {
        onSuccess: () => {
          // Handle success
        },
        onError: (error) => {
          // Handle error
        },
      }
    );
  };

  return (
    <button onClick={handleCreate} disabled={createMenu.isPending}>
      Create Menu
    </button>
  );
}
```

## Notes

- All dates are stored in ISO format (YYYY-MM-DD)
- Menu items are referenced by their MongoDB ObjectId
- Draft menus can be edited and re-published
- Published menus are final and reflect the menu as of the creation date
- Notes are optional but recommended for future reference
- The search function is case-insensitive and searches menu item names
