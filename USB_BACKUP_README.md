# 🔒 USB Backup System - Stock Management App

## 🚀 Overview

The improved USB backup system provides robust, automated backup functionality for your Stock Management App. It automatically detects USB drives, validates their accessibility, and creates organized backup structures with progress tracking and comprehensive error handling.

## ✨ Key Features

- **🔍 Automatic USB Detection**: Automatically finds and validates available USB drives
- **✅ Drive Validation**: Checks drive availability, writability, and permissions
- **📊 Progress Tracking**: Real-time progress updates during backup operations
- **🔄 Auto-Backup**: Configurable automatic backups (hourly, daily, monthly)
- **📁 Organized Structure**: Creates well-organized folder hierarchies
- **📝 Comprehensive Logging**: Logs all backup operations for troubleshooting
- **🧹 Auto-Cleanup**: Automatically removes old backups to save space
- **🛡️ Error Handling**: Robust error handling with user-friendly messages

## 🏗️ System Requirements

- **OS**: Windows 10/11, macOS, or Linux
- **Node.js**: Version 16 or higher
- **USB Drive**: Formatted with FAT32, NTFS, or exFAT
- **Permissions**: Write access to USB drive

## 📱 How to Use

### 1. Connect USB Drive
- Insert your USB drive into your computer
- Ensure it's properly mounted and accessible
- The system will automatically detect it

### 2. Select USB Drive
- Open the Backup Manager in your app
- The system will show all available USB drives
- Select the drive you want to use for backups
- Use the "Test Drive" button to verify it's working

### 3. Configure Auto-Backup
- Enable automatic backups (runs every hour)
- The system will automatically select the best available drive
- Backups run silently in the background

### 4. Manual Backups
- **Daily Backup**: Creates daily stock reports and database backup
- **Monthly Report**: Generates comprehensive monthly summaries

## 📁 Backup Structure

```
USB:\StockAppBackup\
├── reports\
│   ├── 2025\
│   │   ├── 08-Août\
│   │   │   ├── 13-08-2025_Stock_IN.pdf
│   │   │   ├── 13-08-2025_Stock_OUT.pdf
│   │   │   ├── 13-08-2025_Daily_Summary.pdf
│   │   │   └── Monthly_Report_08-2025.pdf
│   │   └── 09-Septembre\
├── database_backups\
│   ├── database_backup_13-08-2025.db
│   └── database_backup_14-08-2025.db
└── logs\
    ├── backup_log_2025-08.txt
    └── backup_log_2025-09.txt
```

## 🔧 Technical Details

### API Endpoints

#### GET `/api/backup/usb-drives`
Detects and lists all available USB drives.

**Response:**
```json
{
  "success": true,
  "drives": [
    {
      "path": "E:",
      "name": "Drive E:",
      "freeSpace": "Unknown",
      "isWritable": true
    }
  ],
  "count": 1,
  "timestamp": "2025-08-13T10:30:00.000Z"
}
```

#### POST `/api/backup/usb-drives`
Tests a specific USB drive for compatibility.

**Request:**
```json
{
  "usbPath": "E:"
}
```

**Response:**
```json
{
  "success": true,
  "drive": {
    "path": "E:",
    "name": "Drive E:",
    "isAvailable": true,
    "isWritable": true,
    "canUse": true
  }
}
```

#### POST `/api/backup/daily`
Performs daily backup operation.

**Request:**
```json
{
  "analyticsData": { /* your analytics data */ },
  "usbPath": "E:" // optional, auto-detected if not provided
}
```

#### POST `/api/backup/monthly`
Generates monthly report.

**Request:**
```json
{
  "analyticsData": { /* your analytics data */ },
  "year": 2025,
  "month": 8,
  "usbPath": "E:" // optional, auto-detected if not provided
}
```

### Error Handling

The system provides detailed error messages for common issues:

- **USB drive not found**: Drive is not connected or accessible
- **Drive not writable**: Insufficient permissions or drive is read-only
- **Database not found**: Source database file is missing
- **Initialization failed**: Drive validation failed

## 🧪 Testing

Run the test script to verify your USB backup system:

```bash
node test-usb-backup.js
```

This will:
1. Detect available USB drives
2. Test drive accessibility and permissions
3. Perform sample backups
4. Generate test reports
5. Verify file creation

## 🚨 Troubleshooting

### Common Issues

#### 1. "No USB drives detected"
- **Solution**: Ensure USB drive is properly connected and mounted
- **Check**: Drive appears in File Explorer/Finder
- **Try**: Refresh drives using the refresh button

#### 2. "Drive not writable"
- **Solution**: Check drive permissions and format
- **Check**: Right-click drive → Properties → Security
- **Try**: Format drive as NTFS or FAT32

#### 3. "Backup failed"
- **Solution**: Check available disk space
- **Check**: Ensure drive has at least 100MB free space
- **Try**: Use a different USB drive

#### 4. "Database not found"
- **Solution**: Verify database file exists
- **Check**: `./prisma/dev.db` file exists
- **Try**: Restart the application

### Debug Mode

Enable detailed logging by checking the browser console for:
- USB detection logs
- Backup progress updates
- Error details and stack traces

## 🔄 Auto-Backup Configuration

### Hourly Backups
- Runs every 60 minutes
- Only when USB drive is available
- Silent operation (no user notification)
- Logs all operations

### Manual Backups
- Daily backup: Creates comprehensive daily reports
- Monthly report: Generates monthly summaries
- Database backup: Copies database file with timestamp

## 📊 Performance Optimization

- **Parallel Processing**: PDF generation runs concurrently
- **Streaming**: Large files are streamed to avoid memory issues
- **Cleanup**: Automatic removal of old backups (configurable)
- **Validation**: Pre-flight checks before backup operations

## 🛡️ Security Features

- **Drive Validation**: Only writable drives are used
- **Permission Checks**: Verifies write access before operations
- **Safe Operations**: No system files are modified
- **Isolated Storage**: All backups are contained within USB drive

## 📈 Monitoring

### Backup Logs
All backup operations are logged with:
- Timestamp
- Operation type
- Success/failure status
- Error details (if applicable)
- File paths created

### Status Indicators
- Real-time backup status
- Progress bars for long operations
- Drive availability status
- Last backup timestamp

## 🔮 Future Enhancements

- **Cloud Backup**: Integration with cloud storage services
- **Compression**: Automatic file compression for space savings
- **Encryption**: Optional backup encryption
- **Scheduling**: Custom backup schedules
- **Notifications**: Email/SMS backup confirmations

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review backup logs in the USB drive
3. Run the test script to verify functionality
4. Check browser console for error details
5. Ensure USB drive meets requirements

## 📝 Changelog

### Version 2.0 (Current)
- ✅ Automatic USB drive detection
- ✅ Improved error handling
- ✅ Progress tracking
- ✅ Comprehensive logging
- ✅ Auto-cleanup functionality
- ✅ Drive validation and testing

### Version 1.0 (Previous)
- ❌ Hardcoded drive letters
- ❌ Basic error handling
- ❌ No progress tracking
- ❌ Limited drive validation

---

**🎉 Your USB backup system is now robust, reliable, and user-friendly!**
