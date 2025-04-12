import React from 'react';
import MemberStatus from './MemberStatus';
import ProjectList from './ProjectList';
import { addMember, createProject } from './api';

const GroupDetail = ({ group, userId, setSelectedGroup }) => {
  const [memberName, setMemberName] = React.useState('');
  const [newProjectTitle, setNewProjectTitle] = React.useState('');
  const [membersStatus, setMembersStatus] = React.useState({});

  // Simulate member status (in a real app, this would come from WebSocket)
  React.useEffect(() => {
    const statuses = {};
    group.membersName?.forEach(member => {
      statuses[member] = ['online', 'offline', 'editing'][Math.floor(Math.random() * 3)];
    });
    setMembersStatus(statuses);
  }, [group]);

  const handleAddMember = async () => {
    if (!memberName) return;
    await addMember(group._id, memberName);
    setMemberName('');
  };

  const handleAddProject = async () => {
    if (!newProjectTitle) return;
    await createProject(group._id, newProjectTitle, userId);
    setNewProjectTitle('');
  };

  return (
    <div className="flex-1 p-6">
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
          <h2 className="text-2xl font-medium text-gray-800">{group.name}</h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Members</h3>
          <div className="mb-4">
            <ul className="space-y-2">
              {group.membersName?.map((member) => (
                <li key={member} className="flex items-center">
                  <MemberStatus status={membersStatus[member]} />
                  <span className="text-gray-700">{member}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    ({membersStatus[member]})
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex">
            <input
              type="text"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="Add new member by email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md"
            />
            <button
              onClick={handleAddMember}
              className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md"
            />
            <button
              onClick={handleAddProject}
              className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
            >
              Create
            </button>
          </div>
        </div>

        <ProjectList group={group} />
      </div>
    </div>
  );
};

export default GroupDetail;