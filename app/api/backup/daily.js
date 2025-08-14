// pages/api/backup/daily.js
import USBBackupManager from '../../../utils/usbBackup';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { analyticsData, usbPath } = req.body;
    
    if (!analyticsData) {
      return res.status(400).json({ 
        error: 'Analytics data is required' 
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
    
    // Perform daily backup with progress tracking
    const result = await backupManager.performDailyBackup(analyticsData, (message, progress) => {
      console.log(`Backup progress: ${message} (${progress}%)`);
    });
    
    if (result.success) {
      res.status(200).json({ 
        message: result.message,
        timestamp: result.timestamp,
        files: result.files,
        usbPath: selectedUsbPath,
        backupRoot: backupManager.backupRoot
      });
    } else {
      res.status(500).json({ error: 'Backup failed', details: result.message });
    }
    
  } catch (error) {
    console.error('Backup API error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Backup failed';
    let errorDetails = error.message;
    
    if (error.message.includes('USB drive not found')) {
      errorMessage = 'USB drive not found or inaccessible';
    } else if (error.message.includes('not writable')) {
      errorMessage = 'USB drive is not writable. Please check permissions.';
    } else if (error.message.includes('not initialized')) {
      errorMessage = 'USB backup system not properly initialized';
    } else if (error.message.includes('Source database not found')) {
      errorMessage = 'Database file not found. Please check database configuration.';
    }
    
    res.status(500).json({ 
      error: errorMessage, 
      details: errorDetails,
      timestamp: new Date().toISOString()
    });
  }
}