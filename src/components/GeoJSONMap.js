import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { getKabupatenData, getColorByMemberCount } from '../data/mockData';

const GeoJSONMap = ({ geoJsonData, onKabupatenClick, onKabupatenHover }) => {
  const mapRef = useRef();

  // Force map to resize when container changes
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 100);
    }
  }, [geoJsonData]);

  const style = (feature) => {
    // Mengambil nama kabupaten dari properti GeoJSON
    const kabupatenName = feature.properties.WADMKK;
    const data = getKabupatenData(kabupatenName);
    
    return {
      fillColor: getColorByMemberCount(data.members),
      weight: 1, // Garis batas lebih tipis untuk tampilan kabupaten
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    };
  };

  const onEachFeature = (feature, layer) => {
    const kabupatenName = feature.properties.WADMKK;
    const data = getKabupatenData(kabupatenName);

    // Menggunakan 'kabupatenName' untuk tooltip
    layer.bindTooltip(kabupatenName, {
      permanent: false,
      direction: 'center',
      className: 'province-tooltip'
    });

    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.9
        });
        layer.bringToFront();
        
        if (onKabupatenHover) {
          onKabupatenHover(kabupatenName, data, e);
        }
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(style(feature));
      },
      click: (e) => {
        const map = e.target._map;
        map.fitBounds(e.target.getBounds());
        
        if (onKabupatenClick) {
          onKabupatenClick(kabupatenName, data);
        }
      }
    });
  };

  if (!geoJsonData) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
        <div>Loading map...</div>
      </div>
    );
  }

  return (
    <MapContainer 
      center={[-2.5489, 118.0149]}
      zoom={5}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
      scrollWheelZoom={true}
      zoomControl={true}
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance;
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geoJsonData && (
        <GeoJSON
          data={geoJsonData}
          style={style}
          onEachFeature={onEachFeature}
        />
      )}
    </MapContainer>
  );
};

export default GeoJSONMap;