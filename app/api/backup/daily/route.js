// app/api/backup/daily/route.js
import USBBackupManager from '../../../utils/usbBackup.js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { analyticsData, usbPath } = await request.json();
    
    if (!analyticsData) {
      return NextResponse.json(
        { error: 'Analytics data is required' },
        { status: 400 }
      );
    }

    // Initialize backup manager
    const backupManager = new USBBackupManager();
    
    // If no USB path provided, try to auto-detect
    let selectedUsbPath = usbPath;
    if (!selectedUsbPath) {
      const availableDrives = await backupManager.detectUSBDrives();
      
      if (availableDrives.length === 0) {
        return NextResponse.json({
          error: 'No USB drives detected. Please connect a USB drive and try again.',
          availableDrives: []
        }, { status: 400 });
      }
      
      // Use the first available writable drive
      const firstWritableDrive = availableDrives.find(drive => drive.isWritable);
      if (!firstWritableDrive) {
        return NextResponse.json({
          error: 'No writable USB drives found. Please check drive permissions.',
          availableDrives: availableDrives.map(d => ({ path: d.path, name: d.name }))
        }, { status: 400 });
      }
      
      selectedUsbPath = firstWritableDrive.path;
    }
    
    // Initialize with the selected USB drive
    const initResult = await backupManager.initialize(selectedUsbPath);
    
    if (!initResult.success) {
      return NextResponse.json(
        { error: initResult.message },
        { status: 400 }
      );
    }
    
    // Check if USB is still available after initialization
    if (!backupManager.isUSBAvailable()) {
      return NextResponse.json({
        error: 'USB drive became unavailable during initialization. Please check the drive connection.'
      }, { status: 400 });
    }
    
    // Perform daily backup with progress tracking
    const result = await backupManager.performDailyBackup(analyticsData, (message, progress) => {
      console.log(`Backup progress: ${message} (${progress}%)`);
    });
    
    if (result.success) {
      return NextResponse.json({
        message: result.message,
        timestamp: result.timestamp,
        files: result.files,
        usbPath: selectedUsbPath,
        backupRoot: backupManager.backupRoot
      });
    } else {
      return NextResponse.json(
        { error: 'Backup failed', details: result.message },
        { status: 500 }
      );
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
    
    return NextResponse.json({
      error: errorMessage,
      details: errorDetails,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}