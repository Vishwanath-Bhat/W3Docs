const express = require('express');
const router = express.Router();
const Project = require('../models/projectModel');
const Group = require('../models/groupModel');
const { getProjects, loadProject, saveProject} = require('../controllers/projectController')




// Fetch projects for a specific group
router.get('/list/:groupId', getProjects);

//Load a project given ProjectId
router.get('/load/:projectId', loadProject);

//Save a project
router.post('/save', saveProject)



// Add a new project to a group status: (done)
router.post('/:groupId/create', async (req, res) => {
  const { groupId } = req.params;
  const { title, content, userId } = req.body;
  
  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const project = new Project({
      title,
      content,
      group: groupId,
    });

    await project.save();
    group.projects.push(project._id);
    await group.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Error creating project' });
  }
});



module.exports = router;