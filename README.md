# Personal Portfolio

A modern, responsive portfolio website built with React.js, featuring multi-language support, AI chatbot integration, and smooth animations.

## Features

- **Modern Design**: Clean and professional UI with smooth animations
- **Multi-language Support**: English, Japanese, and Vietnamese
- **AI Chatbot**: Integrated chatbot with Google Generative AI
- **Responsive Design**: Fully responsive across all devices
- **Dark/Light Theme**: Theme switching functionality
- **Interactive Animations**: Powered by Framer Motion
- **Portfolio Showcase**: Display of projects and skills
- **Contact Form**: Functional contact form integration

## Technologies Used

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **SCSS/Sass** - CSS preprocessor for advanced styling
- **Framer Motion** - Animation library
- **React Icons** - Icon library

### Features & Libraries
- **i18next** - Internationalization framework
- **React Type Animation** - Typing animation effects
- **React Scroll** - Smooth scrolling navigation
- **Google Generative AI** - AI chatbot integration

## Project Structure

```
src/
├── components/          # React components
│   ├── About/          # About section
│   ├── Contact/        # Contact form
│   ├── Header/         # Navigation header
│   ├── Hero/           # Hero section
│   ├── Portfolio/      # Portfolio showcase
│   ├── Resume/         # Resume section
│   ├── Services/       # Services section
│   ├── Skills/         # Skills section
│   ├── Footer/         # Footer component
│   └── common/         # Shared components
├── locales/            # Translation files
│   ├── en/            # English translations
│   ├── ja/            # Japanese translations
│   └── vi/            # Vietnamese translations
├── services/           # API services
├── hooks/              # Custom React hooks
├── styles/             # SCSS stylesheets
└── assets/             # Images and static assets
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/khangmoihocit/portofolio.git
cd portofolio
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Create .env file and add your API keys
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Multi-language Support

The portfolio supports three languages:
- **English** (en)
- **Japanese** (ja) 
- **Vietnamese** (vi)

Language files are located in `src/locales/` directory.

## AI Chatbot Integration

The portfolio includes an intelligent chatbot powered by Google's Generative AI that can:
- Answer questions about the developer's background
- Provide information about skills and experience
- Assist with general inquiries
- Load balance between multiple API keys for reliability

## Responsive Design

The portfolio is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## Customization

### Themes
- Light and dark theme support
- Easy theme switching with persistent user preference

### Styling
- SCSS modules for component-specific styling
- Tailwind CSS for utility classes
- CSS variables for easy color customization

## Configuration

### Tailwind CSS
Configuration file: `tailwind.config.js`

### Vite
Configuration file: `vite.config.js`

### PostCSS
Configuration file: `postcss.config.js`

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

**Khang Pham**
- Email: [khangphamvan.dev@gmail.com]
- GitHub: [@khangmoihocit](https://github.com/khangmoihocit)

---

⭐ If you found this project helpful, please give it a star on GitHub!