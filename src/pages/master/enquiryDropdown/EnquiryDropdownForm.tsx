import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    fetchEnquiryDropdownById,
    createEnquiryDropdown,
    updateEnquiryDropdown,
} from "@/services/master/enquiryDropdownApi";
import { Switch } from "@/components/ui/switch";
import { enquiryDropdownSchema, EnquiryDropdownFormData } from "@/schemas/enquiryDropdownSchema";

export default function EnquiryDropdownForm() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditing);

    const form = useForm<EnquiryDropdownFormData>({
        resolver: zodResolver(enquiryDropdownSchema),
        defaultValues: {
            title: "",
            title_ar: "",
            sort_order: 1,
            status: true,
        },
    });

    useEffect(() => {
        if (isEditing && id) {
            loadData(parseInt(id));
        }
    }, [id, isEditing]);

    const loadData = async (itemId: number) => {
        try {
            setInitialLoading(true);
            const response = await fetchEnquiryDropdownById(itemId);
            const data = response.data;

            if (data) {
                form.reset({
                    title: data.title || "",
                    title_ar: data.title_ar || "",
                    sort_order: data.sort_order || 1,
                    status: data.status ?? true,
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load item data",
                variant: "destructive",
            });
        } finally {
            setInitialLoading(false);
        }
    };

    const onSubmit = async (data: EnquiryDropdownFormData) => {
        try {
            setLoading(true);
            if (isEditing && id) {
                await updateEnquiryDropdown(parseInt(id), data);
                toast({ title: "Success", description: "Updated successfully" });
            } else {
                await createEnquiryDropdown(data);
                toast({ title: "Success", description: "Created successfully" });
            }
            navigate("/master/enquiry-dropdown");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Something went wrong",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate("/master/enquiry-dropdown")}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">
                        {isEditing ? "Edit" : "Add"} Enquiry Dropdown Item
                    </h1>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="title_ar"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title (AR)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="أدخل العنوان" {...field} dir="rtl" value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="sort_order"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sort Order</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Status</FormLabel>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/master/enquiry-dropdown")}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            <Save className="mr-2 h-4 w-4" />
                            {isEditing ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
