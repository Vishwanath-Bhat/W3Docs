import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';

const SidebarNav = ({ userId }) => {
  const navigate = useNavigate();

  // Function to navigate with userId as state
  const handleNavigate = () => {
    navigate('/group', { state: { userId } });
  };

  return (
    <div className="flex flex-col items-center py-4 space-y-6 bg-white shadow min-h-screen w-14">
      {/* Example Icons */}
      <a href="#">
        <img src="/icons/calendar.svg" alt="Calendar" className="w-6 h-6" />
      </a>
      <a href="#">
        <img src="/icons/keep.svg" alt="Keep" className="w-6 h-6" />
      </a>
      <a href="#">
        <img src="/icons/tasks.svg" alt="Tasks" className="w-6 h-6" />
      </a>

      <hr className="w-6 border-gray-300" />

      {/* Group Icon */}
      <button onClick={handleNavigate} className="rounded-full hover:bg-gray-100 p-2">
        <Users className="w-5 h-5 text-blue-600" />
      </button>

      <hr className="w-6 border-gray-300" />

      <button>
        <span className="text-2xl">＋</span>
      </button>
    </div>
  );
};

export default SidebarNav;
