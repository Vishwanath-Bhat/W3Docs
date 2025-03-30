const Document = require('../models/documentModel');

const getDocuments =  async (req, res) => {
    const { userId } = req.query;
    try {
      const documents = await Document.find({ userId })
      .sort({ updatedAt: -1 }) // newest first
      .limit(10);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  const saveDocument =  async (req, res) => {
    const { userId, content, title, documentId, thumbnail} = req.body;
    // console.log('thumbnail', thumbnail)
    try {
      let document;
      if (documentId) {
        document = await Document.findByIdAndUpdate(documentId, { content, title, thumbnail }, { new: true });
      } else {
        document = new Document({ userId, content, title, thumbnail });
        await document.save();
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  const loadDocument = async (req, res) => {
    try {
      const documentId = req.params.id;
      const document = await Document.findById(documentId);
      if (!document) {
        return res.status(404).send({ message: 'Document not found' });
      }
  
      res.status(200).send(document); // Respond with the document if found
    } catch (error) {
      console.error('Error fetching document:', error);
      res.status(500).send({ message: 'Server error', error: error.message });
    }
  };

  const deleteDocument = async (req, res) => {
    try {
      const docId = req.params.id;
      const doc = await Document.findByIdAndDelete(docId);
  
      if (!doc) {
        return res.status(404).json({ message: "Document not found" });
      }
  
      res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ message: "Server error while deleting document" });
    }
  };
  
  

  module.exports = {getDocuments, saveDocument, loadDocument, deleteDocument}