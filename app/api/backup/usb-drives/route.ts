import { NextRequest, NextResponse } from 'next/server';
import USBBackupManager from '../../../../utils/usbBackup';

export async function GET(request: NextRequest) {
  try {
    const backupManager = new USBBackupManager();
    const availableDrives = await backupManager.detectUSBDrives();
    
    return NextResponse.json({
      success: true,
      drives: availableDrives,
      count: availableDrives.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('USB drive detection error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to detect USB drives',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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
    const isAvailable = await backupManager.isDriveAvailable(usbPath);
    const isWritable = await backupManager.isDriveWritable(usbPath);
    const driveName = await backupManager.getDriveName(usbPath);
    
    return NextResponse.json({
      success: true,
      drive: {
        path: usbPath,
        name: driveName,
        isAvailable,
        isWritable,
        canUse: isAvailable && isWritable
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('USB drive test error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to test USB drive',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
