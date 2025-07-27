interface Props {
  locations: string[];
}

const TripLocations = ({ locations }: Props) => {
  return (
    <ul className="list-disc pl-4 font-semibold">
      {locations.map((location, index) => (
        <li key={index}>{location}</li>
      ))}
    </ul>
  );
};

export default TripLocations; 