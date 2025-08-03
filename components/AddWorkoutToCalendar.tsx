"use client";

import { useEffect, useState } from "react";

declare global {
    interface Window {
        gapi: any;
        google: any;
    }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!;

const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

export default function AddWorkoutToCalendar() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const loadScripts = async () => {
            // Load Google API (gapi)
            const gapiScript = document.createElement("script");
            gapiScript.src = "https://apis.google.com/js/api.js";
            gapiScript.onload = () => {
                window.gapi.load("client", async () => {
                    await window.gapi.client.init({
                        discoveryDocs: [DISCOVERY_DOC],
                    });
                    setLoaded(true);
                });
            };
            document.body.appendChild(gapiScript);

            // Load Google Identity Services (window.google.accounts)
            const gisScript = document.createElement("script");
            gisScript.src = "https://accounts.google.com/gsi/client";
            gisScript.async = true;
            gisScript.defer = true;
            document.body.appendChild(gisScript);
        };

        loadScripts();
    }, []);


    const addEvent = async () => {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: async (resp: any) => {
                if (resp.error) return console.error("Token error", resp);

                const event = {
                    summary: "Arnold AI 💪 Workout",
                    description: "Push/Pull 30-min session auto-added by Arnold AI.",
                    start: {
                        dateTime: new Date(Date.now() + 15 * 60000).toISOString(), // 15 min from now
                        timeZone: "America/Toronto",
                    },
                    end: {
                        dateTime: new Date(Date.now() + 45 * 60000).toISOString(), // +30min
                        timeZone: "America/Toronto",
                    },
                };

                try {
                    const result = await window.gapi.client.calendar.events.insert({
                        calendarId: "primary",
                        resource: event,
                    });
                    alert("Workout added to calendar: " + result.result.htmlLink);
                } catch (err) {
                    console.error("Insert error", err);
                }
            },
        });

        tokenClient.requestAccessToken({ prompt: "consent" });
    };

    return (
        <button
            onClick={addEvent}
            disabled={!loaded}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded shadow-lg hover:from-purple-500 hover:to-pink-500"
        >
            Add Arnold AI Workout to Google Calendar
        </button>
    );
}
