# ByeWind Dashboard - Juspay Assignment

A modern, responsive dashboard application built with React featuring order management, analytics charts, and interactive maps. This project demonstrates advanced React concepts, state management, and modern UI/UX design patterns.

## 🚀 Features

- **Order Management System**: Complete CRUD operations with search, sorting, and pagination
- **Interactive Dashboard**: Multiple dashboard views (Default and eCommerce)
- **Data Visualization**: Charts and graphs using ApexCharts
- **Interactive Maps**: Location-based revenue data with React Leaflet
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Dark/Light Theme**: Toggle between themes with persistent state
- **Real-time Search**: Instant filtering of orders by user or order ID
- **Bulk Operations**: Select multiple orders for batch operations
- **Notification System**: Drawer-based notification panel

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 14.0 or higher)
- **npm** (version 6.0 or higher) or **yarn**
- **Git** (for cloning the repository)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd juspay_assignment
```

### 2. Install Dependencies
```bash
npm install
```
or
```bash
yarn install
```

### 3. Start the Development Server
```bash
npm start
```
or
```bash
yarn start
```

The application will open in your browser at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```
or
```bash
yarn build
```

## 📁 Project Structure

```
src/
├── App.js              # Main application component
├── App.css             # Global styles and component styles
├── index.js            # Application entry point
├── index.css           # Base styles and CSS reset
└── public/
    ├── images/         # SVG icons and assets
    └── index.html      # HTML template
```

## 🎯 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Runs the app in development mode |
| `npm test` | Launches the test runner |
| `npm run build` | Builds the app for production |
| `npm run eject` | Ejects from Create React App (one-way operation) |

## 🏗️ Architecture & Design Decisions

### State Management
- **Decision**: Used React's built-in `useState` and `useEffect` hooks instead of Redux
- **Rationale**: For this application size, local state management is more appropriate and reduces complexity
- **Benefits**: 
  - Simpler codebase with less boilerplate
  - Better performance for small to medium applications
  - Easier debugging and testing

### Component Architecture
- **Monolithic Approach**: Single `App.js` component containing all functionality
- **Rationale**: Given the assignment scope, keeping components together provides better overview
- **Future Improvement**: Components can be easily extracted into separate files as the application grows

### Styling Strategy
- **CSS Modules**: Used traditional CSS with BEM-like naming conventions
- **Responsive Design**: Mobile-first approach with media queries
- **Theme System**: CSS custom properties for easy theme switching

### Data Management
- **Static Data**: Sample data embedded in the component
- **Filtering & Sorting**: Client-side operations for optimal performance
- **Pagination**: Efficient data slicing for large datasets

## 🔧 Technical Implementation

### Key Features Implemented

#### 1. Order Management System
```javascript
// Search and filter functionality
const filterAndSortOrders = (searchTerm, sortBy, sortOrder) => {
  let filtered = [...orders];
  
  // Search filter
  if (searchTerm) {
    filtered = filtered.filter(order => 
      order.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Multi-column sorting
  filtered.sort((a, b) => {
    // Sorting logic for different data types
  });
};
```

#### 2. Responsive Sidebar
- Collapsible sidebar with hamburger menu
- Click-outside-to-close functionality
- Smooth animations and transitions

#### 3. Interactive Charts
- **ApexCharts Integration**: Bar charts, line charts, and donut charts
- **Theme-aware**: Charts adapt to dark/light theme
- **Responsive**: Charts resize based on container dimensions

#### 4. Map Integration
- **React Leaflet**: Interactive world map
- **Custom Markers**: Location-based revenue data
- **Popup Information**: Detailed location data on marker click

## 🎨 UI/UX Design Decisions

### Color Scheme
- **Light Theme**: Clean whites and grays with blue accents
- **Dark Theme**: Dark backgrounds with white text and purple accents
- **Status Colors**: Semantic colors for order statuses (green for paid, yellow for pending, red for overdue)

### Typography
- **Font Hierarchy**: Clear distinction between headings and body text
- **Readability**: Optimized font sizes for different screen sizes

### Interaction Design
- **Hover Effects**: Subtle animations on interactive elements
- **Loading States**: Smooth transitions between states
- **Feedback**: Visual feedback for user actions

## 🚧 Challenges Faced & Solutions

### 1. Chart Theme Integration
**Challenge**: Making charts responsive to theme changes
**Solution**: Implemented theme-aware chart options with dynamic color schemes

### 2. Responsive Table Design
**Challenge**: Making the order table work on mobile devices
**Solution**: Used CSS Grid and Flexbox with media queries for adaptive layouts

### 3. State Management Complexity
**Challenge**: Managing multiple interconnected states
**Solution**: Used `useEffect` hooks to sync dependent states and maintain data consistency

### 4. Performance Optimization
**Challenge**: Rendering large datasets efficiently
**Solution**: Implemented pagination and client-side filtering to limit DOM nodes

## 🔮 Future Improvements

### Short-term Enhancements
- [ ] **Component Extraction**: Break down App.js into smaller, reusable components
- [ ] **Error Handling**: Add error boundaries and loading states
- [ ] **Accessibility**: Improve ARIA labels and keyboard navigation
- [ ] **Testing**: Add unit tests and integration tests

### Long-term Enhancements
- [ ] **Backend Integration**: Connect to a real API for data persistence
- [ ] **Real-time Updates**: Implement WebSocket connections for live data
- [ ] **Advanced Filtering**: Add date range filters and multiple status filters
- [ ] **Export Functionality**: Add CSV/PDF export capabilities
- [ ] **User Authentication**: Implement login/logout functionality
- [ ] **Internationalization**: Add multi-language support

## 🛠️ Technologies Used

- **React 19.1.1**: Frontend framework
- **ApexCharts**: Data visualization library
- **React Leaflet**: Interactive maps
- **CSS3**: Styling and animations
- **Create React App**: Build tool and development server

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of a technical assignment for Juspay.

---

**Note**: This project was developed as a technical assignment demonstrating React proficiency, modern web development practices, and UI/UX design skills.