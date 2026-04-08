import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Briefcase, User, Calendar, Loader2 } from "lucide-react";
import { useActivityFeed } from "@/hooks/dashboard/useActivityFeed";
import { Activity } from "@/services/dashboard/activityApi";

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "blog":
      return FileText;
    case "job":
      return Briefcase;
    case "user":
      return User;
    default:
      return Calendar;
  }
};

const getStatusBadge = (status?: Activity["status"]) => {
  if (!status) return null;

  const variants = {
    published: "success",
    draft: "secondary",
    pending: "warning",
    active: "info",
  } as const;

  return (
    <Badge variant={variants[status] as any} className="text-xs">
      {status}
    </Badge>
  );
};

const formatTimestamp = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
};

export function ActivityFeed() {
  const { activities, loading, error } = useActivityFeed();

  return (
    <Card className="shadow-healthcare-sm">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <CardDescription>
          Latest updates across your content management system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {error && (
          <p className="text-sm text-destructive text-center py-4">{error}</p>
        )}
        {!loading && !error && activities.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No activity yet.
          </p>
        )}
        {activities.map((activity) => {
          const IconComponent = getActivityIcon(activity.type);
          return (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <IconComponent className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {activity.title}
                  </p>
                  {getStatusBadge(activity.status)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {activity.description}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Avatar className="w-4 h-4">
                    <AvatarFallback className="text-xs">
                      {activity.user.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {activity.user} • {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
