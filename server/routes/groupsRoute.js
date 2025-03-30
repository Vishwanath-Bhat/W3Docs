const express = require('express');
const router = express.Router();
const Group = require('../models/groupModel');
const Project = require('../models/projectModel');
const User = require('../models/userModel');
const {getGroups, createGroup, addMember} = require('../controllers/groupsController')

// Fetch all groups the user belongs to
router.get('/', getGroups);


// Create a new group and add the creator as one of the member
//I made it such that the creater automatically gets added to group
router.post('/create', createGroup);


// Add a member to an existing group
router.post('/:groupId/add-member', addMember);
module.exports = router;