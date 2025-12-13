# Menu Creation Feature - Quick Start Guide

## Installation

### 1. Install Dependencies

```bash
cd /Users/shivam/Documents/food-saas-admin
pnpm install
```

This will install the newly added `@radix-ui/react-popover` dependency.

## Running the Application

### Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Accessing the Menu Creation Feature

### Create a New Menu

1. Navigate to: `http://localhost:3000/menu/create`
2. Follow the 4-step form:
   - **Step 1**: Select a date using the date picker
   - **Step 2**: Choose menu type (breakfast, lunch, or dinner)
   - **Step 3**: Search and select menu items
   - **Step 4**: Add optional notes
3. Click **"Save as Draft"** or **"Publish"**

### View Created Menus

1. Navigate to: `http://localhost:3000/menu`
2. See all created menus grouped by date
3. Menus show:
   - Date in calendar format
   - Menu type (with color coding)
   - Draft/Published status
   - Number of items included

## Form Workflow

### Creating a Menu

#### Step 1: Date Selection

- Click on the date input button
- A calendar popover will appear
- Navigate months using arrow buttons
- Click on the desired date
- Selected date appears in the button

#### Step 2: Menu Type Selection

- Choose one of three options:
  - **Breakfast** (Yellow badge)
  - **Lunch** (Orange badge)
  - **Dinner** (Purple badge)
- Selection is highlighted with primary color

#### Step 3: Menu Items Selection

- Type in the search box to find items
- Available items appear in a grid
- Click items to select (they highlight)
- Selected items appear as badges below
- Click the X on badges to deselect items
- Can select as many items as needed

#### Step 4: Additional Notes

- Type any special notes or descriptions
- This is optional but recommended
- Examples:
  - "Today's special breakfast"
  - "Limited items available"
  - "Chef's recommendations included"

#### Save or Publish

- **Save as Draft**: Menu is saved but not active
  - Can be edited later
  - Won't appear in the published menu list
- **Publish**: Menu goes live immediately
  - Final and cannot be edited
  - Shows in the menu listing

## Form Validation

The form provides helpful validation:

- ❌ **Missing Date**: "Please select a date"
- ❌ **Missing Menu Type**: "Please select a menu type"
- ❌ **No Items Selected**: "Please select at least one menu item"
- ❌ **Incomplete Form**: "Please complete all required fields"

All validation messages appear as toast notifications.

## Navigation

### Within the Form

- **Next Button**: Move to the next step
  - Validates current step before proceeding
  - Disabled on last step
- **Previous Button**: Go back to previous step
  - Disabled on first step
- **Progress Indicator**: Shows current step (1-4)
  - Visual progress bar below
  - Step labels for reference

### Main Navigation

- From Menu Create → Menu List
  - After successful save/publish, redirects to `/menu`
- From Menu List → Create New Menu
  - "Create New Menu" button at top right

## Troubleshooting

### Date Picker Not Opening

- Make sure you're clicking on the date button, not the label
- Check browser console for errors
- Verify popover component is properly loaded

### Menu Items Not Appearing

- Check that menu items exist in the system
- Try searching with different keywords
- Verify menu-items API endpoint is working

### Form Not Submitting

- Ensure all required fields are filled
- Check the browser console for API errors
- Verify the backend API is running on `http://localhost:8000`

### Environment Variable Issues

If you need to change the API URL:

1. Update `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://your-api-url:8000/api
   ```
2. Restart the development server

## API Endpoints Required

Ensure your backend has these endpoints:

### Create/Draft Menu

```
POST /api/menu
Content-Type: application/json

{
  "date": "2025-12-13",
  "menuType": "breakfast",
  "menuItems": ["item_id_1", "item_id_2"],
  "notes": "Optional notes",
  "isDraft": true
}

Response: MenuResponse (201 Created)
```

### Publish Menu

```
POST /api/publish
Content-Type: application/json

{
  "menuIds": ["menu_id_1"]
}

Response: { message: string, data: MenuResponse[] } (200 OK)
```

### Get All Menus

```
GET /api/menu

Response: MenuResponse[] (200 OK)
```

### Get Single Menu

```
GET /api/menu/:id

Response: MenuResponse (200 OK)
```

## File Structure Reference

```
app/menu/
├── api.ts                    ← API calls & types
├── create/
│   └── page.tsx             ← Main creation form (4-step)
├── page.tsx                 ← Menu listing with calendar view
├── hooks/
│   └── index.ts             ← React Query hooks
└── components/
    └── menu-item-search.tsx ← Search & select items

components/ui/
├── date-picker.tsx          ← Calendar date picker
└── popover.tsx              ← Popover base component
```

## Key Features

✨ **Multi-Step Form**: Organized workflow for creating menus
📅 **Date Picker**: Calendar-based date selection
🔍 **Smart Search**: Find menu items with live filtering
🏷️ **Type Selection**: Breakfast, lunch, dinner options
📝 **Notes Support**: Add special notes to menus
📊 **Summary View**: Real-time form data summary
💾 **Draft Saving**: Save work in progress
🚀 **Publishing**: Make menus live with one click
📱 **Responsive**: Works on all device sizes

## Best Practices

1. **Always fill in all required fields** (date, type, items)
2. **Add meaningful notes** to help understand menu choices
3. **Review the summary** before publishing
4. **Draft first, then publish** if unsure about choices
5. **Use specific search terms** when looking for items
6. **Check existing menus** before creating duplicates

## Performance Tips

- Search performance is optimized with React Query
- Calendar doesn't re-render unnecessarily
- Form state is efficiently managed
- API calls are cached and reused

## Support

If you encounter issues:

1. Check browser console for errors
2. Verify API endpoints are responding
3. Ensure all dependencies are installed
4. Restart the development server
5. Clear browser cache if needed

---

**Happy Menu Creating! 🍽️**
