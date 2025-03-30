import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../editor.css'

import Quill from 'quill'
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';




const GroupEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const projectId = queryParams.get('projectId');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Untitled Document');
  const [socket, setSocket] = useState()
  const [quill, setQuill] = useState()


  //Socket connection
  useEffect(() => {
    const s = io('http://localhost:3000');
    setSocket(s)
  
    return () => {
      console.log('discon')
      s.disconnect()
    }
  }, [projectId])

  useEffect(() => {
    if(socket == null || quill == null) return

    socket.once('load-document', document =>{
      // console.log(document)
      quill.setContents(document.data)
      quill.enable()
    })
    socket.emit('get-document', projectId)
  
  }, [socket, quill, projectId])
  
  
  useEffect(() => {
    if(socket == null || quill == null) return
    const handler = (delta, oldDelta, source) =>{
      
      if(source !== 'user') return
      socket.emit('send-changes', delta)
    }
    quill.on('text-change', handler)

    return () => {
      quill.off('text-change', handler)
    }
  }, [socket, quill])


  useEffect(() => {
    if(socket == null || quill == null) return

    const handler = (delta) =>{
      quill.updateContents(delta)
    }
    socket.on('receive-changes', handler)

    return () => {
      socket.off('receive-changes', handler)
    }
  }, [socket, quill])

  
  const wrapperRef = useCallback(wrapper =>{
    if(wrapper == null) return

    wrapper.innerHTML = "" // we do this because the editor gets added up for every render so we clean it
    const editor = document.createElement("div")
    wrapper.append(editor)
    const q = new Quill(editor, { theme: "snow"})
    q.disable()
    q.setText('Loading...')
    setQuill(q);
  }, [])


  
  //Fetch the selected project
  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
  }, [projectId]);

  //Fetch selected Project (projectId)
  const fetchProject = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/projects/load/${projectId}`);
      const data = await response.json();
      setTitle(data.title);
      setContent(data.content);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleSave = async () => {
    // try {
    //   const response = await fetch('http://localhost:3000/api/projects/save', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       content,
    //       title,
    //       projectId,
    //     }),
    //   });
    //   if (!response.ok) {
    //     throw new Error('Error saving document');
    //   }
    // } catch (error) {
    //   console.error('Error saving document:', error);
    // }
    // console.log(quill.getContents())

    socket.emit('save-document', quill.getContents())
  };

  return (
    <div className="p-8 mx-auto max-w-5xl bg-white shadow-lg rounded-md">
      {/* Back Button */}
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-blue-500 hover:text-blue-700 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>
      </div>

      {/* Editor Container */}
      <div className="editor-container">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document Title"
          className="w-full mb-4 p-2 border-b text-xl font-semibold"
        />
        {/* <ReactQuill theme="snow" value={content} onChange={setContent} className="h-full border rounded-lg" /> */}
        <div id="container" ref={wrapperRef}></div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="px-4 py-2 mt-4 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
        style={{ outline: 'none', border: 'none' }}
      >
        Save
      </button>
    </div>
  );
};

export default GroupEditor;
