const Document = require('../models/documentModel');
const Group = require('../models/groupModel');
const User = require('../models/userModel');
const Project = require('../models/projectModel');






//Write a midlle ware for project controller which attaches userId to the req
//this would be helpful for authenticating whether user belongs to this group or not?


const getProjects = async (req, res) => {
    const { groupId } = req.params;
  
    try {
  
      // Find all projects associated with the given groupId
      const projects = await Project.find({ group: groupId }); 
      
      if (!projects || projects.length === 0) {
        return res.status(404).json({ error: 'No projects found for this group' });
      }
  
      res.json(projects); // Send the projects as the response
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Error fetching projects' });
    }
  }

  const loadProject = async (req, res) => {
    try {
      const {projectId } = req.params;
      const project = await Project.findById(projectId);
      // console.log(project)
      if (!project) {
        return res.status(404).send({ message: 'Project not found' });
      }
  
      res.status(200).send(project); // Respond with the document if found
    } catch (error) {
      console.error('Error fetching Project:', error);
      res.status(500).send({ message: 'Server error', error: error.message });
    }
  };

    const saveProject = async (req, res) => {
      const { content, title, projectId } = req.body;
      try {
        let project;
        if (projectId) {
          project = await Project.findByIdAndUpdate(projectId, { content, title }, { new: true });
          // console.log(project)
        } else {
          project = new Project({ content, title });
          await Project.save();
        }
        res.json(project);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }

module.exports = {getProjects, loadProject, saveProject}