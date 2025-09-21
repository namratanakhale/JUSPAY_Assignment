import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('default');
  const [currentOrderPage, setCurrentOrderPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const ordersPerPage = 5;

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  // Helper function to get image path based on theme
  const getImagePath = (imagePath) => {
    if (isDarkTheme && imagePath.endsWith('.svg')) {
      return imagePath.replace('.svg', '_w.svg');
    }
    return imagePath;
  };

  const toggleSidebar = (e) => {
    e.stopPropagation();
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigateToPage = (page) => {
    setCurrentPage(page);
    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  // Close sidebar when clicking outside
  const handleClickOutside = (e) => {
    if (isSidebarOpen && !e.target.closest('.sidebar') && !e.target.closest('.hamburger-menu')) {
      setIsSidebarOpen(false);
    }
  };

  // Add click outside listener
  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Sample order data
  const allOrders = [
    { id: '#CM9801', user: { name: 'Natali Craig', avatar: '/images/a1.svg' }, project: 'Landing Page', address: 'Meadow Lane Oakland', date: 'Just now', status: 'In Progress' },
    { id: '#CM9802', user: { name: 'Kate Morrison', avatar: '/images/a5.svg' }, project: 'CRM Admin pages', address: 'Larry San Francisco', date: 'A minute ago', status: 'Complete' },
    { id: '#CM9803', user: { name: 'Drew Cano', avatar: '/images/a4.svg' }, project: 'Client Project', address: 'Bagwell Avenue Ocala', date: '1 hour ago', status: 'Pending' },
    { id: '#CM9804', user: { name: 'Orlando Diggs', avatar: '/images/a3.svg' }, project: 'Admin Dashboard', address: 'Washburn Baton Rouge', date: 'Yesterday', status: 'Approved' },
    { id: '#CM9805', user: { name: 'Andi Lane', avatar: '/images/a2.svg' }, project: 'App Landing Page', address: 'Nest Lane Olivette', date: 'Feb 2, 2023', status: 'Rejected' },
    { id: '#CM9806', user: { name: 'Sarah Johnson', avatar: '/images/a1.svg' }, project: 'Mobile App', address: 'Main Street Boston', date: 'Feb 3, 2023', status: 'In Progress' },
    { id: '#CM9807', user: { name: 'Michael Chen', avatar: '/images/a5.svg' }, project: 'E-commerce Site', address: 'Oak Avenue Seattle', date: 'Feb 4, 2023', status: 'Complete' },
    { id: '#CM9808', user: { name: 'Emily Davis', avatar: '/images/a4.svg' }, project: 'Portfolio Website', address: 'Pine Street Denver', date: 'Feb 5, 2023', status: 'Pending' },
    { id: '#CM9809', user: { name: 'David Wilson', avatar: '/images/a3.svg' }, project: 'Blog Platform', address: 'Cedar Lane Austin', date: 'Feb 6, 2023', status: 'Approved' },
    { id: '#CM9810', user: { name: 'Lisa Brown', avatar: '/images/a2.svg' }, project: 'Social Media App', address: 'Maple Drive Miami', date: 'Feb 7, 2023', status: 'In Progress' },
    { id: '#CM9811', user: { name: 'James Taylor', avatar: '/images/a1.svg' }, project: 'Analytics Dashboard', address: 'Elm Street Chicago', date: 'Feb 8, 2023', status: 'Complete' },
    { id: '#CM9812', user: { name: 'Maria Garcia', avatar: '/images/a5.svg' }, project: 'Booking System', address: 'Willow Way Phoenix', date: 'Feb 9, 2023', status: 'Pending' },
    { id: '#CM9813', user: { name: 'Robert Martinez', avatar: '/images/a4.svg' }, project: 'Learning Platform', address: 'Birch Road Portland', date: 'Feb 10, 2023', status: 'Approved' },
    { id: '#CM9814', user: { name: 'Jennifer Lee', avatar: '/images/a3.svg' }, project: 'Fitness Tracker', address: 'Spruce Avenue Nashville', date: 'Feb 11, 2023', status: 'In Progress' },
    { id: '#CM9815', user: { name: 'William Anderson', avatar: '/images/a2.svg' }, project: 'News Portal', address: 'Poplar Street Kansas City', date: 'Feb 12, 2023', status: 'Complete' }
  ];

  // Search filtering logic
  let filteredOrders = allOrders.filter(order => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.user.name.toLowerCase().includes(searchLower)
    );
  });

  // Sorting logic
  if (sortBy) {
    filteredOrders = [...filteredOrders].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'id':
          aValue = a.id.toLowerCase();
          bValue = b.id.toLowerCase();
          break;
        case 'user':
          aValue = a.user.name.toLowerCase();
          bValue = b.user.name.toLowerCase();
          break;
        case 'project':
          aValue = a.project.toLowerCase();
          bValue = b.project.toLowerCase();
          break;
        case 'address':
          aValue = a.address.toLowerCase();
          bValue = b.address.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'status':
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Pagination logic with filtered results
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentOrderPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to page 1 when search term or sort changes
  React.useEffect(() => {
    setCurrentOrderPage(1);
  }, [searchTerm, sortBy, sortOrder]);

  const handlePageChange = (page) => {
    setCurrentOrderPage(page);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'In Progress': return 'in-progress';
      case 'Complete': return 'complete';
      case 'Pending': return 'pending';
      case 'Approved': return 'approved';
      case 'Rejected': return 'rejected';
      default: return 'pending';
    }
  };

  // Checkbox handlers
  const handleSelectAll = (checked) => {
    if (checked) {
      const currentPageOrderIds = currentOrders.map(order => order.id);
      setSelectedOrders(new Set([...selectedOrders, ...currentPageOrderIds]));
    } else {
      const currentPageOrderIds = currentOrders.map(order => order.id);
      const newSelected = new Set(selectedOrders);
      currentPageOrderIds.forEach(id => newSelected.delete(id));
      setSelectedOrders(newSelected);
    }
  };

  const handleRowSelect = (orderId, checked) => {
    const newSelected = new Set(selectedOrders);
    if (checked) {
      newSelected.add(orderId);
    } else {
      newSelected.delete(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Sort function
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Check if all current page orders are selected
  const isAllSelected = currentOrders.length > 0 && currentOrders.every(order => selectedOrders.has(order.id));
  const isIndeterminate = currentOrders.some(order => selectedOrders.has(order.id)) && !isAllSelected;

  // Location data for the map
  const locations = [
    { name: 'New York', position: [40.7128, -74.0060], revenue: '72K' },
    { name: 'San Francisco', position: [37.7749, -122.4194], revenue: '39K' },
    { name: 'Sydney', position: [-33.8688, 151.2093], revenue: '25K' },
    { name: 'Singapore', position: [1.3521, 103.8198], revenue: '61K' }
  ];
  return (
    <div className={`dashboard ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      {/* Left Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-section">
            <img src="/images/avatara.svg" alt='avatar'/>
            <span className="brand-text">ByeWind</span>
          </div>
          <button className="sidebar-close" onClick={toggleSidebar}>
            <img src={getImagePath('/images/close.svg')} alt='close' />
          </button>
        </div>

        <nav className="navigation">
          <div className="nav-section">
            <h3>Favorites</h3>
            <ul>
              <li>
                <span className="nav-dot"></span>
                <span>Overview</span>
              </li>
              <li>
                <span className="nav-dot"></span>
                <span>Projects</span>
              </li>
            </ul>
          </div>
          
          <div className="nav-section">
            <h3>Dashboards</h3>
            <ul>
              <li style={{paddingLeft:'2.5rem'}}
                className={currentPage === 'default' ? 'active' : ''}
                onClick={() => navigateToPage('default')}
              >
                <img src={getImagePath('/images/default.svg')} alt='default' />
                <span>Default</span>
              </li>
              <li 
                className={currentPage === 'ecommerce' ? 'active' : ''}
                onClick={() => navigateToPage('ecommerce')}
              >
                <span className="nav-arrow">›</span>
                <img src={getImagePath('/images/bag.svg')} alt='bag' />
                <span>eCommerce</span>
              </li>
              <li>
                <span className="nav-arrow">›</span>
                <img src={getImagePath('/images/folder.svg')} alt='folder' />
                <span>Projects</span>
              </li>
              <li>
                <span className="nav-arrow">›</span>
                <img src={getImagePath('/images/course.svg')} alt='book' />
                <span>Online Courses</span>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <h3>Pages</h3>
            <ul>
              <li>
                <span className="nav-arrow">⌄</span>
                <img src={getImagePath('/images/profile.svg')} alt='user' />
                <span>User Profile</span>
              </li>
              <li>
                <span className='ml_3rem'></span>
                <span>Overview</span>
              </li>
              <li>
                <span className="ml_3rem"></span>
                <span>Projects</span>
              </li>
              <li>
                <span className="ml_3rem"></span>
                <span>Campaigns</span>
              </li>
              <li>
                <span className="ml_3rem"></span>
                <span>Documents</span>
              </li>
              <li>
                <span className="ml_3rem"></span>
                <span>Followers</span>
              </li>
              <li>
                <span className="nav-arrow">›</span>
                <img src={getImagePath('/images/account.svg')} alt='user' />
                <span>Account</span>
              </li>
              <li>
                <span className="nav-arrow">›</span>
                <img src={getImagePath('/images/corporate.svg')} alt='corporate' />
                <span>Corporate</span>
              </li>
              <li>
                <span className="nav-arrow">›</span>
                <img src={getImagePath('/images/blog.svg')} alt='blog' />
                <span>Blog</span>
              </li>
              <li>
                <span className="nav-arrow">›</span>
                <img src={getImagePath('/images/social.svg')} alt='social' />
                <span>Social</span>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content" style={{marginLeft: isSidebarOpen ? '232px' : '0px'}}>
        {/* Top Header */}
          <header className="top-header">
            <div className="breadcrumb">
              <button className="hamburger-menu" onClick={toggleSidebar} style={{display: 'block'}}>
                <img src={getImagePath('/images/sidebar.svg')} alt='menu' />
              </button>
              <div className="hamburger-icon"><img src={getImagePath('/images/star.svg')} alt='star' /></div>
              <span className="breadcrumb-text">Dashboards</span>
              <span className="separator">/</span>
              <span className="current-page">
                {currentPage === 'default' ? 'Default' :
                 currentPage === 'ecommerce' ? 'eCommerce' : 'Default'}
              </span>
            </div>
          
          <div className="header-center">
            <div className="search-bar">
              <span className="search-icon"><img src={getImagePath('/images/search.svg')} /></span>
              <input type="text" placeholder="Search" />
              <span className="keyboard-shortcut">⌘/</span>
            </div>
          </div>
          
          <div className="header-right">
            <div className="utility-icons">
                <div className="utility-icon" onClick={toggleTheme}>
                  <img src={getImagePath('/images/light_theme.svg')} alt={isDarkTheme ? 'dark theme' : 'light theme'} />
                </div>
              <div className="utility-icon"><img src={getImagePath('/images/refresh.svg')} /></div>
              <div className="utility-icon" onClick={toggleDrawer}><img src={getImagePath('/images/bell.svg')} /></div>
              <div className="utility-icon"><img src={getImagePath('/images/sidebar.svg')} /></div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {currentPage === 'default' ? (
            <>
             
                <div className="title-section">
                  <p className='title_text'>Order List</p>
                </div>
                <div className="content-header">
                <div className='space_betn light_bg'>
                <div className='hamburger-icon'>
                  <img src={getImagePath('/images/plus.svg')} alt='plus' />
                  <img src={getImagePath('/images/filter.svg')} alt='filter' />
                  <div className="tooltip-container">
                    <img src={getImagePath('/images/sort.svg')} alt='sort' />
                    <span className="tooltip">Please click on table header to sort</span>
                  </div>
                </div>
                 <div className="search-bar">
               <span className="search-icon"><img src={getImagePath('/images/search.svg')} /></span>
               <input 
                 type="text" 
                 placeholder="Search by Order ID or User name..." 
                 value={searchTerm}
                 onChange={handleSearch}
               />
             </div>
            </div>
              </div>

              {/* Order List Table */}
              <div className="table-container">
                {filteredOrders.length === 0 && searchTerm ? (
                  <div className="no-results">
                    <div className="no-results-icon">🔍</div>
                    <h3>No orders found</h3>
                    <p>No orders match your search for "{searchTerm}". Try adjusting your search terms.</p>
                  </div>
                ) : (
                  <table className="order-table">
                  <thead>
                    <tr>
                      <th>
                        <input 
                          type="checkbox" 
                          className="select-all-checkbox" 
                          checked={isAllSelected}
                          ref={(input) => {
                            if (input) input.indeterminate = isIndeterminate;
                          }}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                      </th>
                      <th className="sortable" onClick={() => handleSort('id')}>
                        Order ID
                        {sortBy === 'id' && (
                          <span className="sort-icon">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th className="sortable" onClick={() => handleSort('user')}>
                        User
                        {sortBy === 'user' && (
                          <span className="sort-icon">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th className="sortable" onClick={() => handleSort('project')}>
                        Project
                        {sortBy === 'project' && (
                          <span className="sort-icon">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th className="sortable" onClick={() => handleSort('address')}>
                        Address
                        {sortBy === 'address' && (
                          <span className="sort-icon">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th className="sortable" onClick={() => handleSort('date')}>
                        Date
                        {sortBy === 'date' && (
                          <span className="sort-icon">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th className="sortable" onClick={() => handleSort('status')}>
                        Status
                        {sortBy === 'status' && (
                          <span className="sort-icon">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrders.map((order, index) => (
                      <tr key={order.id}>
                        <td>
                          <input 
                            type="checkbox" 
                            className="row-checkbox" 
                            checked={selectedOrders.has(order.id)}
                            onChange={(e) => handleRowSelect(order.id, e.target.checked)}
                          />
                        </td>
                        <td>{order.id}</td>
                        <td>
                          <div className="user-cell">
                            <div className="avatar">
                              <img src={order.user.avatar} alt={order.user.name} />
                            </div>
                            <span>{order.user.name}</span>
                          </div>
                        </td>
                        <td>{order.project}</td>
                        <td>
                          <div className="address-cell">
                            {order.address}
                          </div>
                        </td>
                        <td>
                          <div className="date-cell">
                            <img src={getImagePath('/images/calender.svg')} alt='calendar' /> {order.date}
                          </div>
                        </td>
                        <td>
                          <div className={`status-cell ${getStatusClass(order.status)}`}>
                            <span className={`status-dot ${getStatusClass(order.status)}`}></span>
                            {order.status}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                )}
              </div>

              {/* Pagination */}
              {filteredOrders.length > 0 && (
              <div className="pagination">
                <div className="pagination-info">
                  {searchTerm ? (
                    `Showing ${startIndex + 1} to ${Math.min(endIndex, filteredOrders.length)} of ${filteredOrders.length} orders (${allOrders.length} total)`
                  ) : (
                    `Showing ${startIndex + 1} to ${Math.min(endIndex, filteredOrders.length)} of ${filteredOrders.length} orders`
                  )}
                </div>
                <div className="pagination-controls">
                  <button 
                    className="page-btn" 
                    onClick={() => handlePageChange(currentOrderPage - 1)}
                    disabled={currentOrderPage === 1}
                  >
                    ‹
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button 
                      key={page}
                      className={`page-btn ${currentOrderPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    className="page-btn" 
                    onClick={() => handlePageChange(currentOrderPage + 1)}
                    disabled={currentOrderPage === totalPages}
                  >
                    ›
                  </button>
                </div>
              </div>
              )}
            </>
          ) : currentPage === 'ecommerce' ? (
            <>
              {/* eCommerce Tag */}
              <div className="ecommerce-tag">eCommerce</div>

              {/* KPI Cards and Chart Section */}
              <div className="kpi-chart-section">
                {/* KPI Cards in 2x2 Grid */}
                <div className="kpi-section">
                  <div className="kpi-card" style={{backgroundColor:"#E3F5FF"}}>
                    <h3>Customers</h3>
                    <div className='kpi_container'>
                    <div className="kpi-value">3,781</div>
                    <div className="kpi-change">
                      +11.01%
                      <img src='/images/up_arrow.svg' alt='arrow_up' />
                    </div>
                    </div>
                  </div>
                  <div className="kpi-card" style={{backgroundColor:"#F7F9FB"}}>
                    <h3>Orders</h3>
                    <div className='kpi_container'>
                    <div className="kpi-value">1,219</div>
                    <div className="kpi-change">
                    -0.03%
                    <img src={getImagePath('/images/arrow_fall.svg')} alt='arrow_up' />
                    </div>
                    </div>
                  </div>
                  <div className="kpi-card" style={{backgroundColor:"#F7F9FB"}}>
                    <h3>Revenue</h3>
                    <div className='kpi_container'>
                    <div className="kpi-value">$695</div>
                    <div className="kpi-change">
                    +15.03%
                    <img src={getImagePath('/images/up_arrow.svg')} alt='arrow_up' />
                    </div>
                    </div>
                  </div>
                  <div className="kpi-card" style={{backgroundColor:"#E5ECF6"}}>
                    <h3>Growth</h3>
                    <div className='kpi_container'>
                    <div className="kpi-value">30.1%</div>
                    <div className="kpi-change">
                    +6.08%
                    <img src='/images/up_arrow.svg' alt='arrow_up' />
                    </div>
                    </div>
                  </div>
                </div>

                {/* Chart Container */}
                <div className="chart-container">
                  <h3>Projections vs Actuals</h3>
                  <div className="chart-wrapper">
                    <Chart
                    options={{
                      chart: {
                        type: 'bar',
                        stacked: true,
                        height: '100%',
                        toolbar: {
                          show: false
                        }
                      },
                      plotOptions: {
                        bar: {
                          horizontal: false,
                          columnWidth: '30%',
                          borderRadius: 4
                        }
                      },
                      dataLabels: {
                        enabled: false
                      },
                      stroke: {
                        show: true,
                        width: 0,
                        colors: ['transparent']
                      },
                      xaxis: {
                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        axisBorder: {
                          show: false
                        },
                        axisTicks: {
                          show: false
                        },
                        labels: {
                          style: {
                            colors: '#666',
                            fontSize: '12px'
                          }
                        }
                      },
                      yaxis: {
                        tickAmount: 4,
                        labels: {
                          formatter: function (val) {
                            return val + 'M'
                          },
                          style: {
                            colors: '#666',
                            fontSize: '12px'
                          }
                        }
                      },
                      fill: {
                        opacity: 1,
                        type: 'solid'
                      },
                      colors: ['#A8C5DA', 'rgb(229, 236, 246)'],
                      legend: {
                        show: false
                      },
                      grid: {
                        show: true,
                        borderColor: '#f0f0f0',
                        strokeDashArray: 0,
                        xaxis: {
                          lines: {
                            show: false
                          }
                        },
                        yaxis: {
                          lines: {
                            show: true
                          }
                        }
                      },
                      tooltip: {
                        y: {
                          formatter: function (val) {
                            return val + 'M'
                          }
                        }
                      }
                    }}
                    series={[
                      {
                        name: 'Actuals',
                        data: [15, 20, 17, 22, 12, 18]
                      },
                      {
                        name: 'Projections',
                        data: [5, 5, 4, 5, 4, 5]
                      }
                    ]}
                    type="bar"
                    height="100%"
                  />
                  </div>
                </div>
              </div>

              {/* Revenue Charts Section */}
              <div className="revenue-charts-section">
                 {/* Revenue Line Chart */}
                 <div className="revenue-chart-container">
                 <div className='brand-section gap_2rem'>
                  <h3>Revenue</h3>
                  <div className="revenue-legend">
                    <div className="legend-item">
                      <div className="legend-dot current-week" style={{backgroundColor: isDarkTheme ? '#ffffff' : '#1C1C1C'}}></div>
                      <span><span className='font_400 black_c legend_w'>Current Week</span> <span className='font_600 black_c legend_w'>$58,211</span></span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-dot previous-week"></div>
                      <span><span className='font_400 black_c legend_w'>Previous Week</span> <span className='font_600 black_c legend_w'>$68,768</span></span>
                    </div>
                  </div>
                  </div>
                  <div className="revenue-chart-wrapper">
                    <Chart
                      options={{
                        chart: {
                          type: 'line',
                          height: '100%',
                          toolbar: {
                            show: false
                          }
                        },
                        stroke: {
                          curve: 'smooth',
                          width: 3
                        },
                        dataLabels: {
                          enabled: false
                        },
                        xaxis: {
                          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                          axisBorder: {
                            show: false
                          },
                          axisTicks: {
                            show: false
                          },
                          labels: {
                            style: {
                              colors: '#666',
                              fontSize: '12px'
                            }
                          }
                        },
                        yaxis: {
                          labels: {
                            formatter: function (val) {
                              return val + 'M'
                            },
                            style: {
                              colors: '#666',
                              fontSize: '12px'
                            }
                          }
                        },
                        colors: [isDarkTheme ? '#ffffff' : '#1C1C1C', '#A8C5DA'],
                        grid: {
                          show: true,
                          borderColor: '#f0f0f0',
                          strokeDashArray: 0,
                          xaxis: {
                            lines: {
                              show: false
                            }
                          },
                          yaxis: {
                            lines: {
                              show: true
                            }
                          }
                        },
                        legend: {
                          show: false
                        },
                        tooltip: {
                          theme: isDarkTheme ? 'dark' : 'light',
                          style: {
                            fontSize: '12px'
                          },
                          y: {
                            formatter: function (val) {
                              return val + 'M'
                            }
                          }
                        }
                      }}
                      series={[
                        {
                          name: 'Current Week',
                          data: [12, 9, 7, 10, 15, 20]
                        },
                        {
                          name: 'Previous Week',
                          data: [7, 17, 12, 9, 16, 22]
                        }
                      ]}
                      type="line"
                      height="100%"
                    />
                  </div>
                </div>
                {/* Revenue by Location */}
                <div className="revenue-location">
                  <h3>Revenue by Location</h3>
                  <div className="location-content">
                    <div className="world-map">
                      <MapContainer
                        center={[20, 0]}
                        zoom={0}
                        style={{ height: '150px', width: '100%' }}
                        className="leaflet-container"
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {locations.map((location, index) => (
                          <Marker key={index} position={location.position}>
                            <Popup>
                              <div>
                                <strong>{location.name}</strong><br/>
                                Revenue: {location.revenue}
                              </div>
                            </Popup>
                          </Marker>
                        ))}
                      </MapContainer>
                    </div>
                    <div className="location-list">
                      <div className="location-item">
                        <span>New York</span>
                        <div className="location-bar">
                          <div className="bar-fill" style={{width: '72%'}}></div>
                        </div>
                        <span className="location-value">72K</span>
                      </div>
                      <div className="location-item">
                        <span>San Francisco</span>
                        <div className="location-bar">
                          <div className="bar-fill" style={{width: '39%'}}></div>
                        </div>
                        <span className="location-value">39K</span>
                      </div>
                      <div className="location-item">
                        <span>Sydney</span>
                        <div className="location-bar">
                          <div className="bar-fill" style={{width: '25%'}}></div>
                        </div>
                        <span className="location-value">25K</span>
                      </div>
                      <div className="location-item">
                        <span>Singapore</span>
                        <div className="location-bar">
                          <div className="bar-fill" style={{width: '61%'}}></div>
                        </div>
                        <span className="location-value">61K</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="bottom-section">
                <div className="products-table">
                  <h3>Top Selling Products</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>ASOS Ridley High Waist</td>
                        <td>$79.49</td>
                        <td>82</td>
                        <td>$6,518.18</td>
                      </tr>
                      <tr>
                        <td>Marco Lightweight Shirt</td>
                        <td>$128.50</td>
                        <td>37</td>
                        <td>$4,754.50</td>
                      </tr>
                      <tr>
                        <td>Half Sleeve Shirt</td>
                        <td>$39.99</td>
                        <td>64</td>
                        <td>$2,559.36</td>
                      </tr>
                      <tr>
                        <td>Lightweight Jacket</td>
                        <td>$20.00</td>
                        <td>184</td>
                        <td>$3,680.00</td>
                      </tr>
                      <tr>
                        <td>Marco Shoes</td>
                        <td>$79.49</td>
                        <td>64</td>
                        <td>$1,965.81</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="total-sales">
                  <h3>Total Sales</h3>
                  <div className="sales-content">
                    <div className="donut-chart-container">
                      <Chart
                        options={{
                          chart: {
                            type: 'donut',
                            height: 200,
                            toolbar: {
                              show: false
                            }
                          },
                          plotOptions: {
                            pie: {
                              donut: {
                                size: '70%',
                                labels: {
                                  show: true,
                                  name: {
                                    show: false
                                  },
                                  value: {
                                    show: true,
                                    fontSize: '24px',
                                    fontWeight: 600,
                                    color: '#333',
                                    formatter: function (val) {
                                      return val + '%'
                                    }
                                  },
                                  total: {
                                    show: false
                                  }
                                }
                              }
                            }
                          },
                          dataLabels: {
                            enabled: false
                          },
                          colors: [isDarkTheme ? '#C6C7F8' : '#1C1C1C', '#BAEDBD', '#95A4FC', '#B1E3FF', '#333'],
                          legend: {
                            show: false
                          },
                          tooltip: {
                            y: {
                              formatter: function (val, { seriesIndex, w }) {
                                const labels = ['Direct', 'Affiliate', 'Sponsored', 'E-mail'];
                                const amounts = ['$300.56', '$135.18', '$154.02', '$48.96'];
                                return labels[seriesIndex] + ': ' + amounts[seriesIndex];
                              }
                            }
                          },
                          stroke: {
                            show: false
                          }
                        }}
                        series={[38.6, 17.1, 19.5, 6.2]}
                        type="donut"
                        height={200}
                      />
                    </div>
                    <div className="sales-breakdown">
                      <div className="sales-item">
                        <div className="sales-dot direct"></div>
                        <span>Direct</span>
                        <span>$300.56</span>
                      </div>
                      <div className="sales-item">
                        <div className="sales-dot affiliate"></div>
                        <span>Affiliate</span>
                        <span>$135.18</span>
                      </div>
                      <div className="sales-item">
                        <div className="sales-dot sponsored"></div>
                        <span>Sponsored</span>
                        <span>$154.02</span>
                      </div>
                      <div className="sales-item">
                        <div className="sales-dot email"></div>
                        <span>E-mail</span>
                        <span>$48.96</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Right Side Drawer */}
      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={toggleDrawer}>
          <div className="right-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-content">
              {/* Notifications Section */}
              <div className="drawer-section">
                <h3 className="drawer-heading">Notifications</h3>
                <div className="notification-list">
                  <div className="notification-item">
                    <img src='/images/bug.svg' alt='bug' />
                    <div className="notification-content">
                      <div className="notification-text">You have a bug that needs...</div>
                      <div className="notification-time">Just now</div>
                    </div>
                  </div>
                  <div className="notification-item">
                  <img src='/images/user.svg' alt='user' />
                    <div className="notification-content">
                      <div className="notification-text">New user registered</div>
                      <div className="notification-time">59 minutes ago</div>
                    </div>
                  </div>
                  <div className="notification-item">
                  <img src={getImagePath('/images/bug.svg')} alt='bug' />
                    <div className="notification-content">
                      <div className="notification-text">You have a bug that needs...</div>
                      <div className="notification-time">12 hours ago</div>
                    </div>
                  </div>
                  <div className="notification-item">
                  <img src='/images/lane.svg' alt='lane' />
                    <div className="notification-content">
                      <div className="notification-text">Andi Lane subscribed to you</div>
                      <div className="notification-time">Today, 11:59 AM</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activities Section */}
              <div className="drawer-section">
                <h3 className="drawer-heading">Activities</h3>
                <div className="activity-list">
                  <div className="activity-item">
                  <img src='/images/act1.svg' alt='act1' />
                    <div className="activity-content">
                      <div className="activity-text">You have a bug that needs...</div>
                      <div className="activity-time">Just now</div>
                    </div>
                  </div>
                  <div className="activity-item">
                  <img src='/images/act2.svg' alt='act2' />
                    <div className="activity-content">
                      <div className="activity-text">Released a new version</div>
                      <div className="activity-time">59 minutes ago</div>
                    </div>
                  </div>
                  <div className="activity-item">
                  <img src='/images/act3.svg' alt='act3' />
                    <div className="activity-content">
                      <div className="activity-text">Submitted a bug</div>
                      <div className="activity-time">12 hours ago</div>
                    </div>
                  </div>
                  <div className="activity-item">
                  <img src='/images/act4.svg' alt='act4' />
                    <div className="activity-content">
                      <div className="activity-text">Modified A data in Page X</div>
                      <div className="activity-time">Today, 11:59 AM</div>
                    </div>
                  </div>
                  <div className="activity-item">
                  <img src='/images/act5.svg' alt='act5' />
                    <div className="activity-content">
                      <div className="activity-text">Deleted a page in Project X</div>
                      <div className="activity-time">Feb 2, 2023</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contacts Section */}
              <div className="drawer-section">
                <h3 className="drawer-heading">Contacts</h3>
                <div className="contact-list">
                  <div className="contact-item">
                  <img src='/images/a1.svg' alt='a1' />
                    <span className="contact-name">Natali Craig</span>
                  </div>
                  <div className="contact-item">
                  <img src='/images/a5.svg' alt='a5' />
                    <span className="contact-name">Drew Cano</span>
                  </div>
                  <div className="contact-item">
                  <img src='/images/a4.svg' alt='a4' />
                    <span className="contact-name">Orlando Diggs</span>
                  </div>
                  <div className="contact-item">
                  <img src='/images/a3.svg' alt='a3' />
                    <span className="contact-name">Andi Lane</span>
                  </div>
                  <div className="contact-item">
                  <img src='/images/a2.svg' alt='a2' />
                    <span className="contact-name">Kate Morrison</span>
                  </div>
                  <div className="contact-item">
                  <img src='/images/a1.svg' alt='a1' />
                    <span className="contact-name">Koray Okumus</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;