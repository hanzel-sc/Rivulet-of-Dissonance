import React, { useEffect, useRef } from 'react';

function SnowCanvas() {
  const canvasRef = useRef(null);
  const maxDist = 100;
  const points = [];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function Point() {
      this.x = Math.random() * (canvas.width + maxDist) - (maxDist / 2);
      this.y = Math.random() * (canvas.height + maxDist) - (maxDist / 2);
      this.z = (Math.random() * 0.5) + 0.5;
      this.vx = ((Math.random() * 0.6) - 0.3) * this.z;
      this.vy = ((Math.random() * 0.7) + 0.3) * this.z;
      this.fill = `rgba(255,255,255,${(0.3 * Math.random()) + 0.4})`;
      this.dia = ((Math.random() * 3) + 2) * this.z;
    }

    function generatePoints(amount) {
      for (let i = 0; i < amount; i++) {
        points.push(new Point());
      }
    }

    function draw(obj) {
      ctx.beginPath();
      ctx.fillStyle = obj.fill;
      ctx.shadowColor = 'white';
      ctx.shadowBlur = 4;
      ctx.arc(obj.x, obj.y, obj.dia, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    function update(obj) {
      obj.x += obj.vx;
      obj.y += obj.vy;

      if (obj.x > canvas.width + (maxDist / 2)) obj.x = -(maxDist / 2);
      else if (obj.x < -(maxDist / 2)) obj.x = canvas.width + (maxDist / 2);

      if (obj.y > canvas.height + (maxDist / 2)) obj.y = -(maxDist / 2);
      else if (obj.y < -(maxDist / 2)) obj.y = canvas.height + (maxDist / 2);
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      points.forEach(p => {
        draw(p);
        update(p);
      });
      requestAnimationFrame(animate);
    }

    generatePoints(700);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="canvas"
      className="snow"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 0,
        width: '100%',
        height: '100vh',
      }}
    />
  );
}

export default SnowCanvas;
