# Public Safety Risk Alert System

A modern web application that visualizes public safety risks across localities using an interactive map interface with heatmap visualization.

## Core Features

### Interactive Map View
- Full-screen interactive map displaying localities with color-coded risk levels:
  - Green: Low risk
  - Yellow: Medium risk  
  - Red: High risk
- Heatmap visualization based on incident data analysis
- Clickable localities that display detailed information in a side panel:
  - Locality name and risk score
  - Number of incidents in recent period
  - Most common incident type
  - Peak incident time window
- Search functionality with auto-suggest dropdown to find and zoom to specific localities
- Visual highlighting of selected locality with distinct border or glow effect
- Visual highlighting of searched localities with clear indicators
- Color-coded legend for risk levels

### Alerts Section
- List of current high-risk alerts displaying:
  - Location and timestamp
  - Brief incident description
- Sorting and filtering options by severity and date

### Analytics Dashboard
- Visual charts showing:
  - Incident frequency trends over time
  - Peak hours analysis
  - Incident type distribution across areas

### About Page
- Information about data sources (demo/mock data)
- Risk score calculation methodology
- Privacy statement

## Backend Requirements

### Data Storage
- Store simulated incident data including:
  - Location coordinates and names
  - Incident timestamps and types
  - Severity levels
- Store calculated risk scores for localities
- Store searchable locality names for auto-suggest functionality

### API Endpoints
- Fetch all localities with current risk levels
- Retrieve incident history by locality
- Get alert data for high-risk areas
- Provide analytics data for charts
- Search localities by name with auto-suggest results

## Frontend Requirements

### User Interface
- Clean, modern government/smart city dashboard design
- Map-first interface with prominent interactive map
- Search bar with auto-suggest dropdown functionality
- Side panel for displaying locality details when clicked
- Visual highlighting system for selected and searched localities
- Responsive layout for desktop, tablet, and mobile
- Smooth transitions and subtle animations
- Component-based React architecture with Tailwind CSS

### Navigation
- Simple navigation between Map View, Alerts, Analytics, and About pages
- No authentication required
- Fast loading with preloaded demo dataset

## Technical Notes
- Uses simulated/demo data for testing purposes
- No real-time data integration required
- Focus on visualization and user experience
- Risk calculations based on historical incident patterns
