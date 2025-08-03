"use client";

import { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  PoseLandmarker,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import { Card, CardContent } from "@/components/ui/card";

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
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => videoRef.current?.play();
      }

      const canvasCtx = canvasRef.current?.getContext("2d")!;
      const drawingUtils = new DrawingUtils(canvasCtx);

      interval = window.setInterval(async () => {
        if (!videoRef.current || !poseLandmarkerRef.current) return;

        const video = videoRef.current;
        const results = await poseLandmarkerRef.current.detectForVideo(
          video,
          performance.now()
        );

        canvasCtx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        canvasCtx.drawImage(video, 0, 0, canvasRef.current!.width, canvasRef.current!.height);

        if (results.landmarks.length > 0) {
          drawingUtils.drawLandmarks(results.landmarks[0]);
          drawingUtils.drawConnectors(results.landmarks[0]);

          const keypoints = results.landmarks[0].map((kp) => ({
            x: kp.x,
            y: kp.y,
            score: 1,
            name: "",
          }));

          // ---- Deduplication and throttling logic ----
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
      }, 2000); // Evaluate every 2 seconds
    };

    runPoseDetection();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      {/* Video + Canvas */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />
      </div>

      {/* Feedback Card */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
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
