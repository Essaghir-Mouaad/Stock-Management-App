# Stock Management Application

## Overview
A comprehensive stock management system designed for local operation with efficient memory usage and data organization. The application features admin controls, worker interface, and automated backup systems.

## Table of Contents
- [Admin Section](#admin-section)
- [Worker Section](#worker-section)
- [Backup System](#backup-system)
- [JSON to PDF Converter](#json-to-pdf-converter)
- [Installation](#installation)
- [Usage](#usage)

## Admin Section

### Products Management
The application uses a **category-based invoice system** for optimal memory efficiency:

- **Invoice Creation**: Create invoices by category (vegetables, fruits, etc.) rather than individual products
- **Stock Updates**: When new stock arrives, update existing invoices instead of creating new ones
- **Data Organization**: Automatic organization by date/year/month/day structure
- **Memory Optimization**: Reduces memory usage for better local performance

### Statistics & Reports

#### Monthly Reports
1. **Setup Process**:
   - Disable the "Report/jrs" button initially
   - Select year and month
   - **Important**: Enter the correct number of students
   - Button remains disabled until student number is activated
   
2. **Features**:
   - Consumption per student calculation
   - Weekly consumption breakdown
   - Category performance analysis
   - Top 10 most-used products
   - Optional "AjouterValeur Stock" for monetary totals

#### Daily Reports
- **Comprehensive Data**: Product names, categories, in/out transactions, operators
- **Massive Output**: Single month report can exceed 120 pages
- **Selective Printing**: Activate "Report/jrs" to specify particular days
- **Detailed Information**: Complete operational history with timestamps

## Worker Section
- **User-Friendly**: Click the guide button for step-by-step instructions
- **Intuitive Interface**: All functions clearly labeled and accessible

## Backup System


!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!|
                                                                                                                       |
- **for this section please after you finish your operations makes sure that you reload the page before you press the  |button ### Save in both monthly and daily ###                                                                          |
                                                                                                                       |
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!|

### Hardware Requirements
- **Dedicated USB Drive**: Must be exclusively for stock management app
- **Permanent Connection**: Keep USB connected to the machine at all times

### Backup Process
1. **Select Drive**: Click "Sélectionner le lecteur"
2. **Test Drive**: Click "Tester le lecteur"
3. **Choose Mode**: Select daily/monthly (recommend both for security)
4. **Execute**: Complete backup automatically saves to USB

### USB Structure
The backup creates organized folders on your USB drive as shown in the application interface.

## JSON to PDF Converter

### Purpose
Converts stock management JSON files into human-readable PDF reports.

### Features
- **Exclusive Compatibility**: Only works with stock management app JSON files
- **Multiple Formats**:
  - Global Report (equivalent to monthly report with enhanced performance metrics)
  - Performance Report (detailed analysis of all products, not just top 10)
  - Custom date range selection

### Usage
1. Navigate to your USB drive
2. Upload JSON file to converter
3. Select desired PDF format
4. Click download for automatic conversion

## Installation
1. Ensure system meets local operation requirements
2. Connect dedicated USB drive
3. Launch application
4. Follow initial setup guide

## Best Practices
- Regularly update invoices instead of creating new ones
- Backup data daily and monthly
- Keep USB drive exclusively for this application
- Verify student numbers before generating reports
- Use JSON to PDF converter for data analysis

## Support
For detailed operational guidance, use the in-app guide system available in the worker section.