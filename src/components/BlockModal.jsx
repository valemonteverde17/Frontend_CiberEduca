import { useState, useEffect } from 'react';
import './BlockModal.css';

export default function BlockModal({ isOpen, onClose, onSave, initialBlock = null }) {
  const [blockData, setBlockData] = useState({
    type: 'text',
    content: '',
    style: {
      color: '#333333',
      fontSize: 'medium',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'left',
      listStyle: 'disc',
      backgroundColor: 'transparent'
    }
  });

  useEffect(() => {
    if (initialBlock) {
      setBlockData({
        type: initialBlock.type,
        content: initialBlock.content,
        style: {
          color: initialBlock.style?.color || '#333333',
          fontSize: initialBlock.style?.fontSize || 'medium',
          fontWeight: initialBlock.style?.fontWeight || 'normal',
          fontStyle: initialBlock.style?.fontStyle || 'normal',
          textAlign: initialBlock.style?.textAlign || 'left',
          listStyle: initialBlock.style?.listStyle || 'disc',
          backgroundColor: initialBlock.style?.backgroundColor || 'transparent'
        }
      });
    } else {
      // Reset al cerrar/abrir
      setBlockData({
        type: 'text',
        content: '',
        style: {
          color: '#333333',
          fontSize: 'medium',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textAlign: 'left',
          listStyle: 'disc',
          backgroundColor: 'transparent'
        }
      });
    }
  }, [initialBlock, isOpen]);

  const handleSave = () => {
    if (!blockData.content.trim()) {
      alert('El contenido no puede estar vacío');
      return;
    }
    onSave(blockData);
    onClose();
  };

  const updateStyle = (key, value) => {
    setBlockData({
      ...blockData,
      style: { ...blockData.style, [key]: value }
    });
  };

  const presetColors = [
    { name: 'Negro', value: '#333333' },
    { name: 'Teal', value: '#2b9997' },
    { name: 'Amarillo Oscuro', value: '#ffb700' },
    { name: 'Naranja', value: '#ff6b35' },
    { name: 'Verde', value: '#4caf50' },
    { name: 'Morado', value: '#9c27b0' },
    { name: 'Rojo', value: '#f44336' },
    { name: 'Azul', value: '#2196f3' }
  ];

  const presetBackgrounds = [
    { name: 'Transparente', value: 'transparent' },
    { name: 'Gris Claro', value: '#f8f9fa' },
    { name: 'Amarillo Suave', value: '#fffef7' },
    { name: 'Verde Suave', value: '#e8f5e9' },
    { name: 'Azul Suave', value: '#e3f2fd' },
    { name: 'Rosa Suave', value: '#fce4ec' }
  ];

  if (!isOpen) return null;

  return (
    <div className="block-modal-overlay" onClick={onClose}>
      <div className="block-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="block-modal-header">
          <h3>{initialBlock ? '✏️ Editar Bloque' : '➕ Agregar Nuevo Bloque'}</h3>
          <button className="block-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="block-modal-body">
          {/* Tipo de Bloque */}
          <div className="form-group">
            <label className="form-label">📌 Tipo de Bloque</label>
            <div className="block-type-selector">
              <button
                type="button"
                className={`type-btn ${blockData.type === 'heading' ? 'active' : ''}`}
                onClick={() => setBlockData({ ...blockData, type: 'heading' })}
              >
                <span className="type-icon">📌</span>
                <span>Encabezado</span>
              </button>
              <button
                type="button"
                className={`type-btn ${blockData.type === 'text' ? 'active' : ''}`}
                onClick={() => setBlockData({ ...blockData, type: 'text' })}
              >
                <span className="type-icon">📝</span>
                <span>Texto</span>
              </button>
              <button
                type="button"
                className={`type-btn ${blockData.type === 'list' ? 'active' : ''}`}
                onClick={() => setBlockData({ ...blockData, type: 'list' })}
              >
                <span className="type-icon">📋</span>
                <span>Lista</span>
              </button>
              <button
                type="button"
                className={`type-btn ${blockData.type === 'code' ? 'active' : ''}`}
                onClick={() => setBlockData({ ...blockData, type: 'code' })}
              >
                <span className="type-icon">💻</span>
                <span>Código</span>
              </button>
              <button
                type="button"
                className={`type-btn ${blockData.type === 'quote' ? 'active' : ''}`}
                onClick={() => setBlockData({ ...blockData, type: 'quote' })}
              >
                <span className="type-icon">💬</span>
                <span>Cita</span>
              </button>
            </div>
          </div>

          {/* Contenido */}
          <div className="form-group">
            <label className="form-label">✍️ Contenido</label>
            <textarea
              className="block-content-textarea"
              value={blockData.content}
              onChange={(e) => setBlockData({ ...blockData, content: e.target.value })}
              placeholder={
                blockData.type === 'list' 
                  ? 'Escribe cada elemento en una línea nueva...'
                  : blockData.type === 'code'
                  ? 'Escribe tu código aquí...'
                  : 'Escribe el contenido...'
              }
              rows={blockData.type === 'code' || blockData.type === 'list' ? 8 : 5}
            />
          </div>

          {/* Opciones de Estilo */}
          <div className="style-options">
            <h4 className="style-section-title">🎨 Opciones de Estilo</h4>

            {/* Color de Texto */}
            <div className="form-group">
              <label className="form-label">Color de Texto</label>
              <div className="color-presets">
                {presetColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`color-preset ${blockData.style.color === color.value ? 'active' : ''}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => updateStyle('color', color.value)}
                    title={color.name}
                  />
                ))}
                <input
                  type="color"
                  className="color-picker"
                  value={blockData.style.color}
                  onChange={(e) => updateStyle('color', e.target.value)}
                  title="Selector de color personalizado"
                />
              </div>
            </div>

            {/* Color de Fondo */}
            <div className="form-group">
              <label className="form-label">Color de Fondo</label>
              <div className="color-presets">
                {presetBackgrounds.map((bg) => (
                  <button
                    key={bg.value}
                    type="button"
                    className={`color-preset bg-preset ${blockData.style.backgroundColor === bg.value ? 'active' : ''}`}
                    style={{ 
                      backgroundColor: bg.value === 'transparent' ? '#fff' : bg.value,
                      border: bg.value === 'transparent' ? '2px dashed #ccc' : '2px solid #e0e0e0'
                    }}
                    onClick={() => updateStyle('backgroundColor', bg.value)}
                    title={bg.name}
                  />
                ))}
              </div>
            </div>

            {/* Tamaño de Fuente */}
            <div className="form-group">
              <label className="form-label">Tamaño de Fuente</label>
              <select
                className="form-select"
                value={blockData.style.fontSize}
                onChange={(e) => updateStyle('fontSize', e.target.value)}
              >
                <option value="small">Pequeño</option>
                <option value="medium">Mediano</option>
                <option value="large">Grande</option>
                <option value="xlarge">Extra Grande</option>
              </select>
            </div>

            {/* Formato de Texto */}
            <div className="form-group">
              <label className="form-label">Formato de Texto</label>
              <div className="format-buttons">
                <button
                  type="button"
                  className={`format-btn ${blockData.style.fontWeight === 'bold' ? 'active' : ''}`}
                  onClick={() => updateStyle('fontWeight', blockData.style.fontWeight === 'bold' ? 'normal' : 'bold')}
                  title="Negrita"
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  className={`format-btn ${blockData.style.fontStyle === 'italic' ? 'active' : ''}`}
                  onClick={() => updateStyle('fontStyle', blockData.style.fontStyle === 'italic' ? 'normal' : 'italic')}
                  title="Cursiva"
                >
                  <em>I</em>
                </button>
              </div>
            </div>

            {/* Alineación */}
            <div className="form-group">
              <label className="form-label">Alineación</label>
              <div className="align-buttons">
                <button
                  type="button"
                  className={`align-btn ${blockData.style.textAlign === 'left' ? 'active' : ''}`}
                  onClick={() => updateStyle('textAlign', 'left')}
                  title="Izquierda"
                >
                  ⬅
                </button>
                <button
                  type="button"
                  className={`align-btn ${blockData.style.textAlign === 'center' ? 'active' : ''}`}
                  onClick={() => updateStyle('textAlign', 'center')}
                  title="Centro"
                >
                  ↔
                </button>
                <button
                  type="button"
                  className={`align-btn ${blockData.style.textAlign === 'right' ? 'active' : ''}`}
                  onClick={() => updateStyle('textAlign', 'right')}
                  title="Derecha"
                >
                  ➡
                </button>
                <button
                  type="button"
                  className={`align-btn ${blockData.style.textAlign === 'justify' ? 'active' : ''}`}
                  onClick={() => updateStyle('textAlign', 'justify')}
                  title="Justificado"
                >
                  ⬌
                </button>
              </div>
            </div>

            {/* Estilo de Lista (solo para listas) */}
            {blockData.type === 'list' && (
              <div className="form-group">
                <label className="form-label">Estilo de Lista</label>
                <select
                  className="form-select"
                  value={blockData.style.listStyle}
                  onChange={(e) => updateStyle('listStyle', e.target.value)}
                >
                  <option value="disc">● Viñetas (círculos)</option>
                  <option value="circle">○ Viñetas (círculos vacíos)</option>
                  <option value="square">■ Viñetas (cuadrados)</option>
                  <option value="decimal">1. Números</option>
                  <option value="lower-alpha">a. Letras minúsculas</option>
                  <option value="upper-alpha">A. Letras mayúsculas</option>
                </select>
              </div>
            )}
          </div>

          {/* Vista Previa */}
          <div className="preview-section">
            <h4 className="style-section-title">👁️ Vista Previa</h4>
            <div 
              className="preview-content"
              style={{
                color: blockData.style.color,
                fontSize: {
                  small: '0.875rem',
                  medium: '1rem',
                  large: '1.25rem',
                  xlarge: '1.5rem'
                }[blockData.style.fontSize],
                fontWeight: blockData.style.fontWeight,
                fontStyle: blockData.style.fontStyle,
                textAlign: blockData.style.textAlign,
                backgroundColor: blockData.style.backgroundColor,
                padding: '1rem',
                borderRadius: '8px',
                minHeight: '60px'
              }}
            >
              {blockData.content || 'Tu contenido aparecerá aquí...'}
            </div>
          </div>
        </div>

        <div className="block-modal-footer">
          <button className="btn-modal-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-modal-save" onClick={handleSave}>
            {initialBlock ? 'Guardar Cambios' : 'Agregar Bloque'}
          </button>
        </div>
      </div>
    </div>
  );
}
