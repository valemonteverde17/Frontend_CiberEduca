import { useState, useEffect, useRef } from 'react';
import './LiveCodeBlock.css';

export default function LiveCodeBlock({ htmlContent = '', cssContent = '', editable = false, onUpdate }) {
  const [html, setHtml] = useState(htmlContent);
  const [css, setCss] = useState(cssContent);
  const [activeTab, setActiveTab] = useState('html');
  const iframeRef = useRef(null);

  useEffect(() => {
    setHtml(htmlContent);
    setCss(cssContent);
  }, [htmlContent, cssContent]);

  useEffect(() => {
    updatePreview();
  }, [html, css]);

  const updatePreview = () => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const document = iframe.contentDocument || iframe.contentWindow.document;

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
              padding: 1rem;
              background: white;
            }
            ${css}
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    document.open();
    document.write(content);
    document.close();
  };

  const handleHtmlChange = (e) => {
    const newHtml = e.target.value;
    setHtml(newHtml);
    if (editable && onUpdate) {
      onUpdate({ html: newHtml, css });
    }
  };

  const handleCssChange = (e) => {
    const newCss = e.target.value;
    setCss(newCss);
    if (editable && onUpdate) {
      onUpdate({ html, css: newCss });
    }
  };

  const handleReset = () => {
    setHtml(htmlContent);
    setCss(cssContent);
  };

  return (
    <div className="live-code-block">
      {editable ? (
        <>
          <div className="live-code-header">
            <div className="live-code-tabs">
              <button
                className={`tab-button ${activeTab === 'html' ? 'active' : ''}`}
                onClick={() => setActiveTab('html')}
              >
                <span className="tab-icon">🌐</span>
                HTML
              </button>
              <button
                className={`tab-button ${activeTab === 'css' ? 'active' : ''}`}
                onClick={() => setActiveTab('css')}
              >
                <span className="tab-icon">🎨</span>
                CSS
              </button>
              <button
                className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
                onClick={() => setActiveTab('preview')}
              >
                <span className="tab-icon">👁️</span>
                Preview
              </button>
            </div>
            <button className="reset-button" onClick={handleReset} title="Resetear código">
              ↻ Resetear
            </button>
          </div>

          <div className="live-code-content">
            {activeTab === 'html' && (
              <textarea
                className="code-editor html-editor"
                value={html}
                onChange={handleHtmlChange}
                placeholder="Escribe tu código HTML aquí..."
                spellCheck="false"
              />
            )}
            {activeTab === 'css' && (
              <textarea
                className="code-editor css-editor"
                value={css}
                onChange={handleCssChange}
                placeholder="Escribe tu código CSS aquí..."
                spellCheck="false"
              />
            )}
            {activeTab === 'preview' && (
              <div className="preview-container">
                <iframe
                  ref={iframeRef}
                  className="preview-iframe"
                  title="Live Preview"
                  sandbox="allow-scripts"
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="live-code-header-simple">
            <div className="live-code-badge">
              <span className="badge-icon">⚡</span>
              <span>Código en Vivo</span>
            </div>
          </div>
          <div className="split-view">
            <div className="code-section">
              <div className="code-section-header">
                <span className="section-icon">🌐</span>
                HTML
              </div>
              <pre className="code-display">{html || 'Sin código HTML'}</pre>
            </div>
            <div className="code-section">
              <div className="code-section-header">
                <span className="section-icon">🎨</span>
                CSS
              </div>
              <pre className="code-display">{css || 'Sin código CSS'}</pre>
            </div>
          </div>
          <div className="preview-section">
            <div className="preview-section-header">
              <span className="section-icon">👁️</span>
              Resultado
            </div>
            <div className="preview-container">
              <iframe
                ref={iframeRef}
                className="preview-iframe"
                title="Live Preview"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
