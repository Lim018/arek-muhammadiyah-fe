import React from 'react';

const InfoWindow = ({ title, data, position, visible }) => {
  if (!visible) return null;

  return (
    <div 
      className="info-window"
      style={{
        position: 'absolute',
        left: position?.x || 0,
        top: position?.y || 0,
        zIndex: 1000,
        background: 'white',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        minWidth: '200px',
        pointerEvents: 'none'
      }}
    >
      <div className="info-content">
        <h4 style={{ margin: '0 0 8px 0', fontSize: '1em', fontWeight: '600' }}>
          {title}
        </h4>
        <div className="info-stats" style={{ fontSize: '0.9em' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f3f4f6' }}>
            <span style={{ color: '#6b7280' }}>Anggota:</span>
            <strong>{data.members?.toLocaleString() || 0}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f3f4f6' }}>
            <span style={{ color: '#6b7280' }}>Tiket:</span>
            <strong>{data.tickets || 0}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoWindow;