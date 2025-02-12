import { useState, useEffect } from 'react';
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios';
import { Code2, Copy, Wand2 } from 'lucide-react';
import './App.css';

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`);
  const [review, setReview] = useState('');
  const [displayedReview, setDisplayedReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    setLoading(true);
    setDisplayedReview('');

    try {
      const response = await axios.post('http://localhost:3000/api/get-review', { code });
      setReview(response.data);
      simulateTypingEffect(response.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error("Error fetching review:", errorMessage);
      setDisplayedReview("Error fetching review. Please try again. " + errorMessage);
    } finally {
      setLoading(false);
    }
  }

  function simulateTypingEffect(text) {
    let i = 0;
    setDisplayedReview('');
    
    // Dynamic typing speed based on text length
    const baseSpeed = 5; // Base speed in milliseconds
    const speedAdjustment = Math.min(Math.floor(text.length / 500), 3); // Adjust speed for longer texts
    const typingSpeed = baseSpeed + speedAdjustment;
    
    // Process multiple characters per tick for longer texts
    const charsPerTick = text.length > 1000 ? 3 : 1;
    
    const interval = setInterval(() => {
      if (i < text.length) {
        const nextChars = text.slice(i, i + charsPerTick);
        setDisplayedReview(prev => prev + nextChars);
        i += charsPerTick;
      } else {
        clearInterval(interval);
      }
    }, typingSpeed);

    // Cleanup function to clear interval if component unmounts
    return () => clearInterval(interval);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(review).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-content">
          <Code2 className="nav-icon" size={24} />
          <h1 className="nav-title">Code Review AI</h1>
        </div>
      </nav>

      <div className="main-container">
        <div className="editor-container">
          <div className="panel-header">
            <Code2 className="header-icon" size={20} />
            <span className="header-text">Code Editor</span>
          </div>
          <div className="editor-content">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={code => prism.highlight(code, prism.languages.javascript, 'javascript')}
              padding={16}
              style={{
                fontFamily: '"Fira Code", "Fira Mono", monospace',
                fontSize: 14,
                backgroundColor: 'transparent',
                color: '#fff',
                height: '100%',
                width: '100%',
              }}
            />
          </div>
          <div className="panel-footer">
            <button
              onClick={reviewCode}
              disabled={loading}
              className="review-button"
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Wand2 size={20} />
                  <span>Review Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="review-container">
          <div className="panel-header">
            <div className="header-left">
              <Wand2 className="header-icon" size={20} />
              <span className="header-text">AI Review</span>
            </div>
            {review && (
              <button
                onClick={copyToClipboard}
                className="copy-button"
              >
                <Copy size={16} />
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <div className="review-content">
            {displayedReview ? (
              <Markdown
                rehypePlugins={[rehypeHighlight]}
                className="markdown-content"
              >
                {displayedReview}
              </Markdown>
            ) : (
              <div className="empty-state">
                <div className="empty-state-content">
                  <Wand2 size={32} className="empty-icon" />
                  <p>Enter your code and click "Review Code" to get AI-powered suggestions</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;