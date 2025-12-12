# Menu Creation Feature - Developer Reference

## 🎯 Quick Reference Guide

### Import Paths

```typescript
// Components
import { DatePicker } from "@/components/ui/date-picker";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

// Hooks
import {
  useCreateMenu,
  usePublishMenu,
  useGetMenus,
  useGetMenuById,
} from "@/app/menu/hooks";

// API Functions
import { createMenu, publishMenu, getMenus, getMenuById } from "@/app/menu/api";

// Types
import type {
  CreateMenuPayload,
  PublishMenuPayload,
  MenuResponse,
} from "@/app/menu/api";

// Components
import { MenuItemSearch } from "@/app/menu/components/menu-item-search";
```

### Common Patterns

#### Creating a Menu

```typescript
const createMenuMutation = useCreateMenu();

const handleCreate = async () => {
  createMenuMutation.mutate(
    {
      date: "2025-12-13",
      menuType: "breakfast",
      menuItems: ["item1", "item2"],
      notes: "Optional notes",
      isDraft: false, // false to publish, true to save as draft
    },
    {
      onSuccess: (data) => {
        console.log("Menu created:", data);
        toast.success("Menu created successfully!");
      },
      onError: (error) => {
        console.error("Failed to create menu:", error);
        toast.error("Failed to create menu");
      },
    }
  );
};

return (
  <button onClick={handleCreate} disabled={createMenuMutation.isPending}>
    {createMenuMutation.isPending ? "Creating..." : "Create Menu"}
  </button>
);
```

#### Fetching Menus

```typescript
const { data: menus, isLoading, error } = useGetMenus();

if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;

return (
  <ul>
    {menus?.map((menu) => (
      <li key={menu._id}>
        {menu.date} - {menu.menuType}
      </li>
    ))}
  </ul>
);
```

#### Publishing a Menu

```typescript
const publishMenuMutation = usePublishMenu();

const handlePublish = () => {
  publishMenuMutation.mutate(
    {
      menuIds: ["menuId1", "menuId2"],
    },
    {
      onSuccess: (data) => {
        console.log("Menus published:", data);
        toast.success("Menus published successfully!");
      },
    }
  );
};
```

### Component Props

#### DatePicker

```typescript
interface DatePickerProps {
  value: string | undefined; // ISO date format (YYYY-MM-DD)
  onChange: (date: string) => void; // Called when date changes
  placeholder?: string; // Default: "Pick a date"
}

// Usage
<DatePicker value={date} onChange={setDate} placeholder="Select menu date" />;
```

#### MenuItemSearch

```typescript
interface MenuItemSearchProps {
  selectedItems: string[]; // Array of selected item IDs
  onItemsChange: (items: string[]) => void; // Called when items change
}

// Usage
<MenuItemSearch selectedItems={menuItems} onItemsChange={setMenuItems} />;
```

### Styling Classes

#### Common Utility Classes

```typescript
// Button variants
className = "bg-primary text-primary-foreground"; // Primary
className = "bg-secondary text-secondary-foreground"; // Secondary
className = "border border-input"; // Input border
className = "text-muted-foreground"; // Muted text

// Layout
className = "max-w-2xl mx-auto"; // Center with max width
className = "grid grid-cols-1 sm:grid-cols-2 gap-4"; // Responsive grid
className = "flex flex-col sm:flex-row gap-4"; // Responsive flex

// Spacing
className = "p-4 sm:p-6 lg:p-8"; // Responsive padding
className = "mb-8 mt-4"; // Margin
className = "gap-2 gap-4"; // Gap between items
```

### Theme Variables (Tailwind)

```css
/* Colors (from shadcn theme) */
--primary: hsl(...)      /* Primary color */
--secondary: hsl(...)    /* Secondary color */
--muted: hsl(...)        /* Muted background */
--destructive: hsl(...)  /* Error/delete color */

/* Breakfast/Lunch/Dinner colors */
bg-yellow-100 text-yellow-800      /* Breakfast */
bg-orange-100 text-orange-800      /* Lunch */
bg-purple-100 text-purple-800      /* Dinner */
```

### Error Handling

```typescript
// Type-safe error handling
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";

const createMenuMutation = useCreateMenu();

// Mutation errors are typed as AxiosError<ApiError>
// Access error data:
if (createMenuMutation.error?.response?.data) {
  const { message, code } = createMenuMutation.error.response.data;
  console.error(`Error ${code}: ${message}`);
}
```

### Date Handling

```typescript
// Format ISO string to readable date
const date = "2025-12-13";
const formatted = new Date(date).toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  // Result: "December 13, 2025"
});

// Create ISO string from Date object
const isoString = new Date().toISOString().split("T")[0];
// Result: "2025-12-13"
```

### Form Validation

```typescript
// Validation at creation step
const isDateValid = formData.date !== "";
const isMenuTypeValid = ["breakfast", "lunch", "dinner"].includes(
  formData.menuType
);
const areItemsSelected = formData.menuItems.length > 0;
const isFormValid = isDateValid && isMenuTypeValid && areItemsSelected;

// Step-specific validation
const handleNext = (step: number) => {
  const validations = {
    1: isDateValid,
    2: isMenuTypeValid,
    3: areItemsSelected,
    4: true, // Notes are optional
  };

  if (!validations[step]) {
    toast.error("Please complete this step");
    return;
  }

  // Move to next step
};
```

### React Query Best Practices

