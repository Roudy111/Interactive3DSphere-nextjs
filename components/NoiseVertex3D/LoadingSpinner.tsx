'use client';

export default function LoadingSpinner() {
  return (
    <div 
      className="loading-container"
    >
      <div className="spinner" />
      <style jsx>{`
        .loading-container {
          width: 100%;
          height: 100vh;
          background-color: #1a1a1a;
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1000;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
