// utils/usbBackup.js
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

class USBBackupManager {
  constructor(usbPath = 'E:') { // Change to your USB drive letter
    this.usbPath = usbPath;
    this.backupRoot = path.join(usbPath, 'StockAppBackup');
    this.ensureBackupStructure();
  }

  // Ensure the backup folder structure exists
  ensureBackupStructure() {
    try {
      if (!fs.existsSync(this.backupRoot)) {
        fs.mkdirSync(this.backupRoot, { recursive: true });
      }
    } catch (error) {
      console.error('USB not accessible:', error);
      throw new Error('USB drive not found or accessible');
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
      dateString: `${String(date.getDate()).padStart(2, '0')}-${month}-${year}`
    };
  }

  // Create folder structure for date
  createDateFolders(dateInfo) {
    const yearPath = path.join(this.backupRoot, String(dateInfo.year));
    const monthPath = path.join(yearPath, `${dateInfo.month}-${dateInfo.monthName}`);
    
    if (!fs.existsSync(yearPath)) {
      fs.mkdirSync(yearPath, { recursive: true });
    }
    
    if (!fs.existsSync(monthPath)) {
      fs.mkdirSync(monthPath, { recursive: true });
    }
    
    return monthPath;
  }

  // Generate PDF reports
  async generateDailyReports(analyticsData, dateInfo) {
    const monthPath = this.createDateFolders(dateInfo);
    
    // Generate Stock IN report
    await this.generateStockInReport(analyticsData, monthPath, dateInfo);
    
    // Generate Stock OUT report
    await this.generateStockOutReport(analyticsData, monthPath, dateInfo);
    
    // Generate Daily Summary
    await this.generateDailySummaryReport(analyticsData, monthPath, dateInfo);
  }

  // Generate Stock IN PDF
  async generateStockInReport(analyticsData, monthPath, dateInfo) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const fileName = `${dateInfo.dateString}_Stock_IN.pdf`;
      const filePath = path.join(monthPath, fileName);
      
      doc.pipe(fs.createWriteStream(filePath));
      
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
             .text(`${index + 1}. Produit: ${movement.productName || movement.product}`)
             .text(`   Quantité: ${movement.quantity}`)
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
      doc.on('end', resolve);
      doc.on('error', reject);
    });
  }

  // Generate Stock OUT PDF
  async generateStockOutReport(analyticsData, monthPath, dateInfo) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const fileName = `${dateInfo.dateString}_Stock_OUT.pdf`;
      const filePath = path.join(monthPath, fileName);
      
      doc.pipe(fs.createWriteStream(filePath));
      
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
             .text(`${index + 1}. Produit: ${movement.productName || movement.product}`)
             .text(`   Quantité: ${movement.quantity}`)
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
      doc.on('end', resolve);
      doc.on('error', reject);
    });
  }

  // Generate Daily Summary PDF
  async generateDailySummaryReport(analyticsData, monthPath, dateInfo) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const fileName = `${dateInfo.dateString}_Daily_Summary.pdf`;
      const filePath = path.join(monthPath, fileName);
      
      doc.pipe(fs.createWriteStream(filePath));
      
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
             .text(`${index + 1}. ${cat.categoryName || cat.category}`)
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
             .text(`${index + 1}. ${product.productName || product.name}`)
             .text(`   Mouvement: ${product.totalMovement || 0}`)
             .text(`   Stock Actuel: ${product.currentStock || 0}`)
             .moveDown(0.5);
        });
      }
      
      doc.end();
      doc.on('end', resolve);
      doc.on('error', reject);
    });
  }

  // Generate Monthly Report
  async generateMonthlyReport(analyticsData, year, month) {
    const dateInfo = { year, month, monthName: this.getMonthName(month) };
    const monthPath = this.createDateFolders(dateInfo);
    
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const fileName = `Monthly_Report_${String(month).padStart(2, '0')}-${year}.pdf`;
      const filePath = path.join(monthPath, fileName);
      
      doc.pipe(fs.createWriteStream(filePath));
      
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
      
      // Add more monthly statistics as needed
      
      doc.end();
      doc.on('end', resolve);
      doc.on('error', reject);
    });
  }

  getMonthName(monthNumber) {
    const monthNames = {
      1: 'Janvier', 2: 'Février', 3: 'Mars', 4: 'Avril',
      5: 'Mai', 6: 'Juin', 7: 'Juillet', 8: 'Août',
      9: 'Septembre', 10: 'Octobre', 11: 'Novembre', 12: 'Décembre'
    };
    return monthNames[monthNumber];
  }

  // Backup database file
  async backupDatabase() {
    try {
      const dbPath = './prisma/dev.db'; // Your SQLite database path
      const dateInfo = this.getDateInfo();
      const backupPath = path.join(this.backupRoot, 'database_backups');
      
      if (!fs.existsSync(backupPath)) {
        fs.mkdirSync(backupPath, { recursive: true });
      }
      
      const backupFileName = `database_backup_${dateInfo.dateString}.db`;
      const backupFilePath = path.join(backupPath, backupFileName);
      
      fs.copyFileSync(dbPath, backupFilePath);
      console.log(`Database backed up to: ${backupFilePath}`);
      
      return backupFilePath;
    } catch (error) {
      console.error('Database backup failed:', error);
      throw error;
    }
  }

  // Main backup function
  async performDailyBackup(analyticsData) {
    try {
      const dateInfo = this.getDateInfo();
      
      // Generate daily reports
      await this.generateDailyReports(analyticsData, dateInfo);
      
      // Backup database
      await this.backupDatabase();
      
      console.log(`Daily backup completed successfully for ${dateInfo.dateString}`);
      return true;
    } catch (error) {
      console.error('Daily backup failed:', error);
      return false;
    }
  }

  // Check USB availability
  isUSBAvailable() {
    try {
      return fs.existsSync(this.usbPath);
    } catch (error) {
      return false;
    }
  }
}

export default USBBackupManager;