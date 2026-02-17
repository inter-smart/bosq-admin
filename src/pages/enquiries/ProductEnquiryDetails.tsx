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
import {
  ArrowLeft,
  Trash2,
  Mail,
  Phone,
  User,
  MessageSquare,
  Calendar,
  Package,
  MapPin,
} from "lucide-react";
import {
  fetchProductEnquiryById,
  deleteProductEnquiry,
  ProductEnquiry,
} from "@/services/enquiries/productEnquiriesApi";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductEnquiryDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [enquiry, setEnquiry] = useState<ProductEnquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);


  useEffect(() => {
    if (id) {
      loadEnquiry(parseInt(id));
    }
  }, [id]);

  const loadEnquiry = async (enquiryId: number) => {
    try {
      setLoading(true);
      const response = await fetchProductEnquiryById(enquiryId);
      if (response.success) {
        setEnquiry(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load product enquiry details",
        variant: "destructive",
      });
      navigate("/product-enquiries");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!enquiry) return;

    try {
      await deleteProductEnquiry(enquiry.id);
      toast({
        title: "Success",
        description: "Product enquiry deleted successfully",
      });
      navigate("/product-enquiries");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product enquiry",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
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

  if (!enquiry) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-muted-foreground">Product enquiry not found</p>
        <Button onClick={() => navigate("/product-enquiries")}>
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
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/product-enquiries")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Product Enquiry Details</h1>
            <p className="text-sm text-muted-foreground">
              Enquiry #{enquiry.id}
            </p>
          </div>
        </div>
        <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Name
                </p>
                <p className="text-base">{enquiry.name}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <a
                  href={`mailto:${enquiry.email}`}
                  className="text-base text-primary hover:underline"
                >
                  {enquiry.email}
                </a>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Phone
                </p>
                {enquiry.phone ? (
                  <a
                    href={`tel:${enquiry.phone}`}
                    className="text-base text-primary hover:underline"
                  >
                    {enquiry.phone}
                  </a>
                ) : (
                  <p className="text-base text-muted-foreground">
                    Not provided
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  City
                </p>
                <p className="text-base">{enquiry.city || "Not provided"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product & Submission Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product & Submission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Product Image */}
            {enquiry.media_path ? (
              <div className="overflow-hidden rounded-lg border">
                <img
                  src={`${import.meta.env.VITE_IMAGE_URL}/${enquiry.media_path}`}
                  alt={enquiry.product.title}
                  className="h-52 w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-52 items-center justify-center rounded-lg border bg-muted text-sm text-muted-foreground">
                No product image available
              </div>
            )}

            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Interested Product
              </p>
              {enquiry.product ? (
                <p className="text-lg font-semibold text-primary">
                  {enquiry.product.title}
                </p>
              ) : (
                <p className="text-base text-muted-foreground">
                  Product information unavailable
                </p>
              )}
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Submitted At
              </p>
              <p className="text-base">
                {new Date(enquiry.createdAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(enquiry.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Last Updated
              </p>
              <p className="text-base">
                {new Date(enquiry.updatedAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(enquiry.updatedAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <Separator />

            <div>
              <Badge variant="outline">Enquiry ID: {enquiry.id}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted p-4">
            <p className="whitespace-pre-wrap text-base">{enquiry.message}</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button variant="outline" asChild>
            <a href={`mailto:${enquiry.email}`}>
              <Mail className="mr-2 h-4 w-4" />
              Reply via Email
            </a>
          </Button>
          {enquiry.phone && (
            <Button variant="outline" asChild>
              <a href={`tel:${enquiry.phone}`}>
                <Phone className="mr-2 h-4 w-4" />
                Call
              </a>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product enquiry from {enquiry.name} and remove all associated
              data.
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
