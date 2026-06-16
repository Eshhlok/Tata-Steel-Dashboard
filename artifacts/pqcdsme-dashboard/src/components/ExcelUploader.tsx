import { parseCRMExcel } from "@/services/excelParser";
import { CRMKPI, mapCRMRows } from "@/services/crmMapper";
interface Props {
  onDataLoaded: (
    data: CRMKPI[]
  ) => void;
}
export default function ExcelUploader({ onDataLoaded }: Props

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
        onDataLoaded(mappedData);

    } catch (error) {
      console.error(
        "Excel parsing failed:",
        error
      );
    }
  };

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
