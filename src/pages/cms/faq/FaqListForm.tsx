import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchFaqListById,
  createFaqList,
  updateFaqList,
  FaqList,
} from "@/services/cms/faq/faqListApi";
import { fetchFaqCategoryList } from "@/services/cms/faq/faqCategoryApi";
import { Switch } from "@/components/ui/switch";
import { FaqListFormData, faqListSchema } from "@/schemas/faqSchema";
import { RichTextEditor } from "@/components/common/RichTextEditor";

export default function FaqListForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [categories, setCategories] = useState<
    Array<{ id: number; title: string }>
  >([]);

  const form = useForm<FaqListFormData>({
    resolver: zodResolver(faqListSchema),
    defaultValues: {
      question: "",
      question_ar: "",
      answer: "",
      answer_ar: "",
      category: undefined,
      sort_order: 1,
      status: true,
    },
  });

  useEffect(() => {
    loadCategories();
    if (isEditing && id) {
      loadFaqData(parseInt(id));
    }
  }, [id, isEditing]);

  const loadCategories = async () => {
    try {
      const response = await fetchFaqCategoryList(1, 100);
      const activeCategories = response.data.list.filter((cat) => cat.status);
      setCategories(
        activeCategories.map((cat) => ({ id: cat?.id!, title: cat.title }))
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    }
  };

  const loadFaqData = async (itemId: number) => {
    try {
      setInitialLoading(true);
      const response = await fetchFaqListById(itemId);
      const data = response.data;

      if (data) {
        form.reset({
          question: data.question || "",
          question_ar: data.question_ar || "",
          answer: data.answer || "",
          answer_ar: data.answer_ar || "",
          category: data.category || 0,
          sort_order: data.sort_order || 0,
          status: data.status ?? true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load FAQ data",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: FaqListFormData) => {
    try {
      setLoading(true);

      const payload:  FaqList = {
        question: data.question,
        question_ar: data.question_ar,
        answer: data.answer.toString(),
        answer_ar: data.answer_ar.toString(),
        category: data.category,
        sort_order: data.sort_order,
        status: data.status,
      };

      if (isEditing && id) {
        await updateFaqList(parseInt(id), payload);
        toast({
          title: "Success",
          description: "FAQ updated successfully",
        });
      } else {
        await createFaqList(payload);
        toast({
          title: "Success",
          description: "FAQ created successfully",
        });
      }

      navigate("/faq-list");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.message || `Failed to ${isEditing ? "update" : "create"} FAQ`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading FAQ data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/faq-list")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit" : "Add"} FAQ
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update" : "Create a new"} FAQ item
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>FAQ Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter FAQ question" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="answer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Answer</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            placeholder="Enter FAQ answer"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Arabic Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="question_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question (AR)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل سؤال الأسئلة الشائعة"
                            {...field}
                            dir="rtl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="answer_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Answer (AR)</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            placeholder="أدخل إجابة الأسئلة الشائعة"
                            {...field}
                            dir="rtl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Category Field - Full Width */}
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(parseInt(value));
                          form.trigger("category");
                        }}
                        value={field.value ? String(field.value) : ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={String(category.id)}
                            >
                              {category.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FAQ Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sort_order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
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
                        <FormDescription>
                          Enable or disable this FAQ
                        </FormDescription>
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
              onClick={() => navigate("/faq-list")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
