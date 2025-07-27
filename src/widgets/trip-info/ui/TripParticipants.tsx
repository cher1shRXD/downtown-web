"use client";

import { UserRound } from "lucide-react";

interface Props {
  usernames: string[];
}

const TripParticipants = ({ usernames }: Props) => {
  return (
    <div className="w-full flex items-start gap-1 flex-wrap">
      {usernames.map((username, index) => (
        <span key={index} className="flex items-center px-3 py-0.5 bg-gray-100 rounded-full">
          <UserRound size={20} />
          <p>{username}</p>
        </span>
      ))}
    </div>
  );
};

export default TripParticipants; 