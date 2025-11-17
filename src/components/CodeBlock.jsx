import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './CodeBlock.css';

export default function CodeBlock({ code, language = 'javascript', theme = 'dark', showLineNumbers = true }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const themeStyle = theme === 'dark' ? vscDarkPlus : vs;

  return (
    <div className={`code-block-container ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <div className="code-block-header">
        <div className="code-language-badge">
          <span className="code-icon">💻</span>
          <span className="language-name">{language.toUpperCase()}</span>
        </div>
        <button 
          className={`copy-button ${copied ? 'copied' : ''}`}
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
      <div className="code-block-content">
        <SyntaxHighlighter
          language={language}
          style={themeStyle}
          showLineNumbers={showLineNumbers}
          wrapLines={true}
          customStyle={{
            margin: 0,
            borderRadius: '0 0 12px 12px',
            fontSize: '0.9rem',
            padding: '1.5rem',
          }}
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1em',
            color: theme === 'dark' ? '#6e7681' : '#999',
            userSelect: 'none'
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
