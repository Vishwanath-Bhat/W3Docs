import React from 'react';

const MemberStatus = ({ status }) => {
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    editing: 'bg-blue-500'
  };

  return (
    <span className={`inline-block w-2 h-2 rounded-full ${statusColors[status] || 'bg-gray-400'} mr-2`} />
  );
};

export default MemberStatus;