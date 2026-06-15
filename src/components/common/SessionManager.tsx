import { useEffect, useRef, useCallback } from "react";
import { logout, refreshSession, isAuthenticated } from "@/services/auth/authApi";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const CHECK_INTERVAL_MS = 60 * 1000;
const REFRESH_THRESHOLD_MS = 5 * 60 * 1000;
const WARNING_THRESHOLD_MS = 2 * 60 * 1000;
const ACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;
const THROTTLE_MS = 10 * 1000;



const ACTIVITY_EVENTS: (keyof DocumentEventMap)[] = [
  "mousemove",
  "keydown",
  "mousedown",
  "touchstart",
  "scroll",
  "click",
];


export default function SessionManager() {
  const navigate = useNavigate();
  const lastActivityRef = useRef<number>(Date.now());
  const lastThrottleRef = useRef<number>(0);
  const warningShownRef = useRef<boolean>(false);

  // ── Update last activity timestamp (throttled) ──────────────────────────
  const handleActivity = useCallback(() => {
    const now = Date.now();
    if (now - lastThrottleRef.current > THROTTLE_MS) {
      lastActivityRef.current = now;
      lastThrottleRef.current = now;
      // If user becomes active again after warning, reset the flag
      warningShownRef.current = false;
    }
  }, []);

  // ── Register and remove activity listeners ───────────────────────────────
  useEffect(() => {
    ACTIVITY_EVENTS.forEach((event) =>
      document.addEventListener(event, handleActivity, { passive: true })
    );
    return () => {
      ACTIVITY_EVENTS.forEach((event) =>
        document.removeEventListener(event, handleActivity)
      );
    };
  }, [handleActivity]);

  // ── Periodic session check ────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(async () => {
      // If token is already fully gone, force logout immediately
      if (!isAuthenticated()) {
        clearInterval(interval);
        navigate("/login");
        return;
      }

      const expiresAtStr = localStorage.getItem("token_expires_at");
      if (!expiresAtStr) return;

      const expiresAt = new Date(expiresAtStr).getTime();
      const now = Date.now();
      const msUntilExpiry = expiresAt - now;
      const msSinceActivity = now - lastActivityRef.current;
      const userIsActive = msSinceActivity < ACTIVITY_TIMEOUT_MS;

      // ── Case 1: Token within 5 min of expiry AND user is active → refresh ──
      if (msUntilExpiry < REFRESH_THRESHOLD_MS && msUntilExpiry > 0 && userIsActive) {
        const success = await refreshSession();
        if (success) {
          warningShownRef.current = false;
          console.info("[SessionManager] Session silently refreshed.");
        } else {
          // Refresh failed while user is active — log out gracefully
          handleLogout("Your session could not be renewed. Please log in again.");
        }
        return;
      }

      // ── Case 2: Token within 2 min of expiry AND user is INACTIVE → warn ──
      if (
        msUntilExpiry < WARNING_THRESHOLD_MS &&
        msUntilExpiry > 0 &&
        !userIsActive &&
        !warningShownRef.current
      ) {
        warningShownRef.current = true;
        toast({
          title: "Session Expiring Soon",
          description:
            "You will be logged out in less than 2 minutes due to inactivity. Move your mouse or press any key to extend your session.",
          duration: WARNING_THRESHOLD_MS,
          variant: "destructive",
        });
        return;
      }

      // ── Case 3: Token fully expired ─────────────────────────────────────
      if (msUntilExpiry <= 0) {
        handleLogout("Your session has expired. Please log in again.");
      }
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // ── Logout helper ─────────────────────────────────────────────────────────
  function handleLogout(message: string) {
    logout();
    toast({
      title: "Logged Out",
      description: message,
      variant: "destructive",
    });
    navigate("/login");
  }

  // Renders nothing — this is a pure side-effect component
  return null;
}
