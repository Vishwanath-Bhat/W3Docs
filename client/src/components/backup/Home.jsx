// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import GroupSection from './GroupSection';


// //userId is the mongo db ID of the user which i get when user logs in (in app.jsx also use thunk for it)
// const Home = ({ userId }) => {
//   const [documents, setDocuments] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (userId) {
//       fetchDocuments();
//     }
//   }, [userId]);

//   const fetchDocuments = async () => {
//     try {
//       const response = await fetch(`http://localhost:3000/api/documents/list?userId=${userId}`);
//       const data = await response.json();
//       setDocuments(data);
//     } catch (error) {
//       console.error('Error fetching documents:', error);
//     }
//   };

//   const openBlankDocument = async () => {
//     let documentId 
//     try {
//       const response = await fetch('http://localhost:3000/api/documents/create', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           userId,
//         }),
//       });
//       const data = await response.json()
//       documentId = data._id
//     } catch (error) {
//       console.log('Error creating Document', error);
//     }
//     navigate(`/myEditor?documentId=${documentId}`); // Navigate to editor for a blank document
//   };

//   const openDocument = (documentId) => {
//     navigate(`/myEditor?documentId=${documentId}`);
//   };
  

//   return (
//     <div className="flex">
//       <div className="w-2/3 p-4">
//         <button
//           onClick={openBlankDocument}
//           className="px-4 py-2 mb-4 bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
//         >
//           Open Blank Document
//         </button>
//         <h3 className="text-2xl font-semibold mb-4">Saved Documents</h3>
//         <ul>
//           {documents.map((doc) => (
//             <li
//               key={doc._id}
//               onClick={() => openDocument(doc._id)}
//               className="cursor-pointer p-2 mb-2 border rounded hover:bg-gray-100 transition"
//             >
//               {doc.title}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="w-1/3 p-4 bg-gray-100">
//         <GroupSection userId={userId} />
//       </div>
//     </div>
//   );
// };

// export default Home;
