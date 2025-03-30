const express = require('express')

//controller functions
const {addTemplate, getFiveTemplate, getAllTemplates} = require('../controllers/templateController')
const router = express.Router()



//add template
router.post('/add', addTemplate)


//Get FIve random templates
router.get('/getFive', getFiveTemplate)


//Get All templates
router.get('/getAll', getAllTemplates)




module.exports = router