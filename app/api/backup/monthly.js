// / pages/api/backup/monthly.js
import USBBackupManager from '../../../utils/usbBackup';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { analyticsData, year, month } = req.body;
    
    const backupManager = new USBBackupManager('E:\\');
    
    if (!backupManager.isUSBAvailable()) {
      return res.status(400).json({ 
        error: 'USB drive not found' 
      });
    }
    
    await backupManager.generateMonthlyReport(analyticsData, year, month);
    
    res.status(200).json({ 
      message: 'Monthly backup completed successfully' 
    });
    
  } catch (error) {
    console.error('Monthly backup error:', error);
    res.status(500).json({ 
      error: 'Monthly backup failed', 
      details: error.message 
    });
  }
}
