import React, { useCallback } from 'react'

import Modeling from './modeling'

import '../css/App.css'
import bannerImage from '../assets/banner.png'; // 이미지 import

function App() {
  return (
    <div className="bg-[#f4f4f4] min-h-screen flex flex-col items-center">
      <img
        src={bannerImage} // 이미지 소스 설정
        alt="Banner"
        className="w-3/5 object-cover" // Tailwind CSS 클래스 적용
      />      
      <span className="font-sans"> You can move with keyboard and mouse!</span>
      <span className="font-sans"> Click the bird</span>
      <span className="font-sans"> bird will repeat your ask :) </span>
      <div className="flex-grow flex items-center justify-center mt-20 mb-40">
        <Modeling />
      </div>
      <div className="mb-56" />
    </div>
  );
}

export default App
