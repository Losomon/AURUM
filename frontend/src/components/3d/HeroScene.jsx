import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { PRIMARY_INT, PRIMARY_KEYLIGHT_INT, PRIMARY_SATELLITE_INT } from '@/lib/brandColors';

export default function HeroScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting — warm gold key, soft fill
    const ambient = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambient);
    const keyLight = new THREE.PointLight(0xd4a853, 3, 30);
    keyLight.position.set(5, 4, 6);
    scene.add(keyLight);
    const fillLight = new THREE.PointLight(0xfff8e7, 0.8, 20);
    fillLight.position.set(-6, 2, 3);
    scene.add(fillLight);
    const rimLight = new THREE.PointLight(0xc8a45e, 0.5, 15);
    rimLight.position.set(0, -4, -2);
    scene.add(rimLight);

    // Central hero gem — large, slow rotation
    const heroGeo = new THREE.OctahedronGeometry(1.4, 2);
    const heroMat = new THREE.MeshStandardMaterial({
      color: 0xc8a45e,
      metalness: 0.95,
      roughness: 0.05,
      envMapIntensity: 1,
    });
    const heroGem = new THREE.Mesh(heroGeo, heroMat);
    heroGem.position.set(2.5, 0, 0);
    scene.add(heroGem);

    // Secondary torus — ring element
    const torusGeo = new THREE.TorusGeometry(1.1, 0.06, 20, 100);
    const torusMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.05 });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(2.5, 0, 0);
    torus.rotation.x = Math.PI / 2.5;
    scene.add(torus);

    // Small satellites
    const satellites = [];
    const satPositions = [[-3.5, 1.5, -1], [3.8, 2.2, -2], [-2, -2, 0.5], [1, -2.5, -1]];
    satPositions.forEach(([x, y, z]) => {
      const geo = new THREE.OctahedronGeometry(0.22, 0);
      const mat = new THREE.MeshStandardMaterial({ color: 0xe8c547, metalness: 0.9, roughness: 0.1 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      scene.add(mesh);
      satellites.push({ mesh, baseY: y, phase: Math.random() * Math.PI * 2, speed: 0.3 + Math.random() * 0.3 });
    });

    // Gold dust particles
    const particleCount = 350;
    const pPositions = new Float32Array(particleCount * 3);
    const pSizes = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 22;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      pSizes[i] = Math.random() * 0.04 + 0.01;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.025, color: 0xc8a45e, transparent: true, opacity: 0.55, sizeAttenuation: true });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Mouse parallax
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    const handleMouse = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouse);

    const clock = new THREE.Clock();
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      // Hero gem — slow, calm rotation + mouse tilt
      heroGem.rotation.y = t * 0.12 + targetX * 0.3;
      heroGem.rotation.x = t * 0.07 + targetY * 0.2;
      heroGem.position.y = Math.sin(t * 0.4) * 0.18;

      // Torus orbits with mouse lean
      torus.rotation.y = t * 0.08 + targetX * 0.15;
      torus.rotation.z = t * 0.05;
      torus.position.y = heroGem.position.y;

      // Satellites float
      satellites.forEach((s) => {
        s.mesh.rotation.y = t * s.speed;
        s.mesh.position.y = s.baseY + Math.sin(t * s.speed + s.phase) * 0.25;
      });

      // Particles drift
      particles.rotation.y = t * 0.008;
      particles.rotation.x = t * 0.004;

      // Camera subtle shift
      camera.position.x = targetX * 0.35;
      camera.position.y = targetY * 0.2;
      camera.lookAt(scene.position);

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
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
}