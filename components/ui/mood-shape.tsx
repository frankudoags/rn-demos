import { StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Canvas, Circle, Skia, Path } from "@shopify/react-native-skia";

const SIZE = 100;
const CX = SIZE / 2;
const CY = SIZE / 2;
const BASE_RADIUS = SIZE / 2;
const POINTS = 100;

const createMouthPath = (
  progress: number,
  cx: number,
  cy: number,
  size: number
) => {
  const norm = Math.max(0, Math.min(1, progress / 6));

  const mouthWidth = size * 0.12;

  const sad = size * 0.12;
  const happy = -size * 0.12;

  const curve = happy + (sad - happy) * norm;

  const x1 = cx - mouthWidth;
  const x2 = cx + mouthWidth;
  const cx2 = cx;
  const y = cy + size * 0.1;

  const path = Skia.Path.Make();
  path.moveTo(x1, y);
  path.quadTo(cx2, y + curve, x2, y);

  return path;
};

export const MoodShape = ({ progress }: { progress: number }) => {
  const [currentProgress, setCurrentProgress] = useState<number>(progress);
  const leftEyeX = CX - SIZE * 0.11;
  const rightEyeX = CX + SIZE * 0.11;
  const eyeY = CY - SIZE * 0.2;
  const eyeRadius = 5;

  const mouthPath = useMemo(() => {
    return createMouthPath(progress, CX, CY, SIZE);
  }, [progress]);

  return (
    <Canvas style={{ width: SIZE, height: SIZE, backgroundColor: "pink" }}>
      <Circle cx={leftEyeX} cy={eyeY} r={eyeRadius} color="black" />
      <Circle cx={rightEyeX} cy={eyeY} r={eyeRadius} color="black" />
      {/* mouth - curved line only */}
      <Path
        path={mouthPath}
        style="stroke"
        color="#000"
        strokeWidth={3}
        strokeCap="round"
      />
    </Canvas>
  );
};

const styles = StyleSheet.create({});

// import {
//   Canvas,
//   Circle,
//   Skia,
//   Path as SkiaPath,
// } from "@shopify/react-native-skia";
// import { useEffect, useMemo, useRef, useState } from "react";

// const SIZE = 100;
// const CX = SIZE / 2;
// const CY = SIZE / 2;
// const BASE_RADIUS = SIZE / 2;
// const POINTS = 100;

// function smoothArray(
//   arr: number[] | Float32Array,
//   iterations: number = 10
// ): Float32Array {
//   let temp: Float32Array =
//     arr instanceof Float32Array ? arr : new Float32Array(arr);
//   const len = temp.length;

//   for (let iter = 0; iter < iterations; iter++) {
//     const newArr = new Float32Array(len);
//     for (let i = 0; i < len; i++) {
//       const prev = temp[(i - 1 + len) % len];
//       const curr = temp[i];
//       const next = temp[(i + 1) % len];
//       newArr[i] = (prev + curr + next) / 3;
//     }
//     temp = newArr;
//   }
//   return temp;
// }

// function calculatePolygon(sides: number): Float32Array {
//   const rawRadii: number[] = [];
//   const sectorAngle = (2 * Math.PI) / sides;
//   const offset = 0;

//   for (let i = 0; i < POINTS; i++) {
//     const theta = (i / POINTS) * 2 * Math.PI;
//     let adjustedTheta = theta - offset;

//     adjustedTheta = adjustedTheta % sectorAngle;
//     if (adjustedTheta < 0) adjustedTheta += sectorAngle;
//     adjustedTheta -= sectorAngle / 2;

//     // Mathematical formula for a flat-sided polygon radius
//     const r =
//       (BASE_RADIUS * Math.cos(sectorAngle / 2)) / Math.cos(adjustedTheta);
//     rawRadii.push(r);
//   }

//   // Smooth edges based on side count
//   const smoothAmount = Math.max(5, 40 - sides * 4);
//   return smoothArray(rawRadii, smoothAmount);
// }

// function calculateCircle(): Float32Array {
//   const radii = new Float32Array(POINTS);
//   for (let i = 0; i < POINTS; i++) {
//     radii[i] = BASE_RADIUS;
//   }
//   return radii;
// }

// function calculateFlower(bumps: number): Float32Array {
//   const amplitude = 6; // Smaller amplitude for smaller bumps
//   const base = BASE_RADIUS - amplitude; // Shrink slightly so bumps don't clip
//   const offset = 0;
//   const radii = new Float32Array(POINTS);

//   for (let i = 0; i < POINTS; i++) {
//     const theta = (i / POINTS) * 2 * Math.PI;
//     // Add the cosine wave to the radius
//     const r = base + amplitude * Math.cos(bumps * (theta - offset));
//     radii[i] = r;
//   }
//   return radii;
// }

// function radiiToSkiaPath(radii: Float32Array) {
//   const path = Skia.Path.Make();
//   const angleOffset = -Math.PI / 2;

//   for (let i = 0; i < POINTS; i++) {
//     const angle = angleOffset + (i / POINTS) * 2 * Math.PI;
//     const r = radii[i];

//     const x = CX + r * Math.cos(angle);
//     const y = CY + r * Math.sin(angle);

//     if (i === 0) {
//       path.moveTo(x, y);
//     } else {
//       path.lineTo(x, y);
//     }
//   }
//   path.close();
//   return path;
// }

// function createMouthSkiaPath(
//   progress: number,
//   cx: number,
//   cy: number,
//   size: number
// ) {
//   const norm = Math.max(0, Math.min(progress / 6, 1));

//   const mouthWidth = size * 0.12;

//   const sad = size * 0.12;
//   const happy = -size * 0.12;

//   const curve = happy + (sad - happy) * norm;

//   const x1 = cx - mouthWidth;
//   const x2 = cx + mouthWidth;
//   const cx2 = cx;
//   const y = cy + size * 0.1;

//   const path = Skia.Path.Make();
//   path.moveTo(x1, y);
//   path.quadTo(cx2, y + curve, x2, y);
//   return path;
// }

// export function MoodShape({ progress }: { progress: number }) {
//   // progress: value from 0 to 1, map to shape types (0-5+)
//   const initialRadii = new Float32Array(POINTS).fill(BASE_RADIUS);
//   const [currentRadii, setCurrentRadii] = useState<Float32Array>(initialRadii);
//   const [currentProgress, setCurrentProgress] = useState<number>(progress);
//   const currentRadiiRef = useRef<Float32Array>(initialRadii);
//   const currentProgressRef = useRef<number>(progress);
//   const targetRadiiRef = useRef<Float32Array>(initialRadii);
//   const targetProgressRef = useRef<number>(progress);
//   const animationFrameRef = useRef<number | null>(null);

//   useEffect(() => {
//     // progress: integer value from 0 to 6
//     // 0 -> triangle
//     // 1 -> pentagon
//     // 2 -> hexagon
//     // 3 -> Soft-flower blob with 5 smooth bumps
//     // 4 -> circle
//     // 5 -> Soft-flower blob with 6 smooth bumps
//     // 6 -> Soft-flower blob with 8 smooth bumps
//     const shapeValue = Math.round(progress);
//     let target: Float32Array;

//     if (shapeValue === 0) {
//       // Triangle
//       target = calculatePolygon(3);
//     } else if (shapeValue === 1) {
//       // Pentagon
//       target = calculatePolygon(5);
//     } else if (shapeValue === 2) {
//       // Hexagon
//       target = calculatePolygon(6);
//     } else if (shapeValue === 3) {
//       // Soft Flower (5 bumps)
//       target = calculateFlower(5);
//     } else if (shapeValue === 4) {
//       // Circle
//       target = calculateCircle();
//     } else if (shapeValue === 5) {
//       // Soft Flower (6 bumps)
//       target = calculateFlower(6);
//     } else {
//       // Soft Flower (8 bumps)
//       target = calculateFlower(8);
//     }

//     targetRadiiRef.current = target;
//     targetProgressRef.current = progress;

//     // Animate to target
//     const animate = () => {
//       let changed = false;
//       const speed = 0.1;
//       const newRadii = new Float32Array(POINTS);

//       // Animate radii
//       for (let i = 0; i < POINTS; i++) {
//         const diff = targetRadiiRef.current[i] - currentRadiiRef.current[i];
//         if (Math.abs(diff) > 0.1) {
//           newRadii[i] = currentRadiiRef.current[i] + diff * speed;
//           changed = true;
//         } else {
//           newRadii[i] = targetRadiiRef.current[i];
//         }
//       }

//       // Animate progress
//       const progressDiff =
//         targetProgressRef.current - currentProgressRef.current;
//       let newProgress: number;
//       if (Math.abs(progressDiff) > 0.01) {
//         newProgress = currentProgressRef.current + progressDiff * speed;
//         changed = true;
//       } else {
//         newProgress = targetProgressRef.current;
//       }

//       // Update refs
//       currentRadiiRef.current = newRadii;
//       currentProgressRef.current = newProgress;

//       // Update state to trigger re-render
//       setCurrentRadii(newRadii);
//       setCurrentProgress(newProgress);

//       if (changed) {
//         animationFrameRef.current = requestAnimationFrame(animate);
//       } else {
//         animationFrameRef.current = null;
//       }
//     };

//     if (!animationFrameRef.current) {
//       animate();
//     }

//     return () => {
//       if (animationFrameRef.current) {
//         cancelAnimationFrame(animationFrameRef.current);
//         animationFrameRef.current = null;
//       }
//     };
//   }, [progress]);

//   const shapePath = useMemo(
//     () => radiiToSkiaPath(currentRadii),
//     [currentRadii]
//   );
//   const mouthPath = useMemo(
//     () => createMouthSkiaPath(currentProgress, CX, CY, SIZE),
//     [currentProgress]
//   );

//   const leftEyeX = CX - SIZE * 0.11;
//   const rightEyeX = CX + SIZE * 0.11;
//   const eyeY = CY - SIZE * 0.08;
//   const eyeRadius = 3;

//   return (
//     <Canvas style={{ width: SIZE, height: SIZE }}>
//       {/* Main shape */}
//       <SkiaPath path={shapePath} color="#fff" style="fill" />

//       {/* left eye */}
//       <Circle cx={leftEyeX} cy={eyeY} r={eyeRadius} color="#000" />

//       {/* right eye */}
//       <Circle cx={rightEyeX} cy={eyeY} r={eyeRadius} color="#000" />

//       {/* mouth - curved line only */}
//       <SkiaPath
//         path={mouthPath}
//         style="stroke"
//         color="#000"
//         strokeWidth={3}
//         strokeCap="round"
//       />
//     </Canvas>
//   );
// }