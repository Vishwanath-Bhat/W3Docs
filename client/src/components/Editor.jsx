import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../editor.css'
import { toPng } from 'html-to-image';
import Quill from 'quill'
import 'quill/dist/quill.snow.css';
import { TOOLBAR_OPTIONS, addTooltipsToToolbar } from "../utils/quillConfig";

//Note
/* 
-> there is no css for the Document Add that -> (done)
-> implement adding pages of a4 size
-> add delete Document in home page
-> use of quill instead of react quill 
-> create different compoents, thunks , reducers */
const Editor = ({ userId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const documentId = queryParams.get('documentId');
  const [content, setContent] = useState(null);
  const [title, setTitle] = useState('Untitled Document');
  const [quill, setQuill] = useState()


  const wrapperRef = useCallback(wrapper =>{
    if(wrapper == null) return

    wrapper.innerHTML = "" // we do this because the editor gets added up for every render so we clean it
    const editor = document.createElement("div")
    wrapper.append(editor)
    const q = new Quill(editor, { theme: "snow", modules: {
        toolbar: TOOLBAR_OPTIONS
    }
  })
  setQuill(q)
  addTooltipsToToolbar();
  }, [])

//the useEffect in your code will not re-run whenever you type something on the screen. 
//This is because useEffect only depends on the quill variable in the dependency array, and quill does not change when you type. 
//Instead, typing in the editor changes the internal state of the Quill instance but does not trigger a React re-render or a useEffect run.
//To achieve the desired behavior, you need to listen to Quill's text-change event, which fires whenever the content of the editor changes.
  

useEffect(() => {
  if (!quill) return;

  let lastSentText = "";

  const handleChange = (delta, oldDelta, source) => {
    if (source !== "user") return;

    // Check if space or period was pressed
    const lastChar = delta.ops?.find(op => 
      typeof op.insert === "string" && op.insert.length > 0
    )?.insert.slice(-1);

    const shouldTrigger = lastChar === ' ' || lastChar === '.';
    if (!shouldTrigger) return;

    const cursorPosition = quill.getSelection()?.index;
    if (cursorPosition === null || cursorPosition === undefined) return;

    const fullText = quill.getText(0, cursorPosition);
    
    // Extract current phrase (from last punctuation or start)
    const lastBreak = Math.max(
      fullText.lastIndexOf('. '),
      fullText.lastIndexOf('! '),
      fullText.lastIndexOf('? ')
    );
    
    const currentPhrase = fullText.slice(lastBreak + 1).trim();

    if (currentPhrase && currentPhrase !== lastSentText) {
      console.log('Sending to backend:', currentPhrase);
      sendToPredictionModel (currentPhrase);
      lastSentText = currentPhrase;
    }
  };

  quill.on("text-change", handleChange);

  return () => {
    quill.off("text-change", handleChange);
  };
}, [quill]);





  useEffect(() => {
    if (documentId) {
      fetchDocument(documentId);
    } else {
      setTitle('Untitled Document');
      // setContent('');
    }
  }, [documentId, quill]);



  const sendToPredictionModel = async (sentence) => {
    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: sentence })
      });
  
      const data = await response.json();
      console.log("Prediction:", data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  
  const captureThumbnail = async () => {
    const editorElement = document.querySelector('.ql-editor');
    if (!editorElement) return null;

    // Temporarily remove margin/padding
    const prevStyle = editorElement.style.cssText;
    editorElement.style.margin = '0';
    // editorElement.style.padding = '0';
    editorElement.style.backgroundColor = '#fff'; // Ensure white background

    try {
        const dataUrl = await toPng(editorElement);
        return dataUrl;
    } catch (err) {
        console.error('Error generating thumbnail:', err);
        return null;
    } finally {
        // Restore previous styles
        editorElement.style.cssText = prevStyle;
    }
};


  const fetchDocument = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/documents/load/${id}`);//this is document id which can be passed in route and retrive by useLocation
      const data = await response.json();
      // console.log(data)
      setTitle(data.title);
      if (quill && data.content && data.content.ops) {
        quill.setContents(data.content); // Load content into Quill
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    }
  };

  const compressImage = async (base64Str, MAX_WIDTH = 400, QUALITY = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        resolve(canvas.toDataURL('image/jpeg', QUALITY));
      };
      img.onerror = () => resolve(base64Str); // Fallback
    });
  };

  const handleSave = async () => {
    const editorContent = quill.getContents();
    
    try {
      // First capture the thumbnail
      const thumbnail = await captureThumbnail();
      const compressedThumbnail = await compressImage(thumbnail);
      // console.log('compressedThumbnail', compressedThumbnail); 
      
      // Then save everything
      const response = await fetch('http://localhost:3000/api/documents/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title,
          content: editorContent,
          documentId,
          thumbnail: compressedThumbnail, 
        }),
      });
  
      if (!response.ok) {
        throw new Error('Error saving document');
      }
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  return (
    <div className="editor-container p-8 mx-auto max-w-5xl bg-white shadow-lg rounded-md">
      {/* Back Button */}
      <div className="other-elements flex items-center mb-4">
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
          className="other-elements w-full mb-4 p-2 border-b text-xl font-semibold"
        />
        {/* <ReactQuill theme="snow" value={content} onChange={setContent} className="h-full border rounded-lg" /> */}
        <div className="container" ref={wrapperRef}></div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="other-elements px-4 py-2 mt-4 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
        style={{ outline: 'none', border: 'none' }}
      >
        Save
      </button>
    </div>
  );
};

export default Editor;
