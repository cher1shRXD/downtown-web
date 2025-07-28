import Scene from "@/entities/scene/ui/Scene";
import Photos from "@/widgets/photos/ui/Photos";
import TripInfo from "@/widgets/trip-info/ui/TripInfo";
import Image from "next/image";

const Main = async () => {
  return (
    <div className="w-screen h-screen flex">
      <div className="w-90 h-full z-10 bg-white p-4">
        <img src="/images/logo.svg" alt="downtown" className="h-16" />
      </div>

      <Scene />
      <div className="w-120 h-full bg-white flex flex-col">
        <TripInfo
          date="2025년 7월 12일"
          lat={37.5665}
          lon={126.9780}
          locations={["서울광역시 도봉구 노원동", "어쩌고 저쩌고 맛집"]}
          peopleCount={4}
          tags={["식당", "맛집"]}
          usernames={["username1", "username2", "username2", "username2"]}
        />
        <Photos />
      </div>
    </div>
  );
};

export default Main;
