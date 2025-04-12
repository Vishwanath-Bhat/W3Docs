export const fetchGroups = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/groups?userId=${userId}`);
      const data = await response.json();
      return response.ok ? data : [];
    } catch (error) {
      console.error('Error fetching groups:', error);
      return [];
    }
  };
  
  export const fetchProjects = async (groupId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/projects/list/${groupId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  };
  
  export const createGroup = async (name, userId) => {
    const response = await fetch(`http://localhost:3000/api/groups/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, userId }),
    });
    return response.ok ? await response.json() : null;
  };
  
  export const addMember = async (groupId, username) => {
    await fetch(`http://localhost:3000/api/groups/${groupId}/add-member`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
  };
  
  export const createProject = async (groupId, title, userId) => {
    const response = await fetch(`http://localhost:3000/api/projects/${groupId}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, userId }),
    });
    return await response.json();
  };