# Menu Creation Feature - Publish Flow Fix

## ✅ Changes Made

### 1. **Removed Separate Publish API Call**

- The `usePublishMenu` hook is now **only for batch publishing draft menus**
- When creating a menu with `isDraft: false`, it's **directly published** via the create endpoint
- No need for a separate publish API call after creation

### 2. **Added Error Message Display**

- Added error state: `const [errorMessage, setErrorMessage] = useState<string>("")`
- Error alert component displays before the form card
- Shows both validation errors and API errors
- Extracts error messages from API response: `error?.response?.data?.message`

### 3. **Improved Error Handling**

- `onError` handlers now extract detailed error messages from API responses
- Error messages are displayed in the alert and as toasts
- Console logs errors for debugging
- Clears error message on success

### 4. **Enhanced Form Validation Messages**

- More detailed validation error messages
- Tells user exactly what's required: "(date, menu type, and at least one item)"

## 📁 Files Modified

### `app/menu/create/page.tsx`

- Added `AlertCircle` icon import
- Added `errorMessage` state
- Updated `handleSaveDraft()` with better error handling
- Updated `handlePublish()` with better error handling
- Added error alert component display (with styling)
- Clears errors on successful submission

### `app/menu/hooks/index.ts`

- Added documentation comment to `usePublishMenu()`
- Clarified it's for batch publishing draft menus
- Noted that you can publish directly with `isDraft: false` on creation

## 🎯 How It Works Now

### Save as Draft

```typescript
// Creates menu with isDraft: true
createMenuMutation.mutate({
  date: "2025-12-13",
  menuType: "breakfast",
  menuItems: ["id1", "id2"],
  notes: "Optional notes",
  isDraft: true, // ← Saved as draft
});
```

### Publish Directly

```typescript
// Creates menu with isDraft: false
// No separate publish call needed!
createMenuMutation.mutate({
  date: "2025-12-13",
  menuType: "breakfast",
  menuItems: ["id1", "id2"],
  notes: "Optional notes",
  isDraft: false, // ← Published immediately
});
```

### Error Display

- API errors are extracted: `error?.response?.data?.message`
- Validation errors are user-friendly
- Error alert displays prominently before the form
- Toast notification also appears
- Error is cleared on successful submission

## 🔄 API Flow

### Before (Incorrect)

```
Create Menu (isDraft: false)
    ↓
usePublishMenu() called  ← WRONG: Separate API call
    ↓
Menu Published
```

### After (Correct)

```
Create Menu with isDraft: false
    ↓
Menu is directly published by the create API ← RIGHT: One API call
    ↓
Menu appears in listing
```

## 💡 Error Alert UI

```
┌─────────────────────────────────────────┐
│ ⚠️ Error                                │
│ Failed to save menu draft: Invalid date │
└─────────────────────────────────────────┘
```

- Red border and background
- Alert icon
- "Error" header
- Detailed error message from API

## ✨ Benefits

✅ **Simpler Flow** - No unnecessary API calls
✅ **Better UX** - Clear error messages displayed inline
✅ **Better DX** - Error messages from backend are passed through
✅ **Clearer Intent** - isDraft boolean makes it obvious what will happen
✅ **Faster** - One API call instead of two

## 🧪 Testing

### Test Save as Draft

1. Fill the form completely
2. Click "Save as Draft"
3. Should see success toast and redirect
4. Menu appears in `/menu` with Draft badge

### Test Publish

1. Fill the form completely
2. Click "Publish"
3. Should see success toast and redirect
4. Menu appears in `/menu` (no Draft badge)

### Test Error Handling

1. Try to submit incomplete form
2. Should see error alert and toast
3. Should see detailed error message
4. Error disappears when you fix the validation

### Test API Errors

1. Backend returns validation error
2. Should see the error message in the alert
3. Error appears before the form for visibility

## 📚 Documentation Updated

The implementation now correctly follows the API specification:

- Create/Draft: `POST /api/menu` with `isDraft: true`
- Publish Direct: `POST /api/menu` with `isDraft: false`
- Batch Publish: `POST /api/publish` (for publishing draft menus)

## 🎉 Summary

The publish flow is now **correct and matches the API specification**. When you click "Publish", it directly creates the menu with `isDraft: false`, which is immediately published by the backend. No separate publish API call is needed!
