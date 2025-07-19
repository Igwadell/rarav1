
"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Property } from '@/lib/types';
import { useEffect } from 'react';

// Fix for default icon issue with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapWrapperProps {
  center: { lat: number; lng: number };
  zoom: number;
  properties: Property[];
  selectedProperty: Property | null;
}

const ChangeView = ({ center, zoom }: { center: {lat: number, lng: number}, zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapWrapper({ center, zoom, properties, selectedProperty }: MapWrapperProps) {
  const selectedIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const defaultIcon = new L.Icon.Default();
  
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="h-full w-full z-0">
      <ChangeView center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {properties.map((prop) => (
        <Marker 
          key={prop.id} 
          position={[prop.coords.lat, prop.coords.lng]}
          icon={selectedProperty?.id === prop.id ? selectedIcon : defaultIcon}
        >
          <Popup>
            <div>
              <h3 className="font-bold">{prop.title}</h3>
              <p>${prop.pricePerNight} / night</p>
            </div>
          </Popup>
        </Marker>
      ))}
      {center && (
         <Marker position={[center.lat, center.lng]} icon={new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })}>
             <Popup>You are here</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
