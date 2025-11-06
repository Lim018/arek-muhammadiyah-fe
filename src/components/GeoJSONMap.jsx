import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';

const GeoJSONMap = ({ geoJsonData, cityStatsData, onCityClick, onCityHover, wilayahData }) => {
  const mapRef = useRef();

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 100);
    }
  }, [geoJsonData]);

  // Fungsi untuk mendapatkan city_id dari nama kabupaten/kota
  const getCityIdFromName = (cityName) => {
    if (!wilayahData || wilayahData.length === 0) {
      return null;
    }

    const normalizedSearch = cityName.toUpperCase().trim();
    
    // Cari di wilayahData berdasarkan name
    const found = wilayahData.find(city => {
      const normalizedCityName = city.name.toUpperCase().trim();
      
      // Exact match
      if (normalizedCityName === normalizedSearch) {
        return true;
      }
      
      // Partial match
      if (normalizedCityName.includes(normalizedSearch) || 
          normalizedSearch.includes(normalizedCityName)) {
        return true;
      }
      
      // Handle "KABUPATEN" atau "KOTA" prefix
      const nameWithoutPrefix = normalizedCityName
        .replace('KABUPATEN ', '')
        .replace('KOTA ', '');
      const searchWithoutPrefix = normalizedSearch
        .replace('KABUPATEN ', '')
        .replace('KOTA ', '');
        
      if (nameWithoutPrefix === searchWithoutPrefix) {
        return true;
      }
      
      return false;
    });

    return found ? found.id : null;
  };

  // Fungsi untuk mendapatkan warna berdasarkan jumlah anggota
  const getColorByMemberCount = (members) => {
    if (members > 500) return '#800026';
    if (members > 300) return '#BD0026';
    if (members > 200) return '#E31A1C';
    if (members > 100) return '#FC4E2A';
    if (members > 50) return '#FD8D3C';
    if (members > 20) return '#FEB24C';
    if (members > 10) return '#FED976';
    if (members > 0) return '#FFEDA0';
    return '#f3f4f6';
  };

  const style = (feature) => {
    const cityName = feature.properties.WADMKK || feature.properties.NAME || feature.properties.name;
    const cityId = getCityIdFromName(cityName);
    
    const cityData = cityId && cityStatsData ? cityStatsData[cityId] : null;
    const memberCount = cityData ? cityData.total_users : 0;
    
    return {
      fillColor: getColorByMemberCount(memberCount),
      weight: 2.5,
      opacity: 1,
      color: '#2563eb',
      fillOpacity: 0.75
    };
  };

  const onEachFeature = (feature, layer) => {
    const cityName = feature.properties.WADMKK || feature.properties.NAME || feature.properties.name;
    const cityId = getCityIdFromName(cityName);
    const cityData = cityId && cityStatsData ? cityStatsData[cityId] : null;

    layer.bindTooltip(cityName, {
      permanent: false,
      direction: 'center',
      className: 'city-tooltip'
    });

    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 4,
          color: '#1e40af',
          dashArray: '',
          fillOpacity: 0.95
        });
        layer.bringToFront();
        
        if (onCityHover) {
          onCityHover(cityName, cityId, cityData, e);
        }
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(style(feature));
      },
      click: (e) => {
        const map = e.target._map;
        map.fitBounds(e.target.getBounds());
        
        if (onCityClick) {
          onCityClick(cityName, cityId, cityData);
        }
      }
    });
  };

  // Filter GeoJSON untuk hanya menampilkan Jawa Timur
  const filterJawaTimur = (geoJsonData) => {
    if (!geoJsonData || !geoJsonData.features) return null;

    const jawaTimurCities = [
      'PACITAN', 'PONOROGO', 'TRENGGALEK', 'TULUNGAGUNG', 'BLITAR', 'KEDIRI',
      'MALANG', 'LUMAJANG', 'JEMBER', 'BANYUWANGI', 'BONDOWOSO', 'SITUBONDO',
      'PROBOLINGGO', 'PASURUAN', 'SIDOARJO', 'MOJOKERTO', 'JOMBANG', 'NGANJUK',
      'MADIUN', 'MAGETAN', 'NGAWI', 'BOJONEGORO', 'TUBAN', 'LAMONGAN', 'GRESIK',
      'BANGKALAN', 'SAMPANG', 'PAMEKASAN', 'SUMENEP',
      'KOTA KEDIRI', 'KOTA BLITAR', 'KOTA MALANG', 'KOTA PROBOLINGGO',
      'KOTA PASURUAN', 'KOTA MOJOKERTO', 'KOTA MADIUN', 'KOTA SURABAYA', 'KOTA BATU'
    ];

    const filteredFeatures = geoJsonData.features.filter(feature => {
      const cityName = (feature.properties.WADMKK || feature.properties.NAME || feature.properties.name || '').toUpperCase();
      return jawaTimurCities.some(jatimCity => 
        cityName.includes(jatimCity) || jatimCity.includes(cityName)
      );
    });

    return {
      type: 'FeatureCollection',
      features: filteredFeatures
    };
  };

  if (!geoJsonData) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
        <div>Loading map...</div>
      </div>
    );
  }

  const filteredGeoJson = filterJawaTimur(geoJsonData);

  if (!filteredGeoJson || filteredGeoJson.features.length === 0) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
        <div>Data Jawa Timur tidak ditemukan</div>
      </div>
    );
  }

  return (
    <MapContainer 
      center={[-7.5, 112.5]}
      zoom={8}
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
      {filteredGeoJson && (
        <GeoJSON
          key={JSON.stringify(cityStatsData)}
          data={filteredGeoJson}
          style={style}
          onEachFeature={onEachFeature}
        />
      )}
    </MapContainer>
  );
};

export default GeoJSONMap;