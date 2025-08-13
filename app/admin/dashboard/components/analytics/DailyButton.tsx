import { Download } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import SelectedDayMvt from "./SelectedDayMvt";

const PDFDownloadDailyReportButton = ({ analyticsData, selectedYear, selectedMonth, selectedDay, toast, isChecked }: any) => {
    const printRef = useRef(null);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const reactToPrintFn = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Rapport-Analytics-${selectedYear}-${selectedMonth}-${selectedDay}`,
        onAfterPrint: () => {
            toast.success('Rapport PDF téléchargé avec succès');
        },
        onPrintError: (error) => {
            toast.error('Erreur lors du téléchargement du PDF');
            console.error('Print error:', error);
        },
    });

    const handleDownloadReport = () => {
        // Check if there's data to export - Fix the data structure check
        if (!analyticsData.dailyMovements && 
            !analyticsData.monthlySummary && 
            !analyticsData.categoryStats?.length && 
            !analyticsData.productPerformance?.length && 
            !analyticsData.currentOverview) {
            toast.error('Aucune donnée à exporter');
            return;
        }
        
        reactToPrintFn();
    };

    return (
        <>
            {/* Hidden PDF Component */}
            <div style={{ display: 'none' }}>
                <SelectedDayMvt
                    ref={printRef}
                    analyticsData={analyticsData}
                    selectedYear={selectedYear}
                    selectedMonth={selectedMonth}
                    selectedDay={selectedDay}
                    isChecked={isChecked}
                />
            </div>

            {/* Download Button */}
            <button
                onClick={handleDownloadReport}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
                <Download className="w-4 h-4" />
                <span>Exporter le rapport journalier</span>
            </button>
        </>
    );
};

export default PDFDownloadDailyReportButton;