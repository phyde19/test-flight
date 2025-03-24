'use client'

interface ExportImportPanelProps {
  onExport: () => void;
  onImport: () => void;
}

export default function ExportImportPanel({
  onExport,
  onImport
}: ExportImportPanelProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Export/Import</h2>
      
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onExport}
          className="p-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded transition-colors text-sm"
          title="Copy conversation state to clipboard"
        >
          Export to Clipboard
        </button>
        
        <button
          onClick={onImport}
          className="p-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded transition-colors text-sm"
          title="Import conversation state from clipboard"
        >
          Import from Clipboard
        </button>
      </div>
    </div>
  );
}