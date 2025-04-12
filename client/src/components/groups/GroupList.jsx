import React from 'react';
import { fetchGroups } from './api';

const GroupList = ({ userId, groups, selectedGroup, setSelectedGroup, setGroups }) => {
  const [newGroupName, setNewGroupName] = React.useState('');

  const handleAddGroup = async () => {
    if (!newGroupName) return;
    const newGroup = await createGroup(newGroupName, userId);
    if (newGroup) {
      setGroups(await fetchGroups(userId));
      setNewGroupName('');
    }
  };

  return (
    <div className="min-h-screen w-64 bg-white border-r border-gray-200 p-4">
      <div className="mb-6">
        <button 
          onClick={() => setSelectedGroup(null)}
          className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
        >
          <svg className="w-5 h-5 mr-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
          </svg>
          All Groups
        </button>
      </div>
      
      <div className="mb-4">
        <div className="flex">
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="New group name"
            className="flex-1 px-3 py-2 text-sm border rounded-l-md"
          />
          <button
            onClick={handleAddGroup}
            className="px-3 py-2 bg-blue-500 text-white text-sm rounded-r-md"
          >
            Add
          </button>
        </div>
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
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                </svg>
                <div className="flex-1 text-left">
                  <div>{group.name}</div>
                  <div className="text-xs text-gray-500">{group.membersName?.join(', ')}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroupList;