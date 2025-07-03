"use client"
import React, { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { BsStars } from "react-icons/bs";

const StarryBackground = () => {
  const [starCount, setStarCount] = useState(100);
  const [starSpeed, setStarSpeed] = useState(50);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [starColor, setStarColor] = useState("#FFFFFF");
  const [starSize, setStarSize] = useState(2);

  useEffect(() => {
    const canvas = document.getElementById("starCanvas");
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let stars = [];

    const initCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * starSize,
          speed: Math.random() * (starSpeed / 50)
        });
      }
    };

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = starColor;

      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        star.x += star.speed;
        if (star.x > canvas.width) star.x = 0;
      });

      animationFrameId = requestAnimationFrame(drawStars);
    };

    const handleResize = () => {
      initCanvas();
      createStars();
    };

    window.addEventListener("resize", handleResize);
    initCanvas();
    createStars();
    drawStars();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [starCount, starSpeed, starColor, starSize]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen relative ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <canvas
        id="starCanvas"
        className="absolute top-0 left-0 w-full h-full"
        aria-label="Animated starry night sky background"
      />

      <div className="absolute top-4 right-4 space-y-4 bg-opacity-80 bg-gray-800 p-4 rounded-lg">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 text-white"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>

        <div className="space-y-2">
          <label className="block text-sm text-white">
            Star Count
            <input
              type="range"
              min="10"
              max="500"
              value={starCount}
              onChange={(e) => setStarCount(parseInt(e.target.value))}
              className="w-full"
              aria-label="Adjust star count"
            />
          </label>

          <label className="block text-sm text-white">
            Star Speed
            <input
              type="range"
              min="1"
              max="100"
              value={starSpeed}
              onChange={(e) => setStarSpeed(parseInt(e.target.value))}
              className="w-full"
              aria-label="Adjust star movement speed"
            />
          </label>

          <label className="block text-sm text-white">
            Star Size
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={starSize}
              onChange={(e) => setStarSize(parseFloat(e.target.value))}
              className="w-full"
              aria-label="Adjust star size"
            />
          </label>

          <label className="block text-sm text-white">
            Star Color
            <input
              type="color"
              value={starColor}
              onChange={(e) => setStarColor(e.target.value)}
              className="w-full h-8 rounded cursor-pointer"
              aria-label="Choose star color"
            />
          </label>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className={`text-4xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4 flex items-center gap-2`}>
          <BsStars />
          Dynamic Starry Background
        </h1>
        <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
          Customize the starry night sky animation using the controls on the right.
        </p>
      </div>
    </div>
  );
};

export default StarryBackground;