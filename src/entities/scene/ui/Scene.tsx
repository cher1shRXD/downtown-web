"use client";

import React, { useRef, useState } from "react";
import { PopupData } from "../types/popup-data";
import { useThreeScene } from "../model/useThreeScene";
import Popup from "./Popup";

const Scene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [popup, setPopup] = useState<PopupData | null>(null);

  useThreeScene(mountRef, setPopup);

  const handleClosePopup = () => {
    setPopup(null);
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
      {popup && (
        <Popup popup={popup} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default Scene;