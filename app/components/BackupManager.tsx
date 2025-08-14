import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const BackupManager = ({ analyticsData, selectedYear, selectedMonth }:any) => {
  const [backupStatus, setBackupStatus] = useState('idle'); // idle, loading, success, error
  const [lastBackup, setLastBackup] = useState(null);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);

  // Auto backup every hour
  useEffect(() => {
    if (!autoBackupEnabled) return;

    const interval = setInterval(async () => {
      await performDailyBackup(true); // silent backup
    }, 60 * 60 * 1000); // Every hour

    return () => clearInterval(interval);
  }, [autoBackupEnabled, analyticsData]);

  // Manual daily backup
  const performDailyBackup = async (silent = false) => {
    try {
      setBackupStatus('loading');
      
      const response = await fetch('/api/backup/daily', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ analyticsData }),
      });

      const result = await response.json();

      if (response.ok) {
        setBackupStatus('success');
        setLastBackup(new Date().toLocaleString('fr-FR'));
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
      setTimeout(() => setBackupStatus('idle'), 3000);
    }
  };

  // Monthly backup
  const performMonthlyBackup = async () => {
    try {
      setBackupStatus('loading');
      
      const response = await fetch('/api/backup/monthly', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          analyticsData, 
          year: selectedYear, 
          month: selectedMonth 
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setBackupStatus('success');
        toast.success('Sauvegarde mensuelle terminée avec succès!');
      } else {
        setBackupStatus('error');
        toast.error(`Erreur de sauvegarde: ${result.error}`);
      }
    } catch (error) {
      setBackupStatus('error');
      toast.error('Erreur de connexion lors de la sauvegarde');
    } finally {
      setTimeout(() => setBackupStatus('idle'), 3000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">🔒 Gestion des Sauvegardes USB</h3>
      
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

      {/* Last Backup Info */}
      {lastBackup && (
        <div className="text-sm text-gray-600 mb-4">
          Dernière sauvegarde: {lastBackup}
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
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Backup Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => performDailyBackup()}
          disabled={backupStatus === 'loading'}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
        >
          {backupStatus === 'loading' ? '⏳ Sauvegarde...' : '📅 Sauvegarde Quotidienne'}
        </button>
        
        <button
          onClick={performMonthlyBackup}
          disabled={backupStatus === 'loading'}
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
          ├── 2025\<br/>
          │&nbsp;&nbsp;&nbsp;├── 08-Août\<br/>
          │&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├── 13-08-2025_Stock_IN.pdf<br/>
          │&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├── 13-08-2025_Stock_OUT.pdf<br/>
          │&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├── 13-08-2025_Daily_Summary.pdf<br/>
          │&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└── Monthly_Report_08-2025.pdf<br/>
          └── database_backups\
        </div>
      </div>
    </div>
  );
};

export default BackupManager;