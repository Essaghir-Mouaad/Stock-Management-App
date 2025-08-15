// app/api/backup/usb-drives/route.js
import USBBackupManager from '../../../utils/usbBackup.js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backupManager = new USBBackupManager();
    const drives = await backupManager.detectUSBDrives();
    
    return NextResponse.json({
      success: true,
      drives: drives
    });
  } catch (error) {
    console.error('Error detecting USB drives:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      drives: []
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { usbPath } = await request.json();
    
    if (!usbPath) {
      return NextResponse.json({
        success: false,
        error: 'USB path is required'
      }, { status: 400 });
    }

    const backupManager = new USBBackupManager();
    
    // Test the specific USB drive
    const testResult = await backupManager.testUSBDrive(usbPath);
    
    return NextResponse.json({
      success: true,
      drive: testResult
    });
    
  } catch (error) {
    console.error('Error testing USB drive:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}