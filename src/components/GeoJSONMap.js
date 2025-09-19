import React, { useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { getProvinceData, getColorByMemberCount } from '../data/mockData';

const GeoJSONMap = ({ geoJsonData, onProvinceClick, onProvinceHover }) => {
  const mapRef = useRef();

  const style = (feature) => {
    const provinceName = feature.properties.PROVINSI || feature.properties.NAME_1;
    const data = getProvinceData(provinceName);
    
    return {
      fillColor: getColorByMemberCount(data.members),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  const onEachFeature = (feature, layer) => {
    const provinceName = feature.properties.PROVINSI || feature.properties.NAME_1;
    const data = getProvinceData(provinceName);

    // Tooltip untuk menampilkan nama provinsi
    layer.bindTooltip(provinceName, {
      permanent: false,
      direction: 'center',
      className: 'province-tooltip'
    });

    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        
        // Highlight style saat hover
        layer.setStyle({
          weight: 5,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.9
        });
        
        layer.bringToFront();
        
        if (onProvinceHover) {
          onProvinceHover(provinceName, data, e);
        }
      },
      mouseout: (e) => {
        const layer = e.target;
        // Kembalikan style original
        layer.setStyle(style(feature));
      },
      click: (e) => {
        const map = e.target._map;
        // Zoom ke provinsi yang diklik
        map.fitBounds(e.target.getBounds());
        
        if (onProvinceClick) {
          onProvinceClick(provinceName, data);
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
          key={JSON.stringify(geoJsonData)} // Force re-render when data changes
        />
      )}
    </MapContainer>
  );
};

export default GeoJSONMap;