import { useState } from 'react';
import './ContentEditor.css';

export default function ContentEditor({ content, onChange }) {
  const [blocks, setBlocks] = useState(content || []);

  const addBlock = (type) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      order: blocks.length
    };
    const updatedBlocks = [...blocks, newBlock];
    setBlocks(updatedBlocks);
    onChange(updatedBlocks);
  };

  const updateBlock = (id, newContent) => {
    const updatedBlocks = blocks.map(block =>
      block.id === id ? { ...block, content: newContent } : block
    );
    setBlocks(updatedBlocks);
    onChange(updatedBlocks);
  };

  const deleteBlock = (id) => {
    const updatedBlocks = blocks.filter(block => block.id !== id);
    setBlocks(updatedBlocks);
    onChange(updatedBlocks);
  };

  const moveBlock = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === blocks.length - 1)
    ) {
      return;
    }

    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    
    // Actualizar orden
    newBlocks.forEach((block, idx) => {
      block.order = idx;
    });

    setBlocks(newBlocks);
    onChange(newBlocks);
  };

  const getBlockIcon = (type) => {
    switch (type) {
      case 'heading': return '📌';
      case 'text': return '📝';
      case 'list': return '📋';
      case 'code': return '💻';
      case 'quote': return '💬';
      default: return '📄';
    }
  };

  const getBlockLabel = (type) => {
    switch (type) {
      case 'heading': return 'Encabezado';
      case 'text': return 'Texto';
      case 'list': return 'Lista';
      case 'code': return 'Código';
      case 'quote': return 'Cita';
      default: return 'Bloque';
    }
  };

  return (
    <div className="content-editor">
      <div className="content-editor-header">
        <h3>📚 Contenido del Tema</h3>
        <div className="add-block-buttons">
          <button
            type="button"
            className="add-block-btn"
            onClick={() => addBlock('heading')}
            title="Agregar Encabezado"
          >
            📌 Encabezado
          </button>
          <button
            type="button"
            className="add-block-btn"
            onClick={() => addBlock('text')}
            title="Agregar Texto"
          >
            📝 Texto
          </button>
          <button
            type="button"
            className="add-block-btn"
            onClick={() => addBlock('list')}
            title="Agregar Lista"
          >
            📋 Lista
          </button>
          <button
            type="button"
            className="add-block-btn"
            onClick={() => addBlock('code')}
            title="Agregar Código"
          >
            💻 Código
          </button>
          <button
            type="button"
            className="add-block-btn"
            onClick={() => addBlock('quote')}
            title="Agregar Cita"
          >
            💬 Cita
          </button>
        </div>
      </div>

      {blocks.length === 0 ? (
        <div className="no-blocks-message">
          <p>📄 No hay bloques de contenido. Agrega uno usando los botones de arriba.</p>
        </div>
      ) : (
        <div className="blocks-list">
          {blocks.map((block, index) => (
            <div key={block.id} className={`content-block content-block-${block.type}`}>
              <div className="block-header">
                <span className="block-type-label">
                  {getBlockIcon(block.type)} {getBlockLabel(block.type)}
                </span>
                <div className="block-actions">
                  <button
                    type="button"
                    className="block-action-btn"
                    onClick={() => moveBlock(index, 'up')}
                    disabled={index === 0}
                    title="Mover arriba"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="block-action-btn"
                    onClick={() => moveBlock(index, 'down')}
                    disabled={index === blocks.length - 1}
                    title="Mover abajo"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="block-action-btn delete-btn"
                    onClick={() => deleteBlock(block.id)}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <textarea
                className="block-content-input"
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder={`Escribe el contenido del ${getBlockLabel(block.type).toLowerCase()}...`}
                rows={block.type === 'heading' ? 2 : block.type === 'code' || block.type === 'list' ? 6 : 4}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
