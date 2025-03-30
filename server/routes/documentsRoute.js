// routes/documents.js
const express = require('express');
const router = express.Router();
const Document = require('../models/documentModel');
const User = require('../models/userModel');
const requireAuth = require('../middleware/requireAuth')

const {getDocuments, saveDocument, loadDocument, deleteDocument} = require('../controllers/documentController')

//Middleware for auth
// router.use(requireAuth)


// Save a new document or update an existing one
router.post('/save',saveDocument);

// Get documents for the user
router.get('/list', getDocuments);

//Load the documents content
router.get('/load/:id',loadDocument);

//Create a Document
router.post('/create', async (req, res) =>{
    const { userId , title, content , thumbnail} = req.body
    document = new Document({ userId , title, content, thumbnail});
    await document.save();
    res.json(document);
})

//This is to get the mongoDB id of the user fron username
//This sshould be in userRoutes
//time being iam keeping it here
router.get('/userId', async (req, res) => {
    const { username } = req.query; // Assume you're passing the name as a query parameter
    try {
        const user = await User.findOne({username}).select('_id');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/delete/:id', deleteDocument);


module.exports = router;
