import { useState } from 'react';
import BlockModal from './BlockModal';
import './ContentEditor.css';

export default function ContentEditor({ content, onChange }) {
  const [blocks, setBlocks] = useState(content || []);
  const [showModal, setShowModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddBlock = () => {
    setEditingBlock(null);
    setEditingIndex(null);
    setShowModal(true);
  };

  const handleEditBlock = (block, index) => {
    setEditingBlock(block);
    setEditingIndex(index);
    setShowModal(true);
  };

  const handleSaveBlock = (blockData) => {
    if (editingBlock) {
      // Editar bloque existente
      const updatedBlocks = blocks.map((block, idx) =>
        idx === editingIndex
          ? { ...block, ...blockData }
          : block
      );
      setBlocks(updatedBlocks);
      onChange(updatedBlocks);
    } else {
      // Agregar nuevo bloque
      const newBlock = {
        id: Date.now().toString(),
        type: blockData.type,
        content: blockData.content,
        order: blocks.length,
        style: blockData.style
      };
      const updatedBlocks = [...blocks, newBlock];
      setBlocks(updatedBlocks);
      onChange(updatedBlocks);
    }
  };

  const deleteBlock = (id) => {
    if (!window.confirm('¿Eliminar este bloque?')) return;
    const updatedBlocks = blocks.filter(block => block.id !== id);
    // Reordenar
    updatedBlocks.forEach((block, idx) => {
      block.order = idx;
    });
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

  const getBlockStyle = (block) => {
    if (!block.style) return {};
    
    const fontSizeMap = {
      small: '0.875rem',
      medium: '1rem',
      large: '1.25rem',
      xlarge: '1.5rem'
    };

    return {
      color: block.style.color || '#333',
      fontSize: fontSizeMap[block.style.fontSize] || '1rem',
      fontWeight: block.style.fontWeight || 'normal',
      fontStyle: block.style.fontStyle || 'normal',
      textAlign: block.style.textAlign || 'left',
      backgroundColor: block.style.backgroundColor !== 'transparent' ? block.style.backgroundColor : undefined,
      padding: block.style.backgroundColor !== 'transparent' ? '0.5rem' : undefined,
      borderRadius: block.style.backgroundColor !== 'transparent' ? '6px' : undefined
    };
  };

  return (
    <div className="content-editor">
      <div className="content-editor-header">
        <h3>📚 Contenido del Tema</h3>
        <button
          type="button"
          className="add-block-btn-unified"
          onClick={handleAddBlock}
        >
          ➕ Agregar Bloque
        </button>
      </div>

      {blocks.length === 0 ? (
        <div className="no-blocks-message">
          <p>📄 No hay bloques de contenido. Haz clic en "Agregar Bloque" para comenzar.</p>
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
                    className="block-action-btn edit-btn"
                    onClick={() => handleEditBlock(block, index)}
                    title="Editar bloque"
                  >
                    ✏️
                  </button>
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
              <div 
                className="block-preview"
                style={getBlockStyle(block)}
              >
                {block.type === 'list' ? (
                  <ul style={{ listStyleType: block.style?.listStyle || 'disc', margin: 0, paddingLeft: '1.5rem' }}>
                    {block.content.split('\n').filter(item => item.trim()).map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : block.type === 'code' ? (
                  <pre style={{ margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                    <code>{block.content}</code>
                  </pre>
                ) : (
                  <div style={{ whiteSpace: 'pre-wrap' }}>{block.content}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <BlockModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveBlock}
        initialBlock={editingBlock}
      />
    </div>
  );
}
