import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

// Runway spotlight stage for featured products
export default function SpotlightScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 1, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Stage floor — reflective plane
    const floorGeo = new THREE.PlaneGeometry(20, 20);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x080808,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.5,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.2;
    scene.add(floor);

    // Spotlights
    const spot1 = new THREE.SpotLight(0xd4a853, 5, 25, Math.PI / 8, 0.6);
    spot1.position.set(0, 8, 2);
    scene.add(spot1);
    const spot2 = new THREE.SpotLight(0xfff8e7, 1.5, 20, Math.PI / 10, 0.8);
    spot2.position.set(-4, 6, 4);
    scene.add(spot2);
    scene.add(new THREE.AmbientLight(0xffffff, 0.05));

    // Showcase gem on stage
    const gem = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.0, 1),
      new THREE.MeshStandardMaterial({ color: 0xc8a45e, metalness: 0.95, roughness: 0.05 })
    );
    gem.position.set(0, 0, 0);
    scene.add(gem);

    // Orbiting ring
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.5, 0.05, 16, 100),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1.0, roughness: 0.0 })
    );
    ring.rotation.x = Math.PI / 4;
    scene.add(ring);

    // Gold line particles (runway feel)
    const lineCount = 60;
    const linePositions = new Float32Array(lineCount * 6);
    for (let i = 0; i < lineCount; i++) {
      const x = (Math.random() - 0.5) * 16;
      const y = Math.random() * 4 - 2.5;
      const z = (Math.random() - 0.5) * 6 - 2;
      linePositions[i * 6] = x; linePositions[i * 6 + 1] = y; linePositions[i * 6 + 2] = z;
      linePositions[i * 6 + 3] = x; linePositions[i * 6 + 4] = y; linePositions[i * 6 + 5] = z + 0.3;
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0xc8a45e, transparent: true, opacity: 0.2 });
    scene.add(new THREE.LineSegments(lineGeo, lineMat));

    const clock = new THREE.Clock();
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      gem.rotation.y = t * 0.18;
      gem.rotation.x = Math.sin(t * 0.3) * 0.15;
      gem.position.y = Math.sin(t * 0.5) * 0.25;
      ring.rotation.y = t * 0.1;
      ring.rotation.z = t * 0.06;
      ring.position.y = gem.position.y;
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
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
}