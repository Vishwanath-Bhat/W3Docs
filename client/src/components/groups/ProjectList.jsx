import {React , useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProjects } from './api';


const ProjectList = ({ group }) => {
  const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
  useEffect(() => {
      if (group._id) {
        fetchProjects(group._id).then(data => setProjects(data));
      }
    }, [group._id]);

    console.log('projects', projects)
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">Projects</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {projects?.length > 0 ? (
          projects.map((project) => (
            <li key={project._id}>
              <button
                onClick={() => navigate(`/groupEditor?projectId=${project._id}`)}
                className="w-full px-6 py-4 text-left hover:bg-gray-50"
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
  );
};

export default ProjectList;