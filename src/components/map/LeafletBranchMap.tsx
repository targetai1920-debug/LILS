'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import type { Branch } from '@/types';
import { brandMarkerIcon } from './leafletIcons';

interface LeafletBranchMapProps {
  branch: Branch;
}

export default function LeafletBranchMap({ branch }: LeafletBranchMapProps) {
  return (
    <MapContainer
      center={[branch.coordinates.lat, branch.coordinates.lng]}
      zoom={15}
      scrollWheelZoom={false}
      className="h-full w-full"
      aria-label={`Mapa de ${branch.name}`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[branch.coordinates.lat, branch.coordinates.lng]} icon={brandMarkerIcon}>
        <Popup>
          {branch.name}
          <br />
          {branch.addressLine}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
