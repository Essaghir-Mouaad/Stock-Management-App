// / pages/api/backup/monthly.js
import USBBackupManager from '../../../utils/usbBackup';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { analyticsData, year, month, usbPath } = req.body;
    
    if (!analyticsData || !year || !month) {
      return res.status(400).json({ 
        error: 'Analytics data, year, and month are required' 
      });
    }

    // Initialize backup manager
    const backupManager = new USBBackupManager();
    
    // If no USB path provided, try to auto-detect
    let selectedUsbPath = usbPath;
    if (!selectedUsbPath) {
      const availableDrives = await backupManager.detectUSBDrives();
      
      if (availableDrives.length === 0) {
        return res.status(400).json({ 
          error: 'No USB drives detected. Please connect a USB drive and try again.',
          availableDrives: []
        });
      }
      
      // Use the first available writable drive
      const firstWritableDrive = availableDrives.find(drive => drive.isWritable);
      if (!firstWritableDrive) {
        return res.status(400).json({ 
          error: 'No writable USB drives found. Please check drive permissions.',
          availableDrives: availableDrives.map(d => ({ path: d.path, name: d.name }))
        });
      }
      
      selectedUsbPath = firstWritableDrive.path;
    }
    
    // Initialize with the selected USB drive
    const initResult = await backupManager.initialize(selectedUsbPath);
    
    if (!initResult.success) {
      return res.status(400).json({ 
        error: initResult.message 
      });
    }
    
    // Check if USB is still available after initialization
    if (!backupManager.isUSBAvailable()) {
      return res.status(400).json({ 
        error: 'USB drive became unavailable during initialization. Please check the drive connection.' 
      });
    }
    
    // Generate monthly report with progress tracking
    const reportPath = await backupManager.generateMonthlyReport(
      analyticsData, 
      year, 
      month, 
      (message, progress) => {
        console.log(`Monthly report progress: ${message} (${progress}%)`);
      }
    );
    
    res.status(200).json({ 
      message: 'Monthly backup completed successfully',
      reportPath: reportPath,
      usbPath: selectedUsbPath,
      backupRoot: backupManager.backupRoot,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Monthly backup error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Monthly backup failed';
    let errorDetails = error.message;
    
    if (error.message.includes('USB drive not found')) {
      errorMessage = 'USB drive not found or inaccessible';
    } else if (error.message.includes('not writable')) {
      errorMessage = 'USB drive is not writable. Please check permissions.';
    } else if (error.message.includes('not initialized')) {
      errorMessage = 'USB backup system not properly initialized';
    } else if (error.message.includes('Failed to generate monthly report')) {
      errorMessage = 'Failed to generate monthly report. Please check data format.';
    }
    
    res.status(500).json({ 
      error: errorMessage, 
      details: errorDetails,
      timestamp: new Date().toISOString()
    });
  }
}
