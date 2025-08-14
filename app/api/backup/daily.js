// pages/api/backup/daily.js
import USBBackupManager from '../../../utils/usbBackup';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { analyticsData } = req.body;
    
    // Initialize backup manager (change USB path as needed)
    const backupManager = new USBBackupManager('E:\\'); // Windows
    // const backupManager = new USBBackupManager('/Volumes/USB/'); // macOS
    // const backupManager = new USBBackupManager('/media/usb/'); // Linux
    
    // Check if USB is available
    if (!backupManager.isUSBAvailable()) {
      return res.status(400).json({ 
        error: 'USB drive not found. Please ensure USB is connected.' 
      });
    }
    
    // Perform daily backup
    const success = await backupManager.performDailyBackup(analyticsData);
    
    if (success) {
      res.status(200).json({ 
        message: 'Daily backup completed successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({ error: 'Backup failed' });
    }
    
  } catch (error) {
    console.error('Backup API error:', error);
    res.status(500).json({ 
      error: 'Backup failed', 
      details: error.message 
    });
  }
}