import React from 'react';

const InfoWindow = ({ province, data, position, visible }) => {
  if (!visible) return null;

  return (
    <div 
      className="info-window"
      style={{
        position: 'absolute',
        left: position?.x || 0,
        top: position?.y || 0,
        zIndex: 1000
      }}
    >
      <div className="info-content">
        <h4>{province}</h4>
        <div className="info-stats">
          <div className="stat-item">
            <span className="stat-label">Anggota:</span>
            <span className="stat-value">{data.members?.toLocaleString()}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Tiket:</span>
            <span className="stat-value">{data.tickets}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Artikel:</span>
            <span className="stat-value">{data.articles}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoWindow;