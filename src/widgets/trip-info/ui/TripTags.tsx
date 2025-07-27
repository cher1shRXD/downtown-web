interface Props {
  tags: string[];
}

const TripTags = ({ tags }: Props) => {
  return (
    <div className="w-full flex items-center gap-4 mb-2">
      {tags.map((tag, index) => (
        <p key={index} className="text-xl text-orange-600 font-medium">
          # {tag}
        </p>
      ))}
    </div>
  );
};

export default TripTags; 