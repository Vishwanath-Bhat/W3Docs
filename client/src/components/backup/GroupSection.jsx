import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const GroupSection = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [memberName, setMemberName] = useState('');
  const [projects, setProjects] = useState([]);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newGroupName, setNewGroupName] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state;

  useEffect(() => {
    if (userId) fetchGroups();
    if (selectedGroup) fetchProjects();
  }, [userId, selectedGroup]);

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

  const fetchProjects = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/projects/list/${selectedGroup._id}`);
      const data = await response.json();
      console.log('data', data)
      setProjects(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

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
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

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
      fetchGroups();
      setMemberName('');
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

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
      fetchGroups();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center">
        <div className="flex items-center">
          <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          <h1 className="ml-2 text-xl font-medium text-gray-800">Group Collaboration</h1>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="min-h-screen w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
          <div className="mb-6">
            <button 
              onClick={() => setSelectedGroup(null)}
              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
            >
              <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              All Groups
            </button>
          </div>
          
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">MY GROUPS</h3>
            <ul className="space-y-1">
              {groups.map((group) => (
                <li key={group._id}>
                  <button
                    onClick={() => setSelectedGroup(group)}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${selectedGroup?._id === group._id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    {group.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {selectedGroup ? (
            // Group Details View
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center mb-6">
                <button 
                  onClick={() => setSelectedGroup(null)} 
                  className="mr-4 p-2 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h2 className="text-2xl font-medium text-gray-800">{selectedGroup.name}</h2>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Add Member</h3>
                <div className="flex">
                  <input
                    type="text"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    placeholder="Enter user's email"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleAddMember}
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Create New Project</h3>
                <div className="flex">
                  <input
                    type="text"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    placeholder="Project title"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleAddProject}
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Create
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800">Projects</h3>
                </div>
                <ul className="divide-y divide-gray-200">
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <li key={project._id}>
                        <button
                          onClick={() => navigate(`/groupEditor?projectId=${project._id}`)}
                          className="w-full px-6 py-4 text-left hover:bg-gray-50 focus:outline-none"
                        >
                          <div className="flex items-center">
                            <svg className="w-5 h-5 mr-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-800">{project.title}</span>
                          </div>
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="px-6 py-4 text-center text-gray-500">
                      No projects yet. Create your first project above.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            // Group List View
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-medium text-gray-800">My Groups</h2>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Create New Group</h3>
                <div className="flex">
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Group name"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleAddGroup}
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Create
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800">All Groups</h3>
                </div>
                <ul className="divide-y divide-gray-200">
                  {groups.length > 0 ? (
                    groups.map((group) => (
                      <li key={group._id}>
                        <button
                          onClick={() => setSelectedGroup(group)}
                          className="w-full px-6 py-4 text-left hover:bg-gray-50 focus:outline-none"
                        >
                          <div className="flex items-center">
                            <svg className="w-5 h-5 mr-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-800">{group.name}</span>
                          </div>
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="px-6 py-4 text-center text-gray-500">
                      No groups yet. Create your first group above.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GroupSection;