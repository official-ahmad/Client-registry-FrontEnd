# Client Registry - Admin Dashboard

A professional, responsive admin dashboard built with React, Tailwind CSS, and Axios for managing mobile unlocking services.

## 🎨 Features

- ✅ **Responsive Sidebar Navigation** - Clean navigation between pages
- ✅ **Add Job Form** - Modern form with IMEI validation (15-digit)
- ✅ **Jobs Dashboard** - Table view with status badges and real-time search
- ✅ **Status Management** - Update job status with dropdown
- ✅ **Search Functionality** - Search by customer name, IMEI, or Job ID
- ✅ **Toast Notifications** - Success/error messages with react-hot-toast
- ✅ **Dark Theme** - Professional dark blue/gray/cyan design
- ✅ **Real-time Stats** - Job counts by status

## 🚀 Tech Stack

- **React** - UI framework
- **React Router DOM** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - API requests
- **React Hot Toast** - Notifications
- **Vite** - Build tool

## 📦 Installation

```bash
npm install
```

## 🏃 Running the App

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will run on **http://localhost:5173**

## 📁 Project Structure

```
src/
├── App.jsx              # Main app with routing
├── main.jsx             # Entry point
├── index.css            # Tailwind imports
├── api.js               # API service layer
├── Sidebar.jsx          # Navigation sidebar
├── Dashboard.jsx        # Jobs table page
├── AddJob.jsx           # Create job form
└── Settings.jsx         # Settings page
```

## 🎯 Pages

### 1. Dashboard (`/dashboard`)
- View all jobs in a sortable table
- Search by customer name, IMEI, or Job ID
- Color-coded status badges:
  - 🔴 **Received** - Red
  - 🟡 **In-Progress** - Yellow
  - 🟢 **Ready** - Green
  - 🔵 **Delivered** - Blue
- Update job status with dropdown
- Real-time statistics

### 2. Add Job (`/add`)
- Customer Name (required)
- Phone Number (required)
- Device Model (required)
- IMEI - 15-digit validation (required)
- Service Type - Dropdown: FRP, Screen Lock, Software
- Price (PKR)
- Form validation and error handling
- Auto-redirect to dashboard on success

### 3. Settings (`/settings`)
- Business information
- API configuration
- Theme settings
- About section

## 🔌 API Integration

Backend API URL: `http://localhost:8000/api`

**Endpoints:**
- `POST /jobs` - Create new job
- `GET /jobs` - Get all jobs
- `PATCH /jobs/:id` - Update job
- `GET /jobs/track/:id` - Track job by jobId

## 🎨 Design Features

- **Dark Theme** - Modern dark background (gray-950, gray-900)
- **Cyan Accents** - Professional cyan/blue highlights
- **Responsive** - Mobile-first design
- **Smooth Transitions** - Hover effects and animations
- **Glass Morphism** - Semi-transparent cards with borders
- **Professional Typography** - Clear hierarchy and readability

## 🔧 Configuration

The backend URL is configured in `src/api.js`:

```javascript
const API_URL = 'http://localhost:8000/api';
```

Update this if your backend runs on a different port.

## 📝 Form Validation

- **IMEI**: Exactly 15 numeric digits
- **Phone**: Required field
- **Price**: Numeric, positive values only
- **Service Type**: Dropdown selection (FRP, Screen Lock, Software)

## 🎉 Toast Notifications

Success and error messages appear as toast notifications:
- ✅ Green for success (job created, status updated)
- ❌ Red for errors (validation, API failures)
- Position: Top-right
- Duration: 3 seconds
- Dark theme styling

## 🔍 Search

Real-time search across:
- Customer names (case-insensitive)
- IMEI numbers
- Job IDs

## 📊 Statistics

The dashboard shows:
- Total jobs count
- Jobs by status (Received, In-Progress, Ready, Delivered)
- Real-time updates

## 🎨 Color Scheme

- **Background**: `gray-950` (#030712)
- **Cards**: `gray-900` (#111827)
- **Borders**: `gray-800` (#1f2937)
- **Primary**: `cyan-600` (#0891b2)
- **Text**: `white`, `gray-300`, `gray-400`

## 📱 Responsive Design

- Desktop: Full sidebar + content
- Tablet: Responsive table with horizontal scroll
- Mobile: Optimized layouts and spacing

## 🛠️ Development

Built with:
- Vite for fast development
- ESLint for code quality
- Tailwind CSS v4 for styling

## 📄 License

ISC

## 👨‍💻 Developer

@official-ahmad
