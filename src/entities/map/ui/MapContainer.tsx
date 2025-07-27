import Map from './Map';

interface Props {
  lat: number;
  lon: number;
  zoom?: number;
  className?: string;
}

const MapContainer = ({ 
  lat, 
  lon, 
  zoom = 15,
  className = "w-full h-64 mt-4 rounded-lg overflow-hidden border"
}: Props) => {
  return (
    <div className={className}>
      <Map lat={lat} lon={lon} zoom={zoom} />
    </div>
  );
};

export default MapContainer; 