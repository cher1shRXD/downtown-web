"use client";

import TripTags from "./TripTags";
import TripDetails from "./TripDetails";
import TripParticipants from "./TripParticipants";
import TripLocations from "./TripLocations";
import MapContainer from "@/entities/map/ui/MapContainer";

interface Props {
  date: string;
  peopleCount: number;
  usernames: string[];
  locations: string[];
  tags: string[];
  lat: number;
  lon: number;
}

const TripInfo = ({
  date,
  peopleCount,
  usernames,
  locations,
  tags,
  lat,
  lon,
}: Props) => {
  return (
    <div className="w-full h-full right-0 p-8">
      <TripTags tags={tags} />
      <div className="w-full flex flex-col gap-2">
        <TripDetails date={date} peopleCount={peopleCount} />
        <TripParticipants usernames={usernames} />
        <div className="w-full mt-4">
          <TripLocations locations={locations} />
          <MapContainer lat={lat} lon={lon} />
        </div>
      </div>
    </div>
  );
};

export default TripInfo;
