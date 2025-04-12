import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DocumentTemplates from './DocumentTemplates';
import RecentDocuments from './RecentDocuments';
import SidebarNav from './SidebarNav';

const Home = ({ userId }) => {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchDocuments();
    }
  }, [userId]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/documents/list?userId=${userId}`);
      const data = await response.json();
    //   console.log('data', data)
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const createNewDocument = async (template) => {
    // console.log('template', template)
    try {
        if(template){
      const response = await fetch('http://localhost:3000/api/documents/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: template.name,
          content: template.content,
          thumbnail: template.thumbnail,
        }),
      });
      const data = await response.json();
      navigate(`/myEditor?documentId=${data._id}`);
        }else{
      navigate(`/myEditor`);
        }
    } catch (error) {
      console.log('Error creating Document', error);
    }
  };

  const openDocument = (documentId) => {
    navigate(`/myEditor?documentId=${documentId}`);
  };

  const onDeleteDocument = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/documents/delete/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete document");
      }
  
      // Update state to remove the deleted document from the UI
      setDocuments((prevDocs) => prevDocs.filter((doc) => doc._id !== id));
  
      console.log("Document deleted successfully!");
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };
  
  

  return (
    <div className="flex min-h-screen relative">
      {/* Main Content */}
      <div className="flex-1 p-8 pr-24">
        <DocumentTemplates onTemplateSelect={createNewDocument} />
        <div className="border-t border-gray-200 my-6"></div>
        <RecentDocuments
          documents={documents}
          onDocumentOpen={openDocument}
          onDeleteDocument={onDeleteDocument}
        />
      </div>

      


      {/* Sidebar on Right */}
      <div className="sticky top-0 right-0 h-screen">
  <SidebarNav userId={userId} />
</div>
    </div>
  );
};

export default Home;