# 🚀 Professional Resume Builder

A modern, feature-rich resume builder application built with React, TypeScript, and Tailwind CSS. Create professional resumes with real-time preview, multiple export options, and a beautiful user interface.

![Resume Builder Dashboard](https://via.placeholder.com/800x400/1e293b/ffffff?text=Resume+Builder+Dashboard)

## ✨ Features

### 🎯 **Core Functionality**
- **Multi-Step Form Builder** - Intuitive step-by-step resume creation process
- **Real-Time Preview** - See your resume update instantly as you type
- **Professional Templates** - Clean, modern resume layouts optimized for ATS
- **PDF Export** - High-quality PDF generation with professional formatting
- **Auto-Save** - Never lose your progress with automatic saving
- **Resume Management** - Save, edit, and manage multiple resumes

### 📝 **Resume Sections**
- **Personal Information** - Contact details, social profiles, and location
- **Professional Summary** - Compelling career overview and objectives
- **Work Experience** - Detailed employment history with rich descriptions
- **Education** - Academic background with GPA and achievements
- **Skills & Expertise** - Categorized technical and soft skills with proficiency levels

### 🎨 **User Experience**
- **Modern UI/UX** - Clean, professional interface with smooth animations
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Dark Mode Ready** - Professional color scheme with accessibility in mind
- **Progress Tracking** - Visual step indicator with completion status
- **Form Validation** - Real-time validation with helpful error messages

### 🔧 **Technical Features**
- **TypeScript** - Full type safety and better developer experience
- **Component Architecture** - Modular, reusable React components
- **State Management** - Efficient context-based state management
- **API Integration** - RESTful API integration with error handling
- **Local Storage** - Offline capability with browser storage
- **Performance Optimized** - Lazy loading and optimized bundle size

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for fast development and building
- **PDF Generation**: jsPDF with html2canvas for high-quality exports
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React for consistent iconography
- **State Management**: React Context API
- **HTTP Client**: Fetch API with custom wrapper

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16.0 or higher)
- **npm** (version 7.0 or higher) or **yarn**
- **Git** for version control

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/resume-builder-frontend.git
cd resume-builder-frontend
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Application Configuration
VITE_APP_NAME=Resume Builder
VITE_APP_VERSION=1.0.0

# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_API_TIMEOUT=10000

# Feature Flags
VITE_ENABLE_PDF_EXPORT=true
VITE_ENABLE_AUTO_SAVE=true
VITE_AUTO_SAVE_INTERVAL=30000

# Limits
VITE_MAX_WORK_EXPERIENCES=10
VITE_MAX_EDUCATION_ENTRIES=5
VITE_MAX_SKILLS=50
VITE_MAX_SUMMARY_LENGTH=500

# Development
VITE_ENABLE_DEBUG=true
VITE_LOG_LEVEL=info
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Build for Production

### Build the Application

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── FormSteps/       # Multi-step form components
│   ├── ui/              # Reusable UI components
│   ├── Dashboard.tsx    # Main dashboard component
│   ├── FormContainer.tsx # Form wrapper component
│   ├── ResumePreview.tsx # Live preview component
│   └── StepIndicator.tsx # Progress indicator
├── context/             # React context providers
│   └── ResumeContext.tsx # Resume state management
├── services/            # API and external services
│   ├── api.ts          # API client configuration
│   ├── pdfService.ts   # PDF generation service
│   └── resumeService.ts # Resume CRUD operations
├── types/               # TypeScript type definitions
│   └── resume.ts       # Resume data types
├── utils/               # Utility functions
│   └── validation.ts   # Form validation helpers
├── config/              # Application configuration
│   └── env.ts          # Environment variables
└── styles/              # Global styles
    └── index.css       # Tailwind CSS imports
```

## 🎯 Usage Guide

### Creating Your First Resume

1. **Login** - Authenticate to access the resume builder
2. **Start Building** - Click "Create New Resume" from the dashboard
3. **Fill Information** - Complete each step of the multi-step form:
   - Personal Information (contact details, social profiles)
   - Work Experience (employment history, job descriptions)
   - Education (academic background, certifications)
   - Skills (technical and soft skills with proficiency levels)
   - Professional Summary (career overview and objectives)
4. **Preview & Export** - Review your resume in real-time and export as PDF
5. **Save & Manage** - Save your resume and manage multiple versions

### Managing Resumes

- **Dashboard Overview** - View all your resumes with status indicators
- **Search & Filter** - Find specific resumes by name, title, or status
- **Edit Existing** - Modify and update your saved resumes
- **Delete Resumes** - Remove unwanted resume versions
- **Export Options** - Download as PDF or share directly

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API endpoint | `http://localhost:5000/api/v1` |
| `VITE_ENABLE_PDF_EXPORT` | Enable PDF export feature | `true` |
| `VITE_ENABLE_AUTO_SAVE` | Enable automatic saving | `true` |
| `VITE_AUTO_SAVE_INTERVAL` | Auto-save interval (ms) | `30000` |
| `VITE_MAX_WORK_EXPERIENCES` | Maximum work experiences | `10` |

### Customization

The application uses Tailwind CSS for styling, making it easy to customize:

- **Colors**: Modify the color palette in `tailwind.config.js`
- **Typography**: Adjust font families and sizes
- **Components**: Customize individual components in the `components/` directory
- **Themes**: Add dark mode or custom themes



### Linting

```bash
npm run lint
```

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run type-check` | Run TypeScript type checking |




## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the beautiful icon set
- **Vite** - For the fast build tool
- **TypeScript** - For type safety and developer experience



The README is structured to serve both **end users** who want to use the application and **developers** who want to contribute or understand the codebase. It follows GitHub best practices and includes all necessary information for a professional open-source project.

Happy Coding :)
