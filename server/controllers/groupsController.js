const Group = require('../models/groupModel');
const User = require('../models/userModel');

const getGroups = async (req, res) => {
    const { userId } = req.query;
    try {
      const groups = await Group.find({ membersId: userId }).lean();
      res.json(groups);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching groups' });
    }
  }


  const createGroup = async (req, res) => {
    const { userId, name } = req.body;
    try {
        const user = await User.findById( userId );
      const group = new Group({ name: name, membersId: [userId], membersName:[user.username] });
      await group.save();
  
      res.json(group);
    } catch (error) {
      res.status(500).json({ error: 'Error creating group' });
    }
  }

  const addMember = async (req, res) => {
    const { groupId } = req.params;
    const { username } = req.body;
  
    try {
      // Verify if the user exists
      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      // Find the group by ID
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ error: 'Group not found' });
  
      // Check if the username is already in members
      if (!group.membersName.includes(username)) {
        group.membersName.push(username); 
        group.membersId.push(user._id); 
        await group.save(); 
      }
  
      res.json(group);
    } catch (error) {
      console.error(error); 
      res.status(500).json({ error: 'Error adding member to group' });
    }
  };
  

module.exports = {getGroups, createGroup, addMember}