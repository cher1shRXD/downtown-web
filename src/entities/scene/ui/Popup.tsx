import { PopupData } from "../types/popup-data";

interface Props {
  popup: PopupData;
  onClose: () => void;
}

const Popup = ({ popup, onClose }: Props) => {
  return (
    <div
      style={{
        position: "absolute",
        top: popup.y,
        left: popup.x,
        background: "white",
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid black",
        transform: "translate(-50%, -120%)",
        whiteSpace: "nowrap",
        zIndex: 1000,
      }}
    >
      <div>{popup.text}</div>
      <button 
        onClick={onClose} 
        style={{ 
          marginTop: '5px',
          padding: '4px 8px',
          border: '1px solid #ccc',
          borderRadius: '3px',
          background: '#f0f0f0',
          cursor: 'pointer'
        }}
      >
        Close
      </button>
    </div>
  );
};

export default Popup;