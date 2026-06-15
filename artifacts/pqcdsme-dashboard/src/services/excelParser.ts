import * as XLSX from "xlsx";
import { ParsedCRMData } from "@/types/crm";

const FIXED_COLUMNS = [
  "S No.",
  "KPI",
  "Sub-KPI",
  "Unit",
  "UOM",
  "FY26 Actual",
  "FY27 ABP",
];

export async function parseCRMExcel(
  file: File
): Promise<ParsedCRMData> {

  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer, {
    type: "array",
  });

  const sheet =
    workbook.Sheets[
      workbook.SheetNames[0]
    ];

  const rows =
    XLSX.utils.sheet_to_json<
      Record<string, any>
    >(sheet, {
      defval: "",
    });

  if (!rows.length) {
    return {
      months: [],
      kpis: [],
    };
  }

  const headers =
    Object.keys(rows[0]);

  const months =
    headers.filter(
      (header) =>
        !FIXED_COLUMNS.includes(header)
    );

  return {
    months,
    kpis: [],
  };
}