# Portfolio Project - SCSS Migration Guide

Dự án portfolio đã được refactor từ styled-components sang SCSS để có hiệu suất tốt hơn và dễ bảo trì hơn.

## 🏗️ Cấu trúc SCSS

```
src/styles/
├── abstracts/           # Variables, mixins, functions
│   ├── _variables.scss  # Color, font, spacing variables
│   ├── _mixins.scss     # Reusable mixins
│   └── _index.scss      # Export abstracts
├── base/               # Reset, typography, global styles
│   ├── _reset.scss     # CSS reset và base styles
│   └── _index.scss     # Export base
├── components/         # Component-specific styles
│   ├── _button.scss    # Button component styles
│   ├── _header.scss    # Header component styles
│   ├── _hero.scss      # Hero component styles
│   └── _index.scss     # Export components
├── layout/            # Layout styles
│   ├── _main.scss     # Main container styles
│   └── _index.scss    # Export layout
└── main.scss          # Main SCSS entry point
```

## 🎨 SCSS Variables

### Colors
- `$navy`: #0F172A (Background tối)
- `$light-slate`: #BFBECB (Màu chữ phụ)
- `$slate`: #a0a0a0 (Màu chữ thường)
- `$white`: #E6F1FF (Màu chữ chính)
- `$green`: #72E2AE (Màu accent)

### Breakpoints
- `$breakpoint-mobile`: 480px
- `$breakpoint-tablet`: 768px
- `$breakpoint-desktop`: 1024px
- `$breakpoint-large`: 1200px

## 🔧 Mixins Hữu Ích

### Responsive Breakpoints
```scss
@include mobile { /* styles for mobile */ }
@include tablet { /* styles for tablet */ }
@include desktop { /* styles for desktop */ }
```

### Flexbox Utilities
```scss
@include flex-center;        // display: flex + center alignment
@include flex-between;       // display: flex + space-between
@include flex-column-center; // flex column + center alignment
```

### Button Styles
```scss
@include button-reset;       // Reset button styles
@include button-base;        // Base button styling
```

## 📦 Component Structure

### Button Component
- **File**: `src/styles/components/_button.scss`
- **Classes**: 
  - `.button` - Base button
  - `.button--secondary` - Secondary variant
  - `.button--outline` - Outline variant
  - `.button--small`, `.button--large` - Size variants

### Header Component  
- **File**: `src/styles/components/_header.scss`
- **Classes**:
  - `.header` - Main header container
  - `.header__logo` - Logo styling
  - `.header__nav` - Navigation container
  - `.header__nav-link` - Navigation links

### Hero Component
- **File**: `src/styles/components/_hero.scss`
- **Classes**:
  - `.hero` - Hero section container
  - `.hero__profile-image` - Profile image
  - `.hero__title` - Main title
  - `.hero__social-links` - Social media links

## 🚀 Cách sử dụng

### 1. Import SCSS vào component
```jsx
import './path/to/component-styles.scss';
```

### 2. Sử dụng CSS classes
```jsx
const Button = ({ variant = 'primary', size = 'medium' }) => {
  const classes = [
    'button',
    variant !== 'primary' && `button--${variant}`,
    size !== 'medium' && `button--${size}`
  ].filter(Boolean).join(' ');

  return <button className={classes}>Click me</button>;
};
```

### 3. Tạo component SCSS mới
```scss
@use '../abstracts/variables' as *;
@use '../abstracts/mixins' as *;

.my-component {
  color: $white;
  background: $navy;
  
  @include tablet {
    padding: $spacing-md;
  }
  
  &__element {
    @include flex-center;
  }
  
  &--variant {
    background: $green;
  }
}
```

## 🔄 Migration Benefits

### Trước (styled-components)
```jsx
const StyledButton = styled.button`
  background-color: var(--green);
  color: var(--navy);
  padding: 15px 20px;
  // ... more styles
`;
```

### Sau (SCSS)
```scss
.button {
  background-color: $green;
  color: $navy;
  padding: 15px 20px;
  // ... more styles
}
```

### Lợi ích:
- ✅ **Performance**: CSS tĩnh, không cần JavaScript runtime
- ✅ **Bundle size**: Nhỏ hơn đáng kể
- ✅ **Developer experience**: IntelliSense tốt hơn, debugging dễ hơn
- ✅ **Maintainability**: Tách biệt logic và styling
- ✅ **Reusability**: Mixins và variables dùng chung

## 📋 TODO cho các component còn lại

Các component chưa được refactor:
- [ ] About component
- [ ] Contact component  
- [ ] Footer component
- [ ] Portfolio component
- [ ] Services component

## 🎯 Best Practices

1. **Naming Convention**: Sử dụng BEM methodology
2. **File Organization**: Một file SCSS cho mỗi component
3. **Variables**: Sử dụng SCSS variables thay vì CSS custom properties
4. **Mixins**: Tạo mixins cho code tái sử dụng
5. **Responsive**: Mobile-first approach với mixins

## 🛠️ Development

### Chạy dự án
```bash
npm run dev
```

### Build production
```bash
npm run build
```

SCSS sẽ được compile tự động bởi Vite.