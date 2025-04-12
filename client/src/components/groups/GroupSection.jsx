import React from 'react';
import { useLocation } from 'react-router-dom';
import GroupList from './GroupList';
import GroupDetail from './GroupDetail';
import { fetchGroups, fetchProjects } from './api';

const GroupSection = () => {
  const location = useLocation();
  const { userId } = location.state;
  const [groups, setGroups] = React.useState([]);
  const [selectedGroup, setSelectedGroup] = React.useState(null);
  const [projects, setProjects] = React.useState([]);

  React.useEffect(() => {
    if (userId) {
      fetchGroups(userId).then(data => setGroups(data));
    }
  }, [userId]);

//   React.useEffect(() => {
//     if (selectedGroup) {
//       fetchProjects(selectedGroup._id).then(data => setProjects(data));
//     }
//   }, [selectedGroup]);

  return (
    <div className="min-h-screen bg-gray-50">
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
        <GroupList 
          userId={userId}
          groups={groups}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          setGroups={setGroups}
        />
        
        {selectedGroup ? (
          <GroupDetail 
            group={selectedGroup}
            userId={userId}
            setSelectedGroup={setSelectedGroup}
            
          />
        ) : (
          <div className="flex-1 p-6">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <h2 className="text-xl font-medium text-gray-800 mb-2">Select a group</h2>
              <p className="text-gray-600">Choose a group from the sidebar or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupSection;