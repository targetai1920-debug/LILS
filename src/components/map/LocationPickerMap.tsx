'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import { brandMarkerIcon } from './leafletIcons';

interface LocationPickerMapProps {
  center: { lat: number; lng: number };
  value: { lat: number; lng: number } | null;
  onChange: (coords: { lat: number; lng: number }) => void;
}

function ClickHandler({ onChange }: { onChange: (coords: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(event) {
      onChange({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });
  return null;
}

export default function LocationPickerMap({ center, value, onChange }: LocationPickerMapProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const markerPosition = value ?? center;

  return (
    <MapContainer
      center={[markerPosition.lat, markerPosition.lng]}
      zoom={15}
      className="h-full w-full"
      ref={mapRef}
      aria-label="Mapa para marcar la ubicación de entrega"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onChange={onChange} />
      <Marker
        position={[markerPosition.lat, markerPosition.lng]}
        icon={brandMarkerIcon}
        draggable
        eventHandlers={{
          dragend: (event) => {
            const marker = event.target;
            const position = marker.getLatLng();
            onChange({ lat: position.lat, lng: position.lng });
          },
        }}
      />
    </MapContainer>
  );
}
