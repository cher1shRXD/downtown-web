"use client";

import React, { useRef, useState } from "react";
import { PopupData } from "../types/popup-data";
import { useThreeScene } from "../model/useThreeScene";
import Popup from "./Popup";

const Scene = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [popup, setPopup] = useState<PopupData | null>(null);

  useThreeScene(mountRef, setPopup);

  const handleClosePopup = () => {
    setPopup(null);
  };

  return (
    <>
      <div ref={mountRef} style={{ flex: 1, height: "100%" }} />
      {popup && (
        <Popup popup={popup} onClose={handleClosePopup} />
      )}
    </>
  );
};

export default Scene;