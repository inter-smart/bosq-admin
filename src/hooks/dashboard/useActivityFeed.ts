import { useState, useEffect, useRef } from "react";
import { Activity, fetchActivityFeed, getSSEUrl } from "@/services/dashboard/activityApi";

const MAX_DISPLAYED = 20;

export function useActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Initial load via REST
    fetchActivityFeed()
      .then((r) => {
        if (r.success) setActivities(r.data);
      })
      .catch((e: any) => setError(e?.message ?? "Failed to load activity feed"))
      .finally(() => setLoading(false));

    // Real-time updates via SSE
    const es = new EventSource(getSSEUrl());
    esRef.current = es;

    es.onmessage = (event) => {
      try {
        const activity: Activity = JSON.parse(event.data);
        setActivities((prev) => [activity, ...prev].slice(0, MAX_DISPLAYED));
      } catch {
        // Malformed event — ignore
      }
    };

    es.onerror = () => {
      // EventSource reconnects automatically; log for debugging only
      console.warn("[ActivityFeed] SSE connection error — browser will retry");
    };

    return () => {
      es.close();
    };
  }, []);

  return { activities, loading, error };
}
