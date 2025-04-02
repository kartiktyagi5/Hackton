import React from 'react';
import pdf from "../assets/ps.pdf";

function Tracks() {
  return (
    <div
      className="min-h-screen p-8"
      style={{
        background: 'linear-gradient(to bottom, #ffffff, #f0f4ff)',
      }}
      id='tracks'
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-black">Hackathon Problem Statements</h1>
        
        <div className="w-full md:w-5/6 lg:w-4/5 mx-auto bg-white rounded-lg shadow-lg p-4 h-[700px]">
          <iframe
            src={pdf}
            className="w-full h-full border-0"
            title="Problem Statements PDF"
          />
        </div>
      </div>
    </div>
  );
}

export default Tracks;
