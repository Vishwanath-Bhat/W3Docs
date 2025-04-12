import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toPng } from 'html-to-image';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import '../editor.css';
import { TOOLBAR_OPTIONS, addTooltipsToToolbar } from "../utils/quillConfig";


const Editor = ({ userId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const documentId = queryParams.get('documentId');
  const [content, setContent] = useState(null);
  const [title, setTitle] = useState('Untitled Document');
  const [quill, setQuill] = useState();
  const [suggestion, setSuggestion] = useState("");
  const suggestionRef = useRef(null);
  const wrapperRef = useRef(null);

  const wrapperCallback = useCallback(wrapper => {
    if(wrapper == null) return;

    wrapper.innerHTML = ""; // we do this because the editor gets added up for every render so we clean it
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, { 
      theme: "snow", 
      modules: {
        toolbar: TOOLBAR_OPTIONS
      }
    });
    setQuill(q);
    addTooltipsToToolbar();
  }, []);

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
        sendToPredictionModel(currentPhrase);
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

  useEffect(() => {
    if (!quill) return;

    const handleKeyDown = (event) => {
      if (event.key === "Tab" && suggestion) {
        event.preventDefault(); // Prevent default tab behavior
        insertSuggestion();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [quill, suggestion]);

  const insertSuggestion = () => {
    if (!quill || !suggestion) return;
    
    const range = quill.getSelection();
    if (range) {
      quill.insertText(range.index, suggestion + " ");
      quill.setSelection(range.index + suggestion.length);
    }
    setSuggestion("");
    positionSuggestionBox(false);
  };

  const positionSuggestionBox = (show, text = "") => {
    if (!quill || !suggestionRef.current) return;
    
    if (!show) {
      suggestionRef.current.style.display = "none";
      return;
    }

    const range = quill.getSelection();
    if (!range) return;

    const bounds = quill.getBounds(range.index);
    const editor = quill.root;
    const editorRect = editor.getBoundingClientRect();
    const scrollTop = editor.scrollTop;

    suggestionRef.current.style.display = "block";
    suggestionRef.current.style.position = "absolute";
    suggestionRef.current.style.left = `${bounds.left + editorRect.left}px`;
    suggestionRef.current.style.top = `${bounds.top + editorRect.top + scrollTop}px`;
    suggestionRef.current.textContent = text;
  };

  useEffect(() => {
    if (suggestion && quill) {
      positionSuggestionBox(true, suggestion);
    } else {
      positionSuggestionBox(false);
    }
  }, [suggestion, quill]);

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
      if (data.next_word) {
        setSuggestion(data.next_word); // Store prediction in state
      } else {
        setSuggestion(""); // Clear if no prediction
      }
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
      const thumbnail = await captureThumbnail();
      const compressedThumbnail = await compressImage(thumbnail);
      
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
    <div className="editor-container p-8 mx-auto max-w-5xl bg-white shadow-lg rounded-md relative">
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
        <div className="container" ref={wrapperCallback}></div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="other-elements px-4 py-2 mt-4 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
        style={{ outline: 'none', border: 'none' }}
      >
        Save
      </button>

      {/* Suggestion Box */}
      <div
        ref={suggestionRef}
        className="suggestion-box absolute bg-gray-200 text-gray-700 px-2 py-1 rounded shadow-md z-10"
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default Editor;