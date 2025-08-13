import { useEffect, useRef, useState } from "react";
import { Download, Eraser } from "lucide-react";
import PDFReportLayout from "./PrintReport";
import { useReactToPrint } from "react-to-print";

const PDFDownloadButton = ({
  analyticsData,
  selectedYear,
  selectedMonth,
  toast,
  numberStudents,
  isChecked,
  enableButton,
}: any) => {
  const [loading, setLoading] = useState(false);
  const printRef = useRef(null);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const reactToPrintFn = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Rapport-Analytics-${selectedYear}-${selectedMonth}`,
    onAfterPrint: () => {
      toast.success("Rapport PDF téléchargé avec succès");
    },
    onPrintError: (error) => {
      toast.error("Erreur lors du téléchargement du PDF");
      console.error("Print error:", error);
    },
  });

  const handleDownloadReport = () => {
    if (
      !analyticsData.dailyMovements &&
      !analyticsData.monthlySummary &&
      !analyticsData.categoryStats?.length &&
      !analyticsData.productPerformance?.length &&
      !analyticsData.currentOverview
    ) {
      toast.error("Aucune donnée à exporter");
      return;
    }
    reactToPrintFn();
  };

  useEffect(() => {
    if (enableButton === 1 || enableButton === 0) {
      setLoading(true);
    } else {
      setLoading(false); // reset when valid
    }
  }, [enableButton]);

  return (
    <>
      {/* Hidden PDF Component */}
      <div style={{ display: "none" }}>
        <PDFReportLayout
          ref={printRef}
          analyticsData={analyticsData}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          monthNames={monthNames}
          numberStudents={numberStudents}
          isChecked={isChecked}
        />
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownloadReport}
        disabled={loading}
        className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {!loading ?(<span  className="flex"><Download className="w-5 h-5 mr-3" />Exporter le rapport</span>):(<span className="flex"> <Eraser className="w-6 mr-3 h-6"/> Nbr d'etudient</span>)}
      </button>
    </>
  );
};

export default PDFDownloadButton;
