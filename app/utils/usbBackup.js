// utils/usbBackup.js
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

class USBBackupManager {
  constructor() {
    this.usbPath = null;
    this.backupRoot = null;
    this.isInitialized = false;
    this.supportedDrives = this.getSupportedDrives();
  }

  // Get supported drive letters for Windows
  getSupportedDrives() {
    const drives = [];
    // Check common drive letters (C: is usually system drive, so we skip it)
    for (let i = 65; i <= 90; i++) { // A-Z
      const driveLetter = String.fromCharCode(i) + ':';
      if (driveLetter !== 'C:') {
        drives.push(driveLetter);
      }
    }
    return drives;
  }

  // Auto-detect USB drives
  async detectUSBDrives() {
    const availableDrives = [];
    
    for (const drive of this.supportedDrives) {
      try {
        if (await this.isDriveAvailable(drive)) {
          availableDrives.push({
            path: drive,
            name: await this.getDriveName(drive),
            freeSpace: await this.getDriveFreeSpace(drive),
            isWritable: await this.isDriveWritable(drive)
          });
        }
      } catch (error) {
        console.log(`Drive ${drive} not available:`, error.message);
      }
    }
    
    return availableDrives;
  }

  // Check if a drive is available
  async isDriveAvailable(drivePath) {
    return new Promise((resolve) => {
      try {
        // Try to access the drive
        const testPath = path.join(drivePath, 'test_write.tmp');
        fs.writeFileSync(testPath, 'test');
        fs.unlinkSync(testPath);
        resolve(true);
      } catch (error) {
        resolve(false);
      }
    });
  }

  // Get drive name/label
  async getDriveName(drivePath) {
    try {
      // Try to read drive properties
      const stats = fs.statSync(drivePath);
      return `Drive ${drivePath}`;
    } catch (error) {
      return `Unknown Drive ${drivePath}`;
    }
  }

  // Get free space on drive
  async getDriveFreeSpace(drivePath) {
    try {
      // This is a simplified check - in production you might want to use a native module
      return 'Unknown';
    } catch (error) {
      return 'Unknown';
    }
  }

  // Check if drive is writable
  async isDriveWritable(drivePath) {
    return new Promise((resolve) => {
      try {
        const testPath = path.join(drivePath, 'test_write.tmp');
        fs.writeFileSync(testPath, 'test');
        fs.unlinkSync(testPath);
        resolve(true);
      } catch (error) {
        resolve(false);
      }
    });
  }

  // Initialize with a specific USB drive
  async initialize(usbPath) {
    try {
      if (!usbPath) {
        throw new Error('USB path is required');
      }

      // Validate the drive
      if (!(await this.isDriveAvailable(usbPath))) {
        throw new Error(`Drive ${usbPath} is not available or accessible`);
      }

      if (!(await this.isDriveWritable(usbPath))) {
        throw new Error(`Drive ${usbPath} is not writable`);
      }

      this.usbPath = usbPath;
      this.backupRoot = path.join(usbPath, 'StockAppBackup');
      this.ensureBackupStructure();
      this.isInitialized = true;

      return {
        success: true,
        message: `USB drive ${usbPath} initialized successfully`,
        path: usbPath,
        backupRoot: this.backupRoot
      };
    } catch (error) {
      this.isInitialized = false;
      throw new Error(`Failed to initialize USB drive: ${error.message}`);
    }
  }

  // Ensure the backup folder structure exists
  ensureBackupStructure() {
    try {
      if (!fs.existsSync(this.backupRoot)) {
        fs.mkdirSync(this.backupRoot, { recursive: true });
      }
      
      // Create subdirectories
      const subdirs = ['reports', 'database_backups', 'logs'];
      subdirs.forEach(dir => {
        const fullPath = path.join(this.backupRoot, dir);
        if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath, { recursive: true });
        }
      });
    } catch (error) {
      throw new Error(`Failed to create backup structure: ${error.message}`);
    }
  }

  // Get current date info
  getDateInfo(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const monthNames = {
      '01': 'Janvier', '02': 'Février', '03': 'Mars', '04': 'Avril',
      '05': 'Mai', '06': 'Juin', '07': 'Juillet', '08': 'Août',
      '09': 'Septembre', '10': 'Octobre', '11': 'Novembre', '12': 'Décembre'
    };
    
    return {
      year,
      month,
      monthName: monthNames[month],
      day: String(date.getDate()).padStart(2, '0'),
      dateString: `${String(date.getDate()).padStart(2, '0')}-${month}-${year}`,
      timestamp: date.getTime()
    };
  }

  // Create folder structure for date
  createDateFolders(dateInfo) {
    try {
      const yearPath = path.join(this.backupRoot, 'reports', String(dateInfo.year));
      const monthPath = path.join(yearPath, `${dateInfo.month}-${dateInfo.monthName}`);
      
      if (!fs.existsSync(yearPath)) {
        fs.mkdirSync(yearPath, { recursive: true });
      }
      
      if (!fs.existsSync(monthPath)) {
        fs.mkdirSync(monthPath, { recursive: true });
      }
      
      return monthPath;
    } catch (error) {
      throw new Error(`Failed to create date folders: ${error.message}`);
    }
  }

  // Generate PDF reports with progress callback
  async generateDailyReports(analyticsData, dateInfo, progressCallback = null) {
    try {
      const monthPath = this.createDateFolders(dateInfo);
      
      if (progressCallback) progressCallback('Creating daily reports...', 10);
      
      // Generate Stock IN report
      await this.generateStockInReport(analyticsData, monthPath, dateInfo);
      if (progressCallback) progressCallback('Stock IN report generated', 30);
      
      // Generate Stock OUT report
      await this.generateStockOutReport(analyticsData, monthPath, dateInfo);
      if (progressCallback) progressCallback('Stock OUT report generated', 60);
      
      // Generate Daily Summary
      await this.generateDailySummaryReport(analyticsData, monthPath, dateInfo);
      if (progressCallback) progressCallback('Daily summary generated', 90);
      
      return monthPath;
    } catch (error) {
      throw new Error(`Failed to generate daily reports: ${error.message}`);
    }
  }

  // Generate Stock IN PDF
  async generateStockInReport(analyticsData, monthPath, dateInfo) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const fileName = `${dateInfo.dateString}_Stock_IN.pdf`;
        const filePath = path.join(monthPath, fileName);
        
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);
        
        // Header
        doc.fontSize(20).text('RAPPORT STOCK ENTREES', { align: 'center' });
        doc.fontSize(14).text(`Date: ${dateInfo.dateString}`, { align: 'right' });
        doc.moveDown();
        
        // Stock IN data
        if (analyticsData.dailyMovements && analyticsData.dailyMovements.length > 0) {
          const stockInMovements = analyticsData.dailyMovements.filter(
            movement => movement.type === 'IN' || movement.movementType === 'STOCK_IN'
          );
          
          doc.fontSize(16).text('Entrées de Stock:', { underline: true });
          doc.moveDown();
          
          stockInMovements.forEach((movement, index) => {
            doc.fontSize(12)
               .text(`${index + 1}. Produit: ${movement.productName || movement.product || 'N/A'}`)
               .text(`   Quantité: ${movement.quantity || 0}`)
               .text(`   Date: ${new Date(movement.date).toLocaleDateString('fr-FR')}`)
               .text(`   Référence: ${movement.reference || 'N/A'}`)
               .moveDown();
          });
          
          // Total
          const totalIn = stockInMovements.reduce((sum, mov) => sum + (mov.quantity || 0), 0);
          doc.fontSize(14).text(`Total Entrées: ${totalIn}`, { align: 'right' });
        } else {
          doc.fontSize(12).text('Aucune entrée de stock pour cette période.');
        }
        
        doc.end();
        
        writeStream.on('finish', () => resolve(filePath));
        writeStream.on('error', reject);
        doc.on('error', reject);
      } catch (error) {
        reject(new Error(`Failed to generate Stock IN report: ${error.message}`));
      }
    });
  }

  // Generate Stock OUT PDF
  async generateStockOutReport(analyticsData, monthPath, dateInfo) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const fileName = `${dateInfo.dateString}_Stock_OUT.pdf`;
        const filePath = path.join(monthPath, fileName);
        
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);
        
        // Header
        doc.fontSize(20).text('RAPPORT STOCK SORTIES', { align: 'center' });
        doc.fontSize(14).text(`Date: ${dateInfo.dateString}`, { align: 'right' });
        doc.moveDown();
        
        // Stock OUT data
        if (analyticsData.dailyMovements && analyticsData.dailyMovements.length > 0) {
          const stockOutMovements = analyticsData.dailyMovements.filter(
            movement => movement.type === 'OUT' || movement.movementType === 'STOCK_OUT'
          );
          
          doc.fontSize(16).text('Sorties de Stock:', { underline: true });
          doc.moveDown();
          
          stockOutMovements.forEach((movement, index) => {
            doc.fontSize(12)
               .text(`${index + 1}. Produit: ${movement.productName || movement.product || 'N/A'}`)
               .text(`   Quantité: ${movement.quantity || 0}`)
               .text(`   Date: ${new Date(movement.date).toLocaleDateString('fr-FR')}`)
               .text(`   Référence: ${movement.reference || 'N/A'}`)
               .moveDown();
          });
          
          // Total
          const totalOut = stockOutMovements.reduce((sum, mov) => sum + (mov.quantity || 0), 0);
          doc.fontSize(14).text(`Total Sorties: ${totalOut}`, { align: 'right' });
        } else {
          doc.fontSize(12).text('Aucune sortie de stock pour cette période.');
        }
        
        doc.end();
        
        writeStream.on('finish', () => resolve(filePath));
        writeStream.on('error', reject);
        doc.on('error', reject);
      } catch (error) {
        reject(new Error(`Failed to generate Stock OUT report: ${error.message}`));
      }
    });
  }

  // Generate Daily Summary PDF
  async generateDailySummaryReport(analyticsData, monthPath, dateInfo) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const fileName = `${dateInfo.dateString}_Daily_Summary.pdf`;
        const filePath = path.join(monthPath, fileName);
        
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);
        
        // Header
        doc.fontSize(20).text('RESUME QUOTIDIEN', { align: 'center' });
        doc.fontSize(14).text(`Date: ${dateInfo.dateString}`, { align: 'right' });
        doc.moveDown();
        
        // Current Overview
        if (analyticsData.currentOverview) {
          doc.fontSize(16).text('Vue d\'ensemble:', { underline: true });
          doc.fontSize(12)
             .text(`Total Produits: ${analyticsData.currentOverview.totalProducts || 0}`)
             .text(`Stock Total: ${analyticsData.currentOverview.totalStock || 0}`)
             .text(`Valeur Totale: ${analyticsData.currentOverview.totalValue || 0} DH`)
             .moveDown();
        }
        
        // Category Stats
        if (analyticsData.categoryStats && analyticsData.categoryStats.length > 0) {
          doc.fontSize(16).text('Statistiques par Catégorie:', { underline: true });
          analyticsData.categoryStats.forEach((cat, index) => {
            doc.fontSize(12)
               .text(`${index + 1}. ${cat.categoryName || cat.category || 'N/A'}`)
               .text(`   Quantité: ${cat.totalQuantity || 0}`)
               .text(`   Valeur: ${cat.totalValue || 0} DH`)
               .moveDown(0.5);
          });
        }
        
        // Product Performance
        if (analyticsData.productPerformance && analyticsData.productPerformance.length > 0) {
          doc.addPage();
          doc.fontSize(16).text('Performance des Produits:', { underline: true });
          analyticsData.productPerformance.forEach((product, index) => {
            doc.fontSize(12)
               .text(`${index + 1}. ${product.productName || product.name || 'N/A'}`)
               .text(`   Mouvement: ${product.totalMovement || 0}`)
               .text(`   Stock Actuel: ${product.currentStock || 0}`)
               .moveDown(0.5);
          });
        }
        
        doc.end();
        
        writeStream.on('finish', () => resolve(filePath));
        writeStream.on('error', reject);
        doc.on('error', reject);
      } catch (error) {
        reject(new Error(`Failed to generate daily summary: ${error.message}`));
      }
    });
  }

  // Generate Monthly Report
  async generateMonthlyReport(analyticsData, year, month, progressCallback = null) {
    try {
      const dateInfo = { 
        year, 
        month: String(month).padStart(2, '0'), 
        monthName: this.getMonthName(month) 
      };
      const monthPath = this.createDateFolders(dateInfo);
      
      if (progressCallback) progressCallback('Generating monthly report...', 50);
      
      return new Promise((resolve, reject) => {
        try {
          const doc = new PDFDocument();
          const fileName = `Monthly_Report_${String(month).padStart(2, '0')}-${year}.pdf`;
          const filePath = path.join(monthPath, fileName);
          
          const writeStream = fs.createWriteStream(filePath);
          doc.pipe(writeStream);
          
          // Header
          doc.fontSize(20).text('RAPPORT MENSUEL', { align: 'center' });
          doc.fontSize(14).text(`${dateInfo.monthName} ${year}`, { align: 'center' });
          doc.moveDown();
          
          // Monthly Summary
          if (analyticsData.monthlySummary) {
            const summary = analyticsData.monthlySummary;
            doc.fontSize(16).text('Résumé Mensuel:', { underline: true });
            doc.fontSize(12)
               .text(`Total Entrées: ${summary.totalIn || 0}`)
               .text(`Total Sorties: ${summary.totalOut || 0}`)
               .text(`Mouvement Net: ${(summary.totalIn || 0) - (summary.totalOut || 0)}`)
               .text(`Nombre de Transactions: ${summary.totalTransactions || 0}`)
               .moveDown();
          }
          
          doc.end();
          
          writeStream.on('finish', () => resolve(filePath));
          writeStream.on('error', reject);
          doc.on('error', reject);
        } catch (error) {
          reject(new Error(`Failed to generate monthly report: ${error.message}`));
        }
      });
    } catch (error) {
      throw new Error(`Failed to generate monthly report: ${error.message}`);
    }
  }

  getMonthName(monthNumber) {
    const monthNames = {
      1: 'Janvier', 2: 'Février', 3: 'Mars', 4: 'Avril',
      5: 'Mai', 6: 'Juin', 7: 'Juillet', 8: 'Août',
      9: 'Septembre', 10: 'Octobre', 11: 'Novembre', 12: 'Décembre'
    };
    return monthNames[monthNumber] || 'Unknown';
  }

  // Backup database file
  async backupDatabase(progressCallback = null) {
    try {
      if (progressCallback) progressCallback('Backing up database...', 95);
      
      const dbPath = './prisma/dev.db'; // Your SQLite database path
      const dateInfo = this.getDateInfo();
      const backupPath = path.join(this.backupRoot, 'database_backups');
      
      if (!fs.existsSync(backupPath)) {
        fs.mkdirSync(backupPath, { recursive: true });
      }
      
      const backupFileName = `database_backup_${dateInfo.dateString}.db`;
      const backupFilePath = path.join(backupPath, backupFileName);
      
      // Check if source database exists
      if (!fs.existsSync(dbPath)) {
        throw new Error('Source database not found');
      }
      
      fs.copyFileSync(dbPath, backupFilePath);
      
      if (progressCallback) progressCallback('Database backup completed', 100);
      
      return backupFilePath;
    } catch (error) {
      throw new Error(`Database backup failed: ${error.message}`);
    }
  }

  // Main backup function with progress tracking
  async performDailyBackup(analyticsData, progressCallback = null) {
    try {
      if (!this.isInitialized) {
        throw new Error('USB backup manager not initialized. Call initialize() first.');
      }

      const dateInfo = this.getDateInfo();
      
      if (progressCallback) progressCallback('Starting daily backup...', 0);
      
      // Generate daily reports
      await this.generateDailyReports(analyticsData, dateInfo, progressCallback);
      
      // Backup database
      await this.backupDatabase(progressCallback);
      
      // Log successful backup
      await this.logBackup('daily', dateInfo, true, null);
      
      return {
        success: true,
        message: `Daily backup completed successfully for ${dateInfo.dateString}`,
        timestamp: dateInfo.timestamp,
        files: [
          `${dateInfo.dateString}_Stock_IN.pdf`,
          `${dateInfo.dateString}_Stock_OUT.pdf`,
          `${dateInfo.dateString}_Daily_Summary.pdf`,
          `database_backup_${dateInfo.dateString}.db`
        ]
      };
    } catch (error) {
      // Log failed backup
      await this.logBackup('daily', this.getDateInfo(), false, error.message);
      throw error;
    }
  }

  // Log backup operations
  async logBackup(type, dateInfo, success, errorMessage) {
    try {
      const logPath = path.join(this.backupRoot, 'logs');
      if (!fs.existsSync(logPath)) {
        fs.mkdirSync(logPath, { recursive: true });
      }
      
      const logFile = path.join(logPath, `backup_log_${dateInfo.year}-${dateInfo.month}.txt`);
      const logEntry = `[${new Date().toISOString()}] ${type.toUpperCase()} backup ${success ? 'SUCCESS' : 'FAILED'} - ${dateInfo.dateString}${errorMessage ? ` - Error: ${errorMessage}` : ''}\n`;
      
      fs.appendFileSync(logFile, logEntry);
    } catch (error) {
      console.error('Failed to log backup:', error);
    }
  }

  // Check USB availability
  isUSBAvailable() {
    return this.isInitialized && this.usbPath && fs.existsSync(this.usbPath);
  }

  // Get backup status
  getBackupStatus() {
    return {
      isInitialized: this.isInitialized,
      usbPath: this.usbPath,
      backupRoot: this.backupRoot,
      isAvailable: this.isUSBAvailable()
    };
  }

  // Clean up old backups (keep last 30 days)
  async cleanupOldBackups(daysToKeep = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      const reportsPath = path.join(this.backupRoot, 'reports');
      const dbBackupsPath = path.join(this.backupRoot, 'database_backups');
      
      // Clean up old reports
      if (fs.existsSync(reportsPath)) {
        await this.cleanupDirectory(reportsPath, cutoffDate);
      }
      
      // Clean up old database backups
      if (fs.existsSync(dbBackupsPath)) {
        await this.cleanupDirectory(dbBackupsPath, cutoffDate);
      }
      
      return { success: true, message: 'Cleanup completed' };
    } catch (error) {
      throw new Error(`Cleanup failed: ${error.message}`);
    }
  }

  // Clean up directory by date
  async cleanupDirectory(dirPath, cutoffDate) {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        await this.cleanupDirectory(itemPath, cutoffDate);
        
        // Remove empty directories
        if (fs.readdirSync(itemPath).length === 0) {
          fs.rmdirSync(itemPath);
        }
      } else if (stats.isFile() && stats.mtime < cutoffDate) {
        fs.unlinkSync(itemPath);
      }
    }
  }
}

export default USBBackupManager;