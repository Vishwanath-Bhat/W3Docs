const Template = require('../models/templateModel')

const addTemplate = async (req, res) => {
    try {
        const template = new Template(req.body);
        await template.save();
        res.status(201).send(template);
      } catch (error) {
        res.status(400).send(error);
      }
}

const getFiveTemplate = async (req, res) => {
    
}


const getAllTemplates = async (req, res) => {
    try {
        const templates = await Template.find();
        res.send(templates);
      } catch (error) {
        res.status(500).send();
      }
}

module.exports = {getAllTemplates, getFiveTemplate, addTemplate}