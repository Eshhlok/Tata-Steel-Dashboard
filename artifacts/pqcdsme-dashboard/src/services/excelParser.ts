import * as XLSX from "xlsx";

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
) {

  const buffer =
    await file.arrayBuffer();

  const workbook =
    XLSX.read(buffer, {
      type: "array",
    });

  const sheet =
    workbook.Sheets[
      workbook.SheetNames[0]
    ];

  const rows =
    XLSX.utils.sheet_to_json<Record<string, any>>(
    sheet,
    {
      defval: "",
    }
  );

  if (!rows.length) {
    return null;
  }

  const headers =
    Object.keys(
      rows[0] as Record<
        string,
        unknown
      >
    );

  const months = headers.filter(
    (header) =>
      /^[A-Za-z]{3}'\d{2}$/.test(header)
  );

  return {
    months,
    rows,
  };
}