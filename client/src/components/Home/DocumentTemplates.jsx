import { React, useState, useEffect } from 'react';

const DocumentTemplates = ({ onTemplateSelect }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFullGallery, setShowFullGallery] = useState(false);

  useEffect(() => {
    fetchAllTemplates();
  }, []);

  const fetchAllTemplates = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/template/getAll");
      const data = await response.json();
      // console.log("Fetched Templates:", data);
      setTemplates(data);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group templates by category for the full gallery view
  const templatesByCategory = templates.reduce((acc, template) => {
    if (!template.category) return acc;
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {});

  // Get first four non-recent templates for initial view
  const initialTemplates = templates
    .filter(template => !template.isRecent)
    .slice(0, 5);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          {showFullGallery && (
            <button 
              className="text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium mr-4 flex items-center"
              onClick={() => setShowFullGallery(false)}
            >
              <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              
            </button>
          )}
          <h1 className="text-2xl font-semibold">
            {showFullGallery ? 'Template gallery' : 'Start a new document'}
          </h1>
        </div>
        {!showFullGallery && (
          <button 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            onClick={() => setShowFullGallery(true)}
          >
            Template gallery
          </button>
        )}
      </div>

      {showFullGallery ? (
        // Full template gallery view (no recent documents)
        <div className="animate-fadeIn">
          {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
            <div key={category} className="mb-10">
              <h2 className="text-xl font-medium mb-4">{category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {categoryTemplates.filter(t => !t.isRecent).map((template, index) => (
                  <TemplateCard 
                    key={index} 
                    template={template} 
                    onClick={() => onTemplateSelect(template)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Initial view with blank document and first few templates
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* Blank document (special case) */}
            <div 
              className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onTemplateSelect()}
            >
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="block mt-2 text-gray-500">Blank</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900">Blank document</h3>
                <p className="text-sm text-gray-500 mt-1">Start from scratch</p>
              </div>
            </div>

            {/* First four non-recent templates */}
            {initialTemplates.map((template, index) => (
              <TemplateCard 
                key={index} 
                template={template} 
                onClick={() => onTemplateSelect(template)}
              />
            ))}
          </div>

          {/* Recent documents section (only shown in initial view) */}
          {templates.some(t => t.isRecent) && (
            <div className="mt-12">
              <h2 className="text-xl font-medium mb-4">Recent documents</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {templates.filter(t => t.isRecent).map((template, index) => (
                  <TemplateCard 
                    key={`recent-${index}`} 
                    template={template} 
                    onClick={() => onTemplateSelect(template)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Reusable Template Card component
const TemplateCard = ({ template, onClick }) => {
  return (
    <div 
      className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        {template.thumbnail ? (
          <img 
            src={template.thumbnail} 
            alt={template.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="block mt-2 text-gray-500">{template.category}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 truncate">{template.name}</h3>
        <p className="text-sm text-gray-500 mt-1 truncate">{template.description}</p>
      </div>
    </div>
  );
};

export default DocumentTemplates;