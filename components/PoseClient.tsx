"use client";

import { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  PoseLandmarker,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import { Card, CardContent } from "@/components/ui/card";

const KEYPOINT_NAMES = [
  "nose", "left_eye_inner", "left_eye", "left_eye_outer",
  "right_eye_inner", "right_eye", "right_eye_outer",
  "left_ear", "right_ear", "mouth_left", "mouth_right",
  "left_shoulder", "right_shoulder", "left_elbow", "right_elbow",
  "left_wrist", "right_wrist", "left_pinky", "right_pinky",
  "left_index", "right_index", "left_thumb", "right_thumb",
  "left_hip", "right_hip", "left_knee", "right_knee",
  "left_ankle", "right_ankle", "left_heel", "right_heel",
  "left_foot_index", "right_foot_index"
];

export default function PoseClient() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [feedback, setFeedback] = useState("");
  const [audio, setAudio] = useState("");
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const lastSentPoseRef = useRef<string | null>(null);
  const lastSentTimeRef = useRef<number>(0);

  useEffect(() => {
    let interval: number;

    const runPoseDetection = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => videoRef.current?.play();
      }

      interval = window.setInterval(async () => {
        if (!videoRef.current || !poseLandmarkerRef.current) return;

        const video = videoRef.current;
        const results = await poseLandmarkerRef.current.detectForVideo(
          video,
          performance.now()
        );

        const canvas = canvasRef.current;
        if (!canvas) return;

        // Match canvas size to video for accurate drawing
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (results.landmarks.length > 0) {
          const landmarks = results.landmarks[0];
          const drawingUtils = new DrawingUtils(ctx);
          drawingUtils.drawLandmarks(landmarks);
          drawingUtils.drawConnectors(landmarks);

          const keypoints = landmarks.map((kp, i) => ({
            x: kp.x,
            y: kp.y,
            score: 1, // fallback since NormalizedLandmark has no score
            name: KEYPOINT_NAMES[i] ?? `kp-${i}`,
          }));

          const now = Date.now();
          const poseSignature = JSON.stringify(
            keypoints.map((k) => ({
              x: parseFloat(k.x.toFixed(2)),
              y: parseFloat(k.y.toFixed(2)),
            }))
          );

          const poseChanged = poseSignature !== lastSentPoseRef.current;
          const cooldownPassed = now - lastSentTimeRef.current > 12000;

          if (!poseChanged || !cooldownPassed) return;
          lastSentPoseRef.current = poseSignature;
          lastSentTimeRef.current = now;

          const res = await fetch("/api/rehab-feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keypoints }),
          });

          const data = await res.json();
          setFeedback(data.feedback || "");
          setAudio(data.base64Audio || "");
        }
      }, 2000);
    };

    runPoseDetection();
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        className="absolute w-full h-full object-cover z-0"
        autoPlay
        muted
        playsInline
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
      />

      {/* Feedback Card */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-md px-4">
        {feedback && (
          <Card className="backdrop-blur-md bg-white/10 border border-white/20 text-white shadow-xl">
            <CardContent className="p-4">
              <p className="text-lg font-medium">{feedback}</p>
            </CardContent>
          </Card>
        )}
        {audio && <audio src={`data:audio/mp3;base64,${audio}`} autoPlay />}
      </div>
    </div>
  );
}
