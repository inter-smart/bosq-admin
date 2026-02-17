import * as XLSX from 'xlsx';

/**
 * Exports data to an Excel file (.xlsx)
 * @param data Array of objects to export
 * @param fileName Name of the file (without extension)
 * @param sheetName Name of the worksheet (optional, defaults to 'Data')
 * @param columnWidths Optional array of column widths [{ wch: number }]
 */
export const exportToExcel = (data: any[], fileName: string, sheetName: string = 'Data', columnWidths?: { wch: number }[]) => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert JSON data to worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Apply column widths if provided
    if (columnWidths) {
        ws['!cols'] = columnWidths;
    }

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `${fileName}.xlsx`);
};

/**
 * Formats a date string for display in Excel
 * @param dateString ISO date string or Date object
 * @returns Formatted date string (DD-MM-YYYY HH:mm)
 */
export const formatDateForExcel = (dateString: string | Date | undefined): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
};
