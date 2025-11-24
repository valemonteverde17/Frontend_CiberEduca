import { useState, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './LiveCodeBlock.css';

export default function LiveCodeBlock({ htmlContent = '', editable = false, showCode = false, onUpdate }) {
  const [code, setCode] = useState(htmlContent);
  const [activeTab, setActiveTab] = useState('code');
  const [studentView, setStudentView] = useState('result'); // 'result' o 'code'
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    setCode(htmlContent);
  }, [htmlContent]);

  useEffect(() => {
    // Pequeño delay para asegurar que el iframe esté listo
    const timer = setTimeout(() => {
      updatePreview();
    }, 10);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, activeTab, studentView]);

  const updatePreview = () => {
    if (!iframeRef.current) {
      return;
    }

    try {
      const iframe = iframeRef.current;
      const content = code || '<p style="color: #999; text-align: center; padding: 2rem;">Sin código para mostrar</p>';
      
      // Usar srcdoc en lugar de acceder al contentDocument
      iframe.srcdoc = content;
    } catch (error) {
      console.error('Error al actualizar preview:', error);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
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
            <textarea
              className="code-editor html-editor"
              value={code}
              onChange={handleCodeChange}
              placeholder="Escribe tu código HTML completo aquí (incluyendo <!DOCTYPE html>, <style>, etc.)..."
              spellCheck="false"
              style={{ display: activeTab === 'code' ? 'block' : 'none' }}
            />
            <div className="preview-container" style={{ display: activeTab === 'preview' ? 'block' : 'none' }}>
              <iframe
                ref={iframeRef}
                className="preview-iframe"
                title="Live Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="live-code-header-simple">
            <div className="live-code-badge">
              <span className="badge-icon">⚡</span>
              <span>Código en Vivo</span>
            </div>
            {showCode && (
              <div className="student-view-buttons">
                <button
                  className={`view-btn ${studentView === 'result' ? 'active' : ''}`}
                  onClick={() => setStudentView('result')}
                >
                  👁️ Resultado
                </button>
                <button
                  className={`view-btn ${studentView === 'code' ? 'active' : ''}`}
                  onClick={() => setStudentView('code')}
                >
                  💻 Ver Código
                </button>
              </div>
            )}
          </div>
          
          <div className="student-view">
            <div className="code-section-full" style={{ display: showCode && studentView === 'code' ? 'block' : 'none' }}>
              <div className="code-section-header">
                <span className="section-icon">💻</span>
                Código HTML
                <button 
                  className={`copy-button-student ${copied ? 'copied' : ''}`}
                  onClick={handleCopy}
                  title="Copiar código"
                >
                  {copied ? (
                    <>
                      <span className="copy-icon">✓</span>
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <span className="copy-icon">📋</span>
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
              <SyntaxHighlighter 
                language="html" 
                style={vscDarkPlus}
                showLineNumbers={true}
                customStyle={{
                  margin: 0,
                  borderRadius: 0,
                  fontSize: '0.9rem'
                }}
              >
                {code || '// Sin código'}
              </SyntaxHighlighter>
            </div>
            
            <div className="preview-section" style={{ display: (!showCode || studentView === 'result') ? 'block' : 'none' }}>
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
