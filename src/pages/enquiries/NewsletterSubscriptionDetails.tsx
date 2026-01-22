import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Trash2, Mail, Calendar, Copy } from "lucide-react";
import {
  fetchNewsletterSubscriptionById,
  deleteNewsletterSubscription,
  NewsletterSubscription,
} from "@/services/enquiries/newsletterApi";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsletterSubscriptionDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<NewsletterSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (id) {
      loadSubscription(parseInt(id));
    }
  }, [id]);

  const loadSubscription = async (subscriptionId: number) => {
    try {
      setLoading(true);
      const response = await fetchNewsletterSubscriptionById(subscriptionId);
      if (response.success) {
        setSubscription(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load newsletter subscription details",
        variant: "destructive",
      });
      navigate("/newsletter-subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!subscription) return;

    try {
      await deleteNewsletterSubscription(subscription.id);
      toast({
        title: "Success",
        description: "Newsletter subscription deleted successfully",
      });
      navigate("/newsletter-subscriptions");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete newsletter subscription",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const copyEmail = () => {
    if (subscription) {
      navigator.clipboard.writeText(subscription.email);
      toast({
        title: "Copied",
        description: "Email address copied to clipboard",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-muted-foreground">Newsletter subscription not found</p>
        <Button onClick={() => navigate("/newsletter-subscriptions")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/newsletter-subscriptions")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Newsletter Subscription Details</h1>
            <p className="text-sm text-muted-foreground">
              Subscription #{subscription.id}
            </p>
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Subscriber Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Subscriber Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${subscription.email}`}
                    className="text-base text-primary hover:underline"
                  >
                    {subscription.email}
                  </a>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyEmail}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <Badge variant="secondary">Active Subscriber</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Subscription Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Subscribed At</p>
              <p className="text-base">
                {new Date(subscription.createdAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(subscription.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p className="text-base">
                {new Date(subscription.updatedAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(subscription.updatedAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <Separator />

            <div>
              <Badge variant="outline">Subscription ID: {subscription.id}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button variant="outline" asChild>
            <a href={`mailto:${subscription.email}`}>
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </a>
          </Button>
          <Button variant="outline" onClick={copyEmail}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Email
          </Button>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              newsletter subscription for {subscription.email} and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
