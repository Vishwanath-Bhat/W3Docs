export const fetchDocuments = async (userId, setDocuments) => {
    try {
      const response = await fetch(`http://localhost:3000/api/documents/list?userId=${userId}`);
      if (!response.ok) throw new Error('Error fetching documents');
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };
  
  export const saveDocument = async ({ userId, content, title, documentId }, callback) => {
    try {
      const response = await fetch('http://localhost:3000/api/documents/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, content, title, documentId }),
      });
      if (!response.ok) throw new Error('Error saving document');
      const data = await response.json();
      callback(data);
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };
  