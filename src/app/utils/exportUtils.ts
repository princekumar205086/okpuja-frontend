// Export utility for booking data
export const exportToCSV = (data: any[], filename: string) => {
  if (!data.length) {
    throw new Error('No data to export');
  }

  // Get all unique keys from the data
  const allKeys = Array.from(
    new Set(data.flatMap(item => Object.keys(item)))
  );

  // Create CSV header
  const csvHeader = allKeys.join(',');

  // Create CSV rows
  const csvRows = data.map(item => 
    allKeys.map(key => {
      let value = item[key];
      
      // Handle nested objects
      if (typeof value === 'object' && value !== null) {
        if (value.title) value = value.title;
        else if (value.name) value = value.name;
        else value = JSON.stringify(value);
      }
      
      // Escape commas and quotes
      if (typeof value === 'string') {
        value = value.replace(/"/g, '""');
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = `"${value}"`;
        }
      }
      
      return value || '';
    }).join(',')
  );

  // Combine header and rows
  const csvContent = [csvHeader, ...csvRows].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportToJSON = (data: any[], filename: string) => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportToExcel = async (data: any[], filename: string) => {
  // This would require a library like xlsx
  // For now, we'll fall back to CSV
  exportToCSV(data, filename.replace('.xlsx', '.csv'));
};