```typescript
// Get query client (already set up in lib/react-query-client.ts)
import { queryClient } from "@/lib/react-query-client";
import { queryKeys } from "@/lib/query-keys";

// Manual invalidation if needed
queryClient.invalidateQueries({
  queryKey: queryKeys.menus,
});

// Manual refetch
queryClient.refetchQueries({
  queryKey: queryKeys.menuById(id),
});

// Optimistic updates (advanced)
queryClient.setQueryData(queryKeys.menus, (old) => {
  // Update cache before API response
});
```

### Toast Notifications

```typescript
import { toast } from "sonner";

// Success
toast.success("Menu created successfully!");

// Error
toast.error("Failed to create menu");

// Info
toast.info("This is an informational message");

// Warning
toast.warning("Are you sure?");

// Custom
toast.message("Custom message", {
  description: "Additional description",
  duration: 3000,
});
```

### TypeScript Patterns

```typescript
// Union types for menu type
type MenuType = "breakfast" | "lunch" | "dinner";

// Const assertions for immutable arrays
const MENU_TYPES = ["breakfast", "lunch", "dinner"] as const;

// Type-safe step progression
type Step = 1 | 2 | 3 | 4;
const [step, setStep] = useState<Step>(1);

// Type inference from hooks
const { data: menus } = useGetMenus();
// Type of menus: MenuResponse[] | undefined

// Generic error types
type SubmitError = AxiosError<ApiError>;
```

### Common Pitfalls to Avoid

❌ **Don't** mutate state directly

```typescript
// Bad
formData.date = "2025-12-13";

// Good
setFormData({ ...formData, date: "2025-12-13" });
```

❌ **Don't** forget to invalidate queries after mutations

```typescript
// The hooks already do this, but if custom:
mutationFn: async (payload) => {
  const result = await createMenu(payload);
  queryClient.invalidateQueries({ queryKey: queryKeys.menus }); // ✓
  return result;
};
```

❌ **Don't** use array index as React key

```typescript
// Bad
{
  items.map((item, index) => <div key={index}>{item}</div>);
}

// Good
{
  items.map((item) => <div key={item._id}>{item.name}</div>);
}
```

❌ **Don't** call hooks conditionally

```typescript
// Bad
if (condition) {
  const hook = useGetMenus(); // ✗ Breaks rules of hooks
}

// Good
const hook = useGetMenus(); // Always call at top level
if (condition) {
  // Use hook inside condition
}
```

### Debugging Tips

```typescript
// Log form state changes
useEffect(() => {
  console.log("Form data updated:", formData);
}, [formData]);

// Log mutation state
useEffect(() => {
  if (createMenuMutation.isPending) console.log("Creating...");
  if (createMenuMutation.isSuccess) console.log("Success!");
  if (createMenuMutation.isError)
    console.log("Error:", createMenuMutation.error);
}, [createMenuMutation.status]);

// Inspect React Query state
import { useQueryClient } from "@tanstack/react-query";
const queryClient = useQueryClient();
console.log("Cache:", queryClient.getQueryData(queryKeys.menus));
```

### Performance Tips

1. **Memoize expensive computations**

```typescript
const filteredItems = useMemo(() => {
  return allItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [searchQuery, allItems]);
```

2. **Use React.memo for child components**

```typescript
const MenuTypeButton = React.memo(({ type, selected, onClick }) => (
  <button onClick={onClick} className={selected ? "selected" : ""}>
    {type}
  </button>
));
```

3. **Avoid unnecessary re-renders**

```typescript
// Bad: Creates new callback every render
<MenuItemSearch onChange={(items) => setMenuItems(items)} />;

// Good: Stable reference
const handleMenuItemsChange = useCallback((items) => {
  setMenuItems(items);
}, []);
<MenuItemSearch onChange={handleMenuItemsChange} />;
```

### Testing Considerations

```typescript
// Mock the hooks in tests
jest.mock("@/app/menu/hooks", () => ({
  useCreateMenu: () => ({
    mutate: jest.fn(),
    isPending: false,
    error: null,
  }),
}));

// Mock API calls
jest.mock("@/app/menu/api", () => ({
  createMenu: jest.fn().mockResolvedValue({ _id: "123" }),
}));

// Test form validation
test("form validation works", () => {
  const { getByText } = render(<MenuCreatePage />);
  fireEvent.click(getByText("Next"));
  expect(getByText("Please select a date")).toBeInTheDocument();
});
```

### Accessibility Best Practices

```typescript
// Use semantic HTML
<button aria-label="Open date picker">Pick Date</button>

// Provide loading feedback
<button disabled={isPending} aria-busy={isPending}>
  {isPending ? "Loading..." : "Save"}
</button>

// Form labels
<label htmlFor="notes">Additional Notes</label>
<textarea id="notes" />

// Keyboard navigation
// Buttons and links should be focusable
// Implement Tab, Enter, Escape key handlers
```

---

## 📚 Additional Resources

- **shadcn/ui Components**: Check component documentation
- **React Query**: https://tanstack.com/query/latest
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **Next.js**: https://nextjs.org/docs

## 🆘 Getting Help

1. Check the `QUICK_START_GUIDE.md` for common issues
2. Review `MENU_FEATURE.md` for detailed specifications
3. Look at `ARCHITECTURE.md` for system design
4. Check browser console for error messages
5. Review React Query DevTools: https://tanstack.com/query/latest/docs/devtools
