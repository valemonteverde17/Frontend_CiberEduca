import { useState, useEffect, useRef } from 'react';
import './LiveCodeBlock.css';

export default function LiveCodeBlock({ htmlContent = '', editable = false, onUpdate }) {
  const [code, setCode] = useState(htmlContent);
  const [activeTab, setActiveTab] = useState('code');
  const iframeRef = useRef(null);

  useEffect(() => {
    setCode(htmlContent);
  }, [htmlContent]);

  useEffect(() => {
    updatePreview();
  }, [code]);

  const updatePreview = () => {
    if (!iframeRef.current) return;

    try {
      const iframe = iframeRef.current;
      
      // Usar srcdoc en lugar de acceder al contentDocument
      iframe.srcdoc = code || '<p style="color: #999; text-align: center; padding: 2rem;">Sin código para mostrar</p>';
    } catch (error) {
      console.error('Error al actualizar preview:', error);
    }
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    if (editable && onUpdate) {
      onUpdate(newCode);
    }
  };

  const handleReset = () => {
    setCode(htmlContent);
  };

  return (
    <div className="live-code-block">
      {editable ? (
        <>
          <div className="live-code-header">
            <div className="live-code-tabs">
              <button
                className={`tab-button ${activeTab === 'code' ? 'active' : ''}`}
                onClick={() => setActiveTab('code')}
              >
                <span className="tab-icon">💻</span>
                Código HTML
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
            {activeTab === 'code' && (
              <textarea
                className="code-editor html-editor"
                value={code}
                onChange={handleCodeChange}
                placeholder="Escribe tu código HTML completo aquí (incluyendo <!DOCTYPE html>, <style>, etc.)..."
                spellCheck="false"
              />
            )}
            {activeTab === 'preview' && (
              <div className="preview-container">
                <iframe
                  ref={iframeRef}
                  className="preview-iframe"
                  title="Live Preview"
                  sandbox="allow-scripts allow-same-origin"
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
              <span>Código en Vivo - HTML Completo</span>
            </div>
          </div>
          <div className="student-view">
            <div className="code-section-full">
              <div className="code-section-header">
                <span className="section-icon">💻</span>
                Código HTML
              </div>
              <pre className="code-display">{code || 'Sin código'}</pre>
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
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
