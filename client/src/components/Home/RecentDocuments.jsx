import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { MoreVert, Delete, Share, Download, ContentCopy } from '@mui/icons-material';

const RecentDocuments = ({ documents, onDocumentOpen, onDeleteDocument }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  const formatOpenedTime = (dateString) => {
    try {
      return format(new Date(dateString), 'HH:mm');
    } catch {
      return '';
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && menuRefs.current[openMenuId] && 
          !menuRefs.current[openMenuId].contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const toggleMenu = (docId) => {
    setOpenMenuId(openMenuId === docId ? null : docId);
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium text-gray-700 mb-4">Recent documents</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {documents.map((doc) => (
          <div
            key={doc._id}
            className="relative border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            {/* Document Thumbnail - Fills container */}
            <div 
              className="h-40 bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden"
              onClick={() => onDocumentOpen(doc._id)}
            >
              {doc.thumbnail ? (
                <img 
                  src={doc.thumbnail} 
                  alt="Document preview" 
                  className="h-full w-full object-contain"
                //   style={{ objectFit: 'contain' }}
                />
              ) : (
                <div className="text-gray-400 text-center p-4">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm">No preview available</span>
                </div>
              )}
            </div>

            {/* Document Info */}
            <div className="p-3">
              <div className="flex justify-between items-start">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => onDocumentOpen(doc._id)}
                >
                  <h3 className="font-medium text-gray-900 truncate">{doc.title || 'Untitled document'}</h3>
                  <p className="text-xs text-gray-500 mt-1">Opened {formatOpenedTime(doc.updatedAt)}</p>
                </div>
                
                {/* Three-dot Menu - Click to open */}
                <div className="relative" ref={el => menuRefs.current[doc._id] = el}>
                  <button 
                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(doc._id);
                    }}
                  >
                    <MoreVert fontSize="small" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {openMenuId === doc._id && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <button 
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add share functionality here
                          }}
                        >
                          <Share fontSize="small" className="mr-2" />
                          Share
                        </button>
                        <button 
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add download functionality here
                          }}
                        >
                          <Download fontSize="small" className="mr-2" />
                          Download
                        </button>
                        <button 
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add copy functionality here
                          }}
                        >
                          <ContentCopy fontSize="small" className="mr-2" />
                          Make a copy
                        </button>
                        <button 
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteDocument(doc._id);
                            setOpenMenuId(null);
                          }}
                        >
                          <Delete fontSize="small" className="mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentDocuments;