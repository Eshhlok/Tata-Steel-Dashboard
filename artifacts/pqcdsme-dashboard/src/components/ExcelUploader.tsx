import { parseCRMExcel } from "@/services/excelParser";
import { CRMKPI, mapCRMRows } from "@/services/crmMapper";
import { useState } from "react";
interface Props {
  onDataLoaded: (
    data: CRMKPI[],
    rows: Record<string, any>[]
  ) => void;
  compact?: boolean;
}
export default function ExcelUploader({ onDataLoaded, compact=false }: Props

) {
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    
    if (!file) return;

    try {
      const parsedData =
        await parseCRMExcel(file);
        
      if(!parsedData){
        return
      }

      const mappedData =
        mapCRMRows(
            parsedData.rows,
            parsedData.months
        );  
        onDataLoaded(mappedData, parsedData.rows);
        console.log(
            parsedData.rows.filter(
                row =>
                row.KPI ===
                "Roll Consumption"
            )
            );

    } catch (error) {
      console.error(
        "Excel parsing failed:",
        error
      );
    }
  };

if (compact) {
  return (
    <label className="px-3 py-1.5 text-xs font-medium bg-slate-800 text-white rounded-md cursor-pointer hover:bg-slate-700">
      Upload CRM

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        className="hidden"
      />
    </label>
  );
}

  return (
    <div className="bg-white border rounded-sm p-4">
      <h3 className="text-sm font-medium mb-3">
        CRM Data Source
      </h3>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        className="block w-full text-sm"
      />
    </div>
  );
}
