'use client'

import { useState, useRef, useEffect } from 'react'

export default function APIControls() {
  const [isOpen, setIsOpen] = useState(false)
  const [jsonString, setJsonString] = useState('{\n  "key": "value"\n}')
  const [isEnabled, setIsEnabled] = useState(false)
  const [paramName, setParamName] = useState('params')
  const panelRef = useRef<HTMLDivElement>(null)

  // Toggle panel open/closed
  const togglePanel = () => {
    setIsOpen(!isOpen)
  }

  // Handle changes to the JSON string
  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonString(e.target.value)
  }

  // Handle click outside to close panel (except when clicking the toggle button)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Don't close if clicking the toggle button
      if (event.target instanceof Element && event.target.closest('#jsonParamsButton')) {
        return
      }

      // Close if clicking outside the panel
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Add event listener for the JSON button in toolbar
  useEffect(() => {
    const jsonButton = document.getElementById('jsonParamsButton')
    if (jsonButton) {
      const handleClick = () => togglePanel()
      jsonButton.addEventListener('click', handleClick)
      return () => {
        jsonButton.removeEventListener('click', handleClick)
      }
    }
  }, [])

  return (
    <div className="relative" ref={panelRef}>
      {/* Slide out panel */}
      <div 
        className={`fixed right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform ease-in-out duration-300 z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">API Parameters</h3>
            <button 
              onClick={togglePanel}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>
          
          {/* Panel content */}
          <div className="space-y-4 flex-1 overflow-y-auto">
            {/* Enable/disable toggle */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only"
                    checked={isEnabled}
                    onChange={() => setIsEnabled(!isEnabled)}
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${isEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${isEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {isEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>
            
            {/* Parameter name input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parameter Name
              </label>
              <input
                type="text"
                value={paramName}
                onChange={(e) => setParamName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="params"
              />
            </div>
            
            {/* JSON editor */}
            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                JSON Value
              </label>
              <textarea
                value={jsonString}
                onChange={handleJsonChange}
                className="flex-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono min-h-[200px] border-gray-300"
                placeholder="Enter JSON here"
              />
            </div>
          </div>
          
          {/* Panel footer */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              {isEnabled 
                ? `Will send JSON as "${paramName}" parameter in API request` 
                : 'JSON parameters are currently disabled (UI only)'}
            </div>
            <div className="mt-2 text-xs text-gray-400 italic">
              Note: This panel is currently UI-only and not connected to the API.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}