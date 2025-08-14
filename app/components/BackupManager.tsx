import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface USBDrive {
  path: string;
  name: string;
  freeSpace: string;
  isWritable: boolean;
}

interface BackupManagerProps {
  analyticsData: any;
  selectedYear: number;
  selectedMonth: number;
}

const BackupManager: React.FC<BackupManagerProps> = ({ analyticsData, selectedYear, selectedMonth }) => {
  const [backupStatus, setBackupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [availableDrives, setAvailableDrives] = useState<USBDrive[]>([]);
  const [selectedDrive, setSelectedDrive] = useState<string>('');
  const [progress, setProgress] = useState<{ message: string; percentage: number } | null>(null);
  const [backupDetails, setBackupDetails] = useState<any>(null);

  // Load available USB drives on component mount
  useEffect(() => {
    loadAvailableDrives();
  }, []);

  // Auto backup every hour
  useEffect(() => {
    if (!autoBackupEnabled || !selectedDrive) return;

    const interval = setInterval(async () => {
      await performDailyBackup(true); // silent backup
    }, 60 * 60 * 1000); // Every hour

    return () => clearInterval(interval);
  }, [autoBackupEnabled, analyticsData, selectedDrive]);

  // Load available USB drives
  const loadAvailableDrives = async () => {
    try {
      const response = await fetch('/api/backup/usb-drives');
      const result = await response.json();

      if (result.success) {
        setAvailableDrives(result.drives);
        
        // Auto-select the first available writable drive
        const firstWritable = result.drives.find((drive: USBDrive) => drive.isWritable);
        if (firstWritable) {
          setSelectedDrive(firstWritable.path);
        }
      } else {
        console.error('Failed to load USB drives:', result.error);
      }
    } catch (error) {
      console.error('Error loading USB drives:', error);
    }
  };

  // Test specific USB drive
  const testUSBDrive = async (drivePath: string) => {
    try {
      const response = await fetch('/api/backup/usb-drives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usbPath: drivePath }),
      });

      const result = await response.json();

      if (result.success) {
        if (result.drive.canUse) {
          toast.success(`USB drive ${drivePath} is ready for use!`);
          return true;
        } else {
          toast.error(`USB drive ${drivePath} is not usable (Available: ${result.drive.isAvailable}, Writable: ${result.drive.isWritable})`);
          return false;
        }
      } else {
        toast.error(`Failed to test USB drive: ${result.error}`);
        return false;
      }
    } catch (error) {
      toast.error('Error testing USB drive');
      return false;
    }
  };

  // Manual daily backup
  const performDailyBackup = async (silent = false) => {
    if (!selectedDrive) {
      toast.error('Please select a USB drive first');
      return;
    }

    try {
      setBackupStatus('loading');
      setProgress({ message: 'Initializing backup...', percentage: 0 });
      
      const response = await fetch('/api/backup/daily', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          analyticsData, 
          usbPath: selectedDrive 
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setBackupStatus('success');
        setLastBackup(new Date().toLocaleString('fr-FR'));
        setBackupDetails(result);
        
        if (!silent) {
          toast.success('Sauvegarde quotidienne terminée avec succès!');
        }
      } else {
        setBackupStatus('error');
        if (!silent) {
          toast.error(`Erreur de sauvegarde: ${result.error}`);
        }
      }
    } catch (error) {
      setBackupStatus('error');
      if (!silent) {
        toast.error('Erreur de connexion lors de la sauvegarde');
      }
    } finally {
      setTimeout(() => {
        setBackupStatus('idle');
        setProgress(null);
      }, 3000);
    }
  };

  // Monthly backup
  const performMonthlyBackup = async () => {
    if (!selectedDrive) {
      toast.error('Please select a USB drive first');
      return;
    }

    try {
      setBackupStatus('loading');
      setProgress({ message: 'Generating monthly report...', percentage: 0 });
      
      const response = await fetch('/api/backup/monthly', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          analyticsData, 
          year: selectedYear, 
          month: selectedMonth,
          usbPath: selectedDrive
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setBackupStatus('success');
        setBackupDetails(result);
        toast.success('Sauvegarde mensuelle terminée avec succès!');
      } else {
        setBackupStatus('error');
        toast.error(`Erreur de sauvegarde: ${result.error}`);
      }
    } catch (error) {
      setBackupStatus('error');
      toast.error('Erreur de connexion lors de la sauvegarde');
    } finally {
      setTimeout(() => {
        setBackupStatus('idle');
        setProgress(null);
      }, 3000);
    }
  };

  // Refresh USB drives
  const refreshDrives = async () => {
    await loadAvailableDrives();
    toast.success('USB drives refreshed');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">🔒 Gestion des Sauvegardes USB</h3>
      
      {/* USB Drive Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sélectionner le lecteur USB:
        </label>
        <div className="flex gap-2 items-center">
          <select
            value={selectedDrive}
            onChange={(e) => setSelectedDrive(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={backupStatus === 'loading'}
          >
            <option value="">-- Sélectionner un lecteur --</option>
            {availableDrives.map((drive) => (
              <option key={drive.path} value={drive.path}>
                {drive.path} - {drive.name} {drive.isWritable ? '(Écriture OK)' : '(Lecture seule)'}
              </option>
            ))}
          </select>
          <button
            onClick={refreshDrives}
            className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm"
            disabled={backupStatus === 'loading'}
          >
            🔄
          </button>
        </div>
        
        {selectedDrive && (
          <div className="mt-2">
            <button
              onClick={() => testUSBDrive(selectedDrive)}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
            >
              Tester le lecteur
            </button>
          </div>
        )}
      </div>

      {/* Status Indicator */}
      <div className="flex items-center mb-4">
        <div className={`w-3 h-3 rounded-full mr-2 ${
          backupStatus === 'loading' ? 'bg-yellow-500 animate-pulse' :
          backupStatus === 'success' ? 'bg-green-500' :
          backupStatus === 'error' ? 'bg-red-500' : 'bg-gray-400'
        }`}></div>
        <span className="text-sm text-gray-600">
          État: {
            backupStatus === 'loading' ? 'Sauvegarde en cours...' :
            backupStatus === 'success' ? 'Sauvegarde réussie' :
            backupStatus === 'error' ? 'Erreur de sauvegarde' : 'Prêt'
          }
        </span>
      </div>

      {/* Progress Bar */}
      {progress && (
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-1">{progress.message}</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 text-right">{progress.percentage}%</div>
        </div>
      )}

      {/* Last Backup Info */}
      {lastBackup && (
        <div className="text-sm text-gray-600 mb-4">
          Dernière sauvegarde: {lastBackup}
        </div>
      )}

      {/* Backup Details */}
      {backupDetails && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="text-sm text-green-800">
            <div className="font-medium">Détails de la sauvegarde:</div>
            <div>Lecteur: {backupDetails.usbPath}</div>
            <div>Fichiers créés: {backupDetails.files?.length || 0}</div>
            {backupDetails.files && (
              <div className="text-xs mt-1">
                {backupDetails.files.map((file: string, index: number) => (
                  <div key={index}>• {file}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auto Backup Toggle */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded">
        <span className="text-sm font-medium">Sauvegarde automatique (toutes les heures)</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={autoBackupEnabled}
            onChange={(e) => setAutoBackupEnabled(e.target.checked)}
            className="sr-only peer"
            disabled={!selectedDrive}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Backup Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => performDailyBackup()}
          disabled={backupStatus === 'loading' || !selectedDrive}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
        >
          {backupStatus === 'loading' ? '⏳ Sauvegarde...' : '📅 Sauvegarde Quotidienne'}
        </button>
        
        <button
          onClick={performMonthlyBackup}
          disabled={backupStatus === 'loading' || !selectedDrive}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
        >
          {backupStatus === 'loading' ? '⏳ Sauvegarde...' : '📊 Rapport Mensuel'}
        </button>
      </div>

      {/* USB Structure Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
        <div className="font-medium mb-1">📁 Structure USB créée:</div>
        <div className="font-mono">
          USB:\StockAppBackup\<br/>
          ├── reports\<br/>
          │&nbsp;&nbsp;&nbsp;├── 2025\<br/>
          │&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├── 08-Août\<br/>
          │&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├── 13-08-2025_Stock_IN.pdf<br/>
          │&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├── 13-08-2025_Stock_OUT.pdf<br/>
          │&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├── 13-08-2025_Daily_Summary.pdf<br/>
          │&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└── Monthly_Report_08-2025.pdf<br/>
          ├── database_backups\<br/>
          └── logs\
        </div>
      </div>

      {/* Available Drives Info */}
      {availableDrives.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="text-sm text-blue-800">
            <div className="font-medium mb-1">🔍 Lecteurs USB détectés:</div>
            {availableDrives.map((drive) => (
              <div key={drive.path} className="text-xs">
                • {drive.path} - {drive.name} 
                {drive.isWritable ? ' ✅ Écriture OK' : ' ❌ Lecture seule'}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupManager;