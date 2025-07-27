interface Props {
  date: string;
  peopleCount: number;
}

const TripDetails = ({ date, peopleCount }: Props) => {
  return (
    <div className="w-full flex items-end gap-2">
      <p className="text-2xl font-bold">{date}</p>
      <p className="text-gray-400">with {peopleCount} people</p>
    </div>
  );
};

export default TripDetails; 