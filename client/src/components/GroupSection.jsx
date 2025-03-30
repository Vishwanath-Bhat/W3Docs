import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GroupSection = ({ userId }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [memberName, setMemberName] = useState('');
  const [projects, setprojects] = useState([])
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newGroupName, setNewGroupName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (userId) fetchGroups();
    if (selectedGroup) fetchProjects();
  }, [userId, selectedGroup]);

  // Fetch all groups the user belongs to
  const fetchGroups = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/groups?userId=${userId}`);
      const data = await response.json();
      if (response.ok) setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setGroups([]);
    }
  };

  //Fetch all projects
  const fetchProjects = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/projects/list/${selectedGroup._id}`);
      const data = await response.json();
      console.log(data)
      setprojects(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  // Handle adding a new group
  const handleAddGroup = async () => {
    if (!newGroupName) return;
    try {
      const response = await fetch(`http://localhost:3000/api/groups/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newGroupName, userId }),
      });
      if (response.ok) {
        fetchGroups();
        setNewGroupName('');
      } else {
        console.error('Error creating group:', await response.text());
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  // Handle adding a new member to the group
  const handleAddMember = async () => {
    if (!selectedGroup || !memberName) return;
    try {
      await fetch(`http://localhost:3000/api/groups/${selectedGroup._id}/add-member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: memberName }),
      });
      fetchGroups(); // Refresh groups list
      setMemberName('');
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };



  // Handle creating a new project in the selected group
  const handleAddProject = async () => {
    if (!selectedGroup || !newProjectTitle) return;
    try {
      const response = await fetch(`http://localhost:3000/api/projects/${selectedGroup._id}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newProjectTitle, userId }),
      });
      await response.json();
      setNewProjectTitle('');
      fetchGroups(); // Refresh groups to show the new project
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className="p-4 bg-gray-100">
      {selectedGroup ? (
        // Group Details View
        <div>
          <button onClick={() => setSelectedGroup(null)} className="mb-4 px-4 py-2 bg-gray-400 text-white rounded">
            Back to Groups
          </button>
          <h3 className="text-lg font-semibold mb-2">Selected Group: {selectedGroup.name}</h3>

          <div className="mb-4">
            <input
              type="text"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="User to Add"
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleAddMember}
              className="mt-2 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Add Member
            </button>
          </div>

          <div className="mb-4">
            <input
              type="text"
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              placeholder="New Project Title"
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleAddProject}
              className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Add Project
            </button>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Projects:</h4>
            <ul className="space-y-2">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <li
                    key={project._id}
                    onClick={() => navigate(`/groupEditor?projectId=${project._id}`)} // Navigate to editor with project ID
                    className="p-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
                  >
                    {project.title} {/* Render project title */}
                  </li>
                ))
              ) : (
                <p>No projects available.</p> // Display this if no projects are found
              )}
            </ul>
          </div>
        </div>
      ) : (
        // Group List View
        <div>
          <h2 className="text-xl font-semibold mb-4">Groups</h2>
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Group Name"
            className="w-full p-2 border rounded-md mb-4"
          />
          <button onClick={handleAddGroup} className="w-full px-4 py-2 bg-green-500 text-white rounded">
            Add Group
          </button>
          <ul className="space-y-2 mt-4">
            {groups.map((group) => (
              <li
                key={group._id}
                onClick={() => setSelectedGroup(group)}
                className={`cursor-pointer p-2 rounded ${selectedGroup && selectedGroup._id === group._id ? 'bg-blue-200' : 'bg-white'}`}
              >
                {group.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GroupSection;
