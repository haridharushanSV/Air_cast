import { useEffect, useRef } from "react";

export default function Disclaimer({ onClose }) {
  const timerRef = useRef(null);

  useEffect(() => {
    // Auto close after 3 seconds
    timerRef.current = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [onClose]);

  const handleClose = () => {
    // ✅ Clear timer before closing
    clearTimeout(timerRef.current);
    onClose();
  };

  return (
    <div className="disclaimer-backdrop">
      <div className="disclaimer-box">
        <button
          className="close-btn"
          onClick={handleClose}
          aria-label="Close disclaimer"
        >
          ✕
        </button>

        <h3>Disclaimer</h3>
        <p>
          This application does not host or own any content.
          <br />
          All TV streams are publicly available sources.
          <br />
          The developer is not responsible for the content you watch.
          You are watching at your own risk.
        </p>
      </div>
    </div>
  );
}
