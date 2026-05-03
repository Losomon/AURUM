import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

// Ambient 3D environment for product detail page
export default function ProductScene({ color = '#c8a45e' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Dramatic spotlight feel
    const spotLight = new THREE.SpotLight(0xd4a853, 4, 30, Math.PI / 6, 0.5);
    spotLight.position.set(0, 8, 4);
    scene.add(spotLight);
    const fillLight = new THREE.PointLight(0xffffff, 0.3, 15);
    fillLight.position.set(-4, 0, 4);
    scene.add(fillLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.1));

    // Central showcase gem representing the product essence
    const gemGeo = new THREE.IcosahedronGeometry(0.9, 1);
    const gemMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness: 0.92,
      roughness: 0.08,
      transparent: true,
      opacity: 0.85,
    });
    const gem = new THREE.Mesh(gemGeo, gemMat);
    gem.position.set(-1.8, 0, 0);
    scene.add(gem);

    // Orbiting ring
    const ringGeo = new THREE.TorusGeometry(1.35, 0.04, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.0 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(-1.8, 0, 0);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    // Floating mini gems
    const miniGems = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const r = 2.5;
      const g = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.12, 0),
        new THREE.MeshStandardMaterial({ color: 0xe8c547, metalness: 0.9, roughness: 0.1 })
      );
      g.position.set(-1.8 + Math.cos(angle) * r, Math.sin(angle) * r * 0.5, -1);
      scene.add(g);
      miniGems.push({ mesh: g, angle, baseAngle: angle });
    }

    // Particle field
    const pCount = 200;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 14;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.02, color: 0xc8a45e, transparent: true, opacity: 0.5 });
    scene.add(new THREE.Points(pGeo, pMat));

    const clock = new THREE.Clock();
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      gem.rotation.y = t * 0.15;
      gem.rotation.x = t * 0.08;
      gem.position.y = Math.sin(t * 0.5) * 0.15;
      ring.rotation.y = t * 0.1;
      ring.position.y = gem.position.y;

      miniGems.forEach((mg, i) => {
        mg.angle = mg.baseAngle + t * 0.25;
        mg.mesh.position.x = -1.8 + Math.cos(mg.angle) * 2.5;
        mg.mesh.position.y = Math.sin(mg.angle) * 1.2;
        mg.mesh.rotation.y = t * 0.8;
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [color]);

  return <div ref={containerRef} className="absolute inset-0 opacity-40" />;
}