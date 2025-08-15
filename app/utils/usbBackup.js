// utils/usbBackup.js
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

class USBBackupManager {
  constructor() {
    this.backupRoot = null;
    this.usbPath = null;
  }

  async detectUSBDrives() {
    try {
      const drives = [];
      
      // For Windows
      if (os.platform() === 'win32') {
        const { execSync } = require('child_process');
        try {
          const output = execSync('wmic logicaldisk where drivetype=2 get deviceid,volumename,size,freespace', { encoding: 'utf8' });
          const lines = output.split('\n').filter(line => line.trim() && !line.includes('DeviceID'));
          
          for (const line of lines) {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 4) {
              const deviceId = parts[0];
              const volumeName = parts[parts.length - 3] || 'USB Drive';
              const size = parseInt(parts[parts.length - 2]);
              const freeSpace = parseInt(parts[parts.length - 1]);
              
              if (deviceId && deviceId.includes(':')) {
                drives.push({
                  path: deviceId,
                  name: volumeName,
                  freeSpace: `${(freeSpace / (1024 * 1024 * 1024)).toFixed(2)} GB`,
                  isWritable: await this.checkWritable(deviceId)
                });
              }
            }
          }
        } catch (error) {
          console.error('Error detecting Windows USB drives:', error);
        }
      }
      
      // For Unix-like systems (Linux, macOS)
      else {
        try {
          const mountPoints = await fs.readdir('/media').catch(() => []);
          for (const mountPoint of mountPoints) {
            const drivePath = `/media/${mountPoint}`;
            try {
              const stats = await fs.stat(drivePath);
              if (stats.isDirectory()) {
                drives.push({
                  path: drivePath,
                  name: mountPoint,
                  freeSpace: 'Unknown',
                  isWritable: await this.checkWritable(drivePath)
                });
              }
            } catch (error) {
              console.error(`Error checking ${drivePath}:`, error);
            }
          }
          
          // Also check /mnt for Linux and /Volumes for macOS
          const additionalPaths = os.platform() === 'darwin' ? ['/Volumes'] : ['/mnt'];
          for (const basePath of additionalPaths) {
            try {
              const items = await fs.readdir(basePath).catch(() => []);
              for (const item of items) {
                const drivePath = path.join(basePath, item);
                try {
                  const stats = await fs.stat(drivePath);
                  if (stats.isDirectory()) {
                    drives.push({
                      path: drivePath,
                      name: item,
                      freeSpace: 'Unknown',
                      isWritable: await this.checkWritable(drivePath)
                    });
                  }
                } catch (error) {
                  console.error(`Error checking ${drivePath}:`, error);
                }
              }
            } catch (error) {
              console.error(`Error reading ${basePath}:`, error);
            }
          }
        } catch (error) {
          console.error('Error detecting Unix USB drives:', error);
        }
      }
      
      return drives;
    } catch (error) {
      console.error('Error detecting USB drives:', error);
      return [];
    }
  }

  async checkWritable(drivePath) {
    try {
      const testFile = path.join(drivePath, '.write_test');
      await fs.writeFile(testFile, 'test');
      await fs.unlink(testFile);
      return true;
    } catch (error) {
      return false;
    }
  }

  async testUSBDrive(drivePath) {
    try {
      const stats = await fs.stat(drivePath);
      const isAvailable = stats.isDirectory();
      const isWritable = await this.checkWritable(drivePath);
      
      return {
        path: drivePath,
        isAvailable,
        isWritable,
        canUse: isAvailable && isWritable
      };
    } catch (error) {
      return {
        path: drivePath,
        isAvailable: false,
        isWritable: false,
        canUse: false,
        error: error.message
      };
    }
  }

  async initialize(usbPath) {
    try {
      this.usbPath = usbPath;
      this.backupRoot = path.join(usbPath, 'StockAppBackup');
      
      // Create backup directory structure
      await fs.mkdir(this.backupRoot, { recursive: true });
      await fs.mkdir(path.join(this.backupRoot, 'reports'), { recursive: true });
      await fs.mkdir(path.join(this.backupRoot, 'database_backups'), { recursive: true });
      await fs.mkdir(path.join(this.backupRoot, 'logs'), { recursive: true });
      
      return { success: true, message: 'USB backup initialized successfully' };
    } catch (error) {
      console.error('Error initializing USB backup:', error);
      return { success: false, message: error.message };
    }
  }

  isUSBAvailable() {
    return this.usbPath && this.backupRoot;
  }

  async performDailyBackup(analyticsData, progressCallback) {
    try {
      if (!this.isUSBAvailable()) {
        throw new Error('USB backup not initialized');
      }

      progressCallback?.('Starting daily backup...', 0);
      
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const monthName = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(today);
      
      // Create year and month directories
      const yearDir = path.join(this.backupRoot, 'reports', year.toString());
      const monthDir = path.join(yearDir, `${month}-${monthName}`);
      await fs.mkdir(monthDir, { recursive: true });

      progressCallback?.('Generating reports...', 25);

      const files = [];
      
      // Create daily summary file
      const summaryData = {
        date: dateStr,
        analyticsData,
        generated: new Date().toISOString()
      };
      
      const summaryPath = path.join(monthDir, `${dateStr}_Daily_Summary.json`);
      await fs.writeFile(summaryPath, JSON.stringify(summaryData, null, 2));
      files.push(`${dateStr}_Daily_Summary.json`);

      progressCallback?.('Backup completed', 100);

      return {
        success: true,
        message: 'Daily backup completed successfully',
        timestamp: new Date().toISOString(),
        files
      };
    } catch (error) {
      console.error('Error performing daily backup:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  async generateMonthlyReport(analyticsData, year, month, progressCallback) {
    try {
      if (!this.isUSBAvailable()) {
        throw new Error('USB backup not initialized');
      }

      progressCallback?.('Generating monthly report...', 0);
      
      const monthName = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(new Date(year, month - 1));
      const yearDir = path.join(this.backupRoot, 'reports', year.toString());
      const monthDir = path.join(yearDir, `${String(month).padStart(2, '0')}-${monthName}`);
      await fs.mkdir(monthDir, { recursive: true });

      progressCallback?.('Processing data...', 50);

      const reportData = {
        year,
        month,
        monthName,
        analyticsData,
        generated: new Date().toISOString()
      };
      
      const reportPath = path.join(monthDir, `Monthly_Report_${String(month).padStart(2, '0')}-${year}.json`);
      await fs.writeFile(reportPath, JSON.stringify(reportData, null, 2));

      progressCallback?.('Monthly report completed', 100);

      return reportPath;
    } catch (error) {
      console.error('Error generating monthly report:', error);
      throw error;
    }
  }
}

module.exports = USBBackupManager;