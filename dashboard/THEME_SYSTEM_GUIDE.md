# Theme System Usage Guide

## 🎨 Overview

This theme system provides a centralized way to manage styling across the entire application. It includes:

- **Theme Provider**: Context for theme management
- **Themed Components**: Pre-styled components that adapt to themes
- **Theme Utilities**: Helper functions for consistent styling
- **Multiple Themes**: Dark and Light themes (easily extendable)

## 🚀 Quick Start

### 1. Wrap your app with ThemeProvider

```tsx
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      {/* Your app components */}
    </ThemeProvider>
  );
}
```

### 2. Use themed components

```tsx
import { ThemedButton, ThemedInput, ThemedCard } from './components/ui';

function MyComponent() {
  return (
    <ThemedCard>
      <ThemedInput label="Name" placeholder="Enter name" />
      <ThemedButton variant="primary">Submit</ThemedButton>
    </ThemedCard>
  );
}
```

### 3. Access theme in custom components

```tsx
import { useTheme, cn } from './components/ui';

function CustomComponent() {
  const { theme } = useTheme();
  
  return (
    <div className={cn(theme.surface, theme.textPrimary, 'p-4 rounded-lg')}>
      Content with theme styling
    </div>
  );
}
```

## 📚 Components

### ThemedButton
```tsx
<ThemedButton variant="primary" size="lg" loading={true}>
  Save Changes
</ThemedButton>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `leftIcon`, `rightIcon`: React.ReactNode

### ThemedInput
```tsx
<ThemedInput
  label="Email"
  error="Invalid email"
  helperText="Enter your email address"
  leftIcon={<Mail />}
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `leftIcon`, `rightIcon`: React.ReactNode
- `variant`: 'default' | 'error'

### ThemedCard
```tsx
<ThemedCard hoverable padding="lg" onClick={handleClick}>
  Card content
</ThemedCard>
```

**Props:**
- `padding`: 'none' | 'sm' | 'md' | 'lg'
- `hoverable`: boolean
- `onClick`: () => void

### ThemedModal
```tsx
<ThemedModal
  isOpen={isOpen}
  onClose={onClose}
  title="Edit Job"
  subtitle="Update job details"
  size="lg"
  footer={<div>Footer content</div>}
>
  Modal content
</ThemedModal>
```

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`, `subtitle`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `footer`: React.ReactNode

### ThemedBadge
```tsx
<ThemedBadge status="completed" size="sm">
  Completed
</ThemedBadge>

<ThemedBadge priority="urgent">
  High Priority
</ThemedBadge>
```

**Props:**
- `variant`: 'default' | 'success' | 'warning' | 'error' | 'info'
- `status`: string (auto-colors based on status)
- `priority`: string (auto-colors based on priority)
- `size`: 'sm' | 'md' | 'lg'

## 🛠 Theme Utilities

### useTheme Hook
```tsx
const { theme, currentTheme, toggleTheme, setTheme } = useTheme();
```

### cn Function (Class Names)
```tsx
const classes = cn(
  'base-class',
  condition && 'conditional-class',
  theme.primary,
  customClass
);
```

### getComponentClasses
```tsx
const inputClasses = getComponentClasses(theme, 'input', 'focus', 'custom-class');
```

### Status/Priority Helpers
```tsx
const statusClasses = getStatusClasses(theme, 'completed');
const priorityClasses = getPriorityClasses(theme, 'urgent');
```

## 🎭 Creating Custom Themes

Add new themes to `themes.ts`:

```tsx
export const customTheme: ThemeColors & { components: ThemeComponents } = {
  primary: 'bg-purple-600',
  primaryHover: 'hover:bg-purple-700',
  // ... other colors
  
  components: {
    button: {
      primary: 'px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg',
      // ... other variants
    },
    // ... other components
  },
};

export const themes = {
  dark: darkTheme,
  light: lightTheme,
  custom: customTheme,
} as const;
```

## 🔄 Theme Switching

```tsx
function ThemeToggle() {
  const { currentTheme, toggleTheme, setTheme } = useTheme();
  
  return (
    <div>
      <button onClick={toggleTheme}>
        Toggle Theme ({currentTheme})
      </button>
      
      <select 
        value={currentTheme} 
        onChange={(e) => setTheme(e.target.value as ThemeName)}
      >
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </div>
  );
}
```

## 📈 Migration Example

**Before (with repetitive classes):**
```tsx
<div className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-2xl shadow-2xl border border-gray-700/30 backdrop-blur-md p-6">
  <input className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300" />
  <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/25 transition-all duration-300">
    Submit
  </button>
</div>
```

**After (with theme system):**
```tsx
<ThemedCard>
  <ThemedInput placeholder="Enter value" />
  <ThemedButton variant="primary">Submit</ThemedButton>
</ThemedCard>
```

## ✨ Benefits

1. **Consistency**: All components follow the same design system
2. **Maintainability**: Change themes globally from one place
3. **Flexibility**: Easy to switch between light/dark themes
4. **Scalability**: Add new themes or components easily
5. **Developer Experience**: Less repetitive code, better autocomplete
6. **Type Safety**: Full TypeScript support with theme types

## 🔧 Advanced Usage

### Custom Component with Theme
```tsx
function CustomTable() {
  const { theme } = useTheme();
  
  return (
    <div className={getComponentClasses(theme, 'table', 'container')}>
      <div className={getComponentClasses(theme, 'table', 'header')}>
        Header
      </div>
      <div className={getComponentClasses(theme, 'table', 'row')}>
        Row content
      </div>
    </div>
  );
}
```

### Conditional Theme Classes
```tsx
function StatusIndicator({ status }: { status: string }) {
  const { theme } = useTheme();
  
  return (
    <span className={cn(
      'px-3 py-1 rounded-full text-sm font-medium',
      getStatusClasses(theme, status)
    )}>
      {status}
    </span>
  );
}
```
