# Nobal Navigato Pvt Ltd

A modern React-based website for an education consultancy company specializing in study abroad programs, university placements, and visa assistance.

## Overview

This is a responsive, single-page application built with React 18 and Vite. The website showcases study abroad consultancy services, featuring an elegant UI with smooth animations, protected authentication flows, and an admin dashboard for managing appointments.

## Tech Stack

- **Framework:** React 18.3.1 with React Router v7
- **Build Tool:** Vite 6.3.5
- **Styling:** Tailwind CSS 4.1.12
- **UI Components:** Radix UI primitives (shadcn/ui style)
- **Icons:** Lucide React
- **Animations:** Motion (Framer Motion), Embla Carousel
- **Forms:** React Hook Form
- **Charts:** Recharts
- **Notifications:** Sonner

## Features

### Public Pages
- **Home** - Hero slider showcasing study abroad services, statistics, and call-to-actions
- **About Us** - Company information and mission
- **Our Clients** - Client testimonials and success stories
- **Portfolio** - Showcase of successful university placements
- **Contact Us** - Contact information and inquiry form

### User Features
- **User Authentication** - Login system with localStorage persistence
- **Book Appointment** - Protected appointment booking page for logged-in users
- **Responsive Navigation** - Mobile-friendly menu with dropdown user actions

### Admin Features
- **Admin Login** - Separate authentication for administrators
- **Admin Dashboard** - Protected dashboard for managing appointments and data
- **Protected Routes** - Route guards ensuring only authenticated admins can access

### UI/UX Features
- **Smooth Animations** - Scroll-triggered reveal animations
- **Image Carousel** - Hero slider with auto-advance and manual controls
- **Toast Notifications** - User feedback via Sonner notifications
- **Error Boundaries** - Graceful error handling
- **Lazy Loading** - Code-splitting for improved performance
- **Scroll to Top** - Automatic scroll restoration on navigation

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── App.jsx                 # Main application component
│   │   ├── routes.js               # Route configuration
│   │   ├── components/
│   │   │   ├── Layout.jsx          # Main layout with navbar/footer
│   │   │   ├── ErrorBoundary.jsx   # Error handling wrapper
│   │   │   ├── ProtectedRoute.jsx  # Auth route guard
│   │   │   ├── ScrollToTop.jsx     # Scroll restoration
│   │   │   ├── ui/                 # shadcn/ui components (40+ components)
│   │   │   └── figma/              # Custom Figma-based components
│   │   └── pages/
│   │       ├── Home.jsx            # Landing page
│   │       ├── AboutUs.jsx         # About page
│   │       ├── OurClients.jsx      # Clients showcase
│   │       ├── Portfolio.jsx       # Portfolio page
│   │       ├── ContactUs.jsx       # Contact page
│   │       ├── Login.jsx           # User login
│   │       ├── BookAppointment.jsx # Appointment booking (protected)
│   │       ├── AdminLogin.jsx      # Admin authentication
│   │       ├── AdminDashboard.jsx  # Admin panel (protected)
│   │       └── NotFound.jsx        # 404 page
│   ├── styles/
│   │   ├── index.css               # Main styles
│   │   ├── tailwind.css            # Tailwind imports
│   │   ├── theme.css               # Theme variables
│   │   ├── fonts.css               # Font imports
│   │   └── animations_addition.css # Custom animations
│   └── main.jsx                    # Entry point
├── public/
│   └── favicon.png                 # Site favicon
├── index.html                      # HTML template
├── package.json                    # Dependencies
├── vite.config.js                  # Vite configuration
└── tailwind.config.*               # Tailwind configuration
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd aris-FE
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |

## Component Library

The project includes a comprehensive set of UI components built on Radix UI primitives:

- **Layout:** Accordion, Alert Dialog, Aspect Ratio, Avatar, Card, Collapsible, Dialog, Drawer, Sheet
- **Forms:** Button, Checkbox, Command, Form, Input, Input OTP, Label, Radio Group, Select, Slider, Switch, Textarea, Toggle, Toggle Group
- **Navigation:** Breadcrumb, Context Menu, Dropdown Menu, Menubar, Navigation Menu, Pagination, Popover, Tabs, Tooltip
- **Feedback:** Alert, Progress, Skeleton, Sonner (toasts)
- **Data Display:** Badge, Calendar, Carousel, Chart, Hover Card, Resizable, Scroll Area, Separator, Table

## Authentication Flow

1. **User Login:** Users can log in via `/login` and are persisted in localStorage
2. **Protected Booking:** The `/book` route requires authentication; unauthenticated users are redirected to login
3. **Admin Login:** Separate admin authentication at `/admin`
4. **Admin Dashboard:** Protected route at `/admin/dashboard` requiring admin authentication

## Customization

### Theme
The project uses Tailwind CSS v4 with custom theme variables defined in `src/styles/theme.css`. Modify CSS variables to change colors, fonts, and spacing.

### Adding New Pages
1. Create a new component in `src/app/pages/`
2. Add the route to `src/app/routes.js`
3. Import and add the route in `src/app/App.jsx` within the appropriate layout section

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

### Production
- React & React DOM 18.3.1
- React Router 7.13.0
- Radix UI primitives (accordion, dialog, dropdown, etc.)
- Tailwind CSS 4.1.12
- Tailwind Merge & Class Variance Authority
- Motion (Framer Motion successor)
- Lucide React icons
- Date-fns for date formatting
- Recharts for data visualization
- React Hook Form for form handling

### Development
- Vite 6.3.5
- @vitejs/plugin-react
- @tailwindcss/vite

## License

Private - Nobal Navigato Pvt Ltd
