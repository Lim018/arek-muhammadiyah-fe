import React, { useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { getKabupatenData, getColorByMemberCount } from '../data/mockData';

const GeoJSONMap = ({ geoJsonData, onKabupatenClick, onKabupatenHover }) => {
  const mapRef = useRef();

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

    // PERBAIKAN DI SINI: Menggunakan 'kabupatenName' untuk tooltip
    layer.bindTooltip(kabupatenName, {
      permanent: false,
      direction: 'center',
      className: 'province-tooltip' // Nama kelas CSS bisa tetap sama
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

  return (
    <MapContainer
      center={[-2.5489, 118.0149]}
      zoom={5}
      className="map-container"
      ref={mapRef}
      scrollWheelZoom={true}
      zoomControl={true}
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