import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { PersonStanding } from 'lucide-react';
import { Link } from 'react-router-dom';

type Location = {
  id: any;
  title: string;
  img: string;
  latitude: number;
  longitude: number;
};

type MapComponentProps = {
  position: [number, number];
  locations?: Location[];
};

function Map({ position, locations = [] }: MapComponentProps) {
  return (
    <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

     
      <Marker position={position}>
        <Popup>
          <div className="flex  items-center ">
            <p className="text-teal-500 font-bold">C'est moi !</p>
            <PersonStanding className="text-teal-500" />
          </div>
        </Popup>
      </Marker>

      {/* Marqueurs pour chaque emplacement dans le tableau locations */}
      {locations.map((loc, index) => (
        <Marker key={index} position={[loc.latitude, loc.longitude]}>
          <Popup>
            <div className='flex flex-col w-[80px] gap-2'>
              <strong className="line-clamp-2">{loc.title}</strong>
              <div className="flex bg-teal-600 w-full h-full">
                <img src={loc.img} alt={loc.title} className="flex " /><br />
              </div>

              <Link
                to={`/event/${loc.id}`}
                className='bg-blue-600 flex w-full justify-center text-white rounded-sm m-1'
              >
                <span className="text-white">Voir plus</span>
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Map;
