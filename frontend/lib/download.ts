/**
 * Reliable file download utility for Next.js client components.
 * Uses data URI encoding instead of Blob URLs because Blob URL downloads
 * often produce UUID filenames in Chromium browsers on localhost.
 */
export function downloadCsv(filename: string, csvContent: string) {
  const encodedData = encodeURIComponent(csvContent)
  const dataUri = 'data:text/csv;charset=utf-8,' + encodedData

  const a = document.createElement('a')
  a.setAttribute('href', dataUri)
  a.setAttribute('download', filename)
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

/**
 * Convert an array of objects to a CSV string.
 * Properly escapes values containing commas, quotes, or newlines.
 */
export function toCsv(headers: string[], rows: string[][]): string {
  const escape = (val: string) => {
    const s = String(val ?? '')
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"'
    }
    return s
  }

  const lines = [
    headers.join(','),
    ...rows.map(row => row.map(escape).join(','))
  ]

  // BOM for Excel compatibility + CRLF line endings
  return '\uFEFF' + lines.join('\r\n')
}
