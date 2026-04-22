import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { mailerTabSchema, type MailerTabFormData } from "@/schemas/mailerSettingsSchema";
import { fetchMailerSettings, updateMailerSetting, type MailerSetting, type MailerType } from "@/services/common/mailerSettingsApi";

const MAILER_TABS: { type: MailerType; label: string }[] = [
  { type: "admin", label: "Admin" },
  { type: "auth", label: "Auth" },
  { type: "enquiries", label: "Enquiries" },
  { type: "newsletter", label: "Newsletter" },
  { type: "orders", label: "Orders" },
];

interface MailerTabFormProps {
  type: MailerType;
  label: string;
  initialData?: MailerSetting;
  onSaved: (updated: MailerSetting) => void;
}

function MailerTabForm({ type, label, initialData, onSaved }: MailerTabFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<MailerTabFormData>({
    resolver: zodResolver(mailerTabSchema),
    defaultValues: {
      to_email: "",
      cc_emails: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        to_email: initialData.to_email ?? "",
        cc_emails: initialData.cc_emails ?? "",
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: MailerTabFormData) => {
    setLoading(true);
    try {
      const result = await updateMailerSetting(type, {
        to_email: data.to_email,
        cc_emails: data.cc_emails || null,
      });
      onSaved(result.data);
      toast({ title: "Saved", description: `${label} mailer settings updated.` });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message ?? "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <FormField
          control={form.control}
          name="to_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                From <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input type="email" placeholder="recipient@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cc_emails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CC</FormLabel>
              <FormControl>
                <Input type="text" placeholder="cc1@example.com, cc2@example.com" {...field} />
              </FormControl>
              <FormDescription>Optional. Comma-separated, no spaces — e.g. cc1@example.com,cc2@example.com</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Saving..." : `Save ${label} Settings`}
        </Button>
      </form>
    </Form>
  );
}

export default function ManageMailers() {
  const [settings, setSettings] = useState<MailerSetting[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchMailerSettings();
        setSettings(res.data);
      } catch (err: any) {
        toast({
          title: "Error",
          description: err?.message ?? "Failed to load mailer settings.",
          variant: "destructive",
        });
      } finally {
        setInitialLoading(false);
      }
    };
    load();
  }, []);

  const handleSaved = (updated: MailerSetting) => {
    setSettings((prev) => prev.map((s) => (s.type === updated.type ? updated : s)));
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Mailers</CardTitle>
        </CardHeader>
        <CardContent>
          {initialLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading...</div>
          ) : (
            <Tabs defaultValue="admin">
              <TabsList>
                {MAILER_TABS.map(({ type, label }) => (
                  <TabsTrigger key={type} value={type}>
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {MAILER_TABS.map(({ type, label }) => (
                <TabsContent key={type} value={type}>
                  <MailerTabForm type={type} label={label} initialData={settings.find((s) => s.type === type)} onSaved={handleSaved} />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
