# Tailwind CSS Integration Guide

## 📚 Overview

Dự án này sử dụng **hybrid approach** kết hợp SCSS và Tailwind CSS:
- **SCSS**: Cho component architecture, complex styling, và design system
- **Tailwind CSS**: Cho utility classes, rapid prototyping, và responsive design

## 🎨 Custom Theme

### Colors
```css
'navy': '#0F172A'           // Main background
'light-slate': '#BFBECB'    // Secondary text
'slate': '#a0a0a0'          // Muted text
'white-custom': '#E6F1FF'   // Primary text
'green-custom': '#72E2AE'   // Accent color
```

### Breakpoints
```css
'mobile': {'max': '480px'}
'tablet': {'max': '768px'}
'desktop': '1024px'
'large': '1200px'
```

## 🧩 Custom Components

### Buttons
```jsx
// Primary button
<button className="btn-tailwind btn-primary-tw">Primary</button>

// Secondary button
<button className="btn-tailwind btn-secondary-tw">Secondary</button>

// Outline button
<button className="btn-tailwind btn-outline-tw">Outline</button>
```

### Cards
```jsx
// Basic card
<div className="card-tw">Content</div>

// Glass effect card
<div className="glass-effect p-6 rounded-lg">Content</div>
```

### Forms
```jsx
// Input field
<input className="input-tw" placeholder="Your input" />

// Textarea
<textarea className="textarea-tw">Content</textarea>
```

## 🎯 Utility Classes

### Layout & Spacing
```jsx
// Container
<div className="container-tw">Content</div>

// Section padding
<section className="section-padding">Content</section>
```

### Animations
```jsx
// Hover effects
<div className="hover-lift">Lifts on hover</div>
<div className="hover-scale">Scales on hover</div>

// Loading spinner
<div className="spinner w-6 h-6"></div>
```

### Text Effects
```jsx
// Gradient text
<span className="text-gradient">Gradient Text</span>

// Animated underline
<a className="animated-underline">Hover me</a>
```

### Special Effects
```jsx
// Floating action button
<button className="fab">+</button>

// Notifications
<div className="notification notification-success">Success!</div>
<div className="notification notification-error">Error!</div>
<div className="notification notification-info">Info!</div>
```

## 🔧 Development Workflow

### 1. Using SCSS for Complex Components
```scss
// Component-specific styles với design system
.hero {
  @include flex-center;
  min-height: 100vh;
  background: $navy;
  
  &__title {
    color: $white;
    font-size: $font-size-xxlarge;
  }
}
```

### 2. Using Tailwind for Utilities
```jsx
// Quick styling với utility classes
<div className="flex items-center justify-between p-4 bg-navy/80 rounded-lg">
  <h3 className="text-white-custom font-semibold">Title</h3>
  <button className="px-4 py-2 bg-green-custom text-navy rounded hover:scale-105 transition-transform">
    Action
  </button>
</div>
```

### 3. Hybrid Approach
```jsx
// Kết hợp SCSS component với Tailwind utilities
<div className="hero"> {/* SCSS component */}
  <div className="hero__content flex flex-col items-center space-y-6"> {/* Tailwind utilities */}
    <h1 className="hero__title text-center"> {/* SCSS + Tailwind */}
      Welcome
    </h1>
    <button className="btn-tailwind btn-primary-tw"> {/* Custom Tailwind component */}
      Get Started
    </button>
  </div>
</div>
```

## 📱 Responsive Design

### SCSS Approach
```scss
.component {
  padding: 40px;
  
  @include tablet {
    padding: 20px;
  }
  
  @include mobile {
    padding: 16px;
  }
}
```

### Tailwind Approach
```jsx
<div className="p-10 tablet:p-5 mobile:p-4">
  Content
</div>
```

## 🎨 Best Practices

### 1. Component Architecture
- **Large components**: Use SCSS files
- **Small utilities**: Use Tailwind classes
- **Reusable patterns**: Create custom Tailwind components

### 2. Performance
- Tailwind CSS có tree-shaking tự động
- Chỉ CSS classes được sử dụng mới được include trong build
- SCSS components được compile một lần

### 3. Maintainability
```jsx
// ✅ Good: Semantic component với utility helpers
<article className="blog-post p-6 rounded-lg"> {/* Component + utilities */}
  <h2 className="blog-post__title text-2xl font-bold">Title</h2>
  <p className="blog-post__content text-light-slate leading-relaxed">Content</p>
</article>

// ❌ Avoid: Quá nhiều utility classes
<div className="flex flex-col items-start justify-start p-6 bg-navy border border-slate rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
```

## 🚀 Advanced Features

### Custom Animations
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in-up { animation: fadeInUp 0.8s ease-out; }
```

### Dark Mode Support
```jsx
// Tailwind hỗ trợ dark mode built-in
<div className="bg-white dark:bg-navy text-black dark:text-white-custom">
  Content
</div>
```

### Custom Plugins
```js
// tailwind.config.js
module.exports = {
  plugins: [
    // Add custom plugins here
  ]
}
```

## 📦 File Structure
```
src/
├── styles/
│   ├── main.scss           # Main SCSS entry
│   ├── tailwind.css        # Tailwind directives & components
│   ├── abstracts/          # SCSS variables & mixins
│   ├── base/              # SCSS reset & typography
│   ├── components/        # SCSS component styles
│   └── layout/            # SCSS layout styles
└── components/
    ├── Header/            # SCSS-based component
    ├── Hero/              # SCSS-based component
    └── TailwindDemo/      # Tailwind-heavy component
```

Approach này cho phép bạn tận dụng điểm mạnh của cả hai:
- **SCSS**: Complex components, design system, maintainable code
- **Tailwind**: Rapid development, consistent spacing, responsive utilities