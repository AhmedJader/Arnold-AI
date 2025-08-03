"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

interface AddWorkoutToCalendarProps {
  muscleName: string;
  workouts: { name: string; cues?: string }[];
}

export default function AddWorkoutToCalendar({ muscleName, workouts }: AddWorkoutToCalendarProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadScripts = async () => {
      const gapiScript = document.createElement("script");
      gapiScript.src = "https://apis.google.com/js/api.js";
      gapiScript.onload = () => {
        window.gapi.load("client", async () => {
          await window.gapi.client.init({ discoveryDocs: [DISCOVERY_DOC] });
          setLoaded(true);
        });
      };
      document.body.appendChild(gapiScript);

      const gisScript = document.createElement("script");
      gisScript.src = "https://accounts.google.com/gsi/client";
      gisScript.async = true;
      gisScript.defer = true;
      document.body.appendChild(gisScript);
    };

    loadScripts();
  }, []);

  const addEvents = async () => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: async (resp: any) => {
        if (resp.error) return console.error("Token error", resp);

        const today = new Date();
        const intervalDays = Math.floor(30 / workouts.length); // space evenly over a month

        for (let i = 0; i < workouts.length; i++) {
          const workout = workouts[i];
          const date = new Date(today);
          date.setDate(today.getDate() + i * intervalDays);

          const startTime = new Date(date);
          startTime.setHours(18, 0, 0); // 6:00 PM
          const endTime = new Date(startTime);
          endTime.setMinutes(startTime.getMinutes() + 30);

          const event = {
            summary: `Arnold AI 💪 ${workout.name}`,
            description: workout.cues || "Form tip coming soon!",
            start: {
              dateTime: startTime.toISOString(),
              timeZone: "America/Toronto",
            },
            end: {
              dateTime: endTime.toISOString(),
              timeZone: "America/Toronto",
            },
            recurrence: [
              "RRULE:FREQ=WEEKLY;COUNT=4", // repeat every week for 4 weeks
            ],
          };

          try {
            const result = await window.gapi.client.calendar.events.insert({
              calendarId: "primary",
              resource: event,
            });
            console.log(`✅ Added: ${workout.name}`, result.result.htmlLink);
          } catch (err) {
            console.error(`❌ Failed to add: ${workout.name}`, err);
          }
        }

        alert(`✅ ${workouts.length} recurring workouts scheduled over 1 month!`);
      },
    });

    tokenClient.requestAccessToken({ prompt: "consent" });
  };

  return (
    <button
      onClick={addEvents}
      disabled={!loaded}
      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded shadow-lg hover:from-purple-500 hover:to-pink-500 transition"
    >
      Schedule Arnold AI Month of Workouts
    </button>
  );
}
