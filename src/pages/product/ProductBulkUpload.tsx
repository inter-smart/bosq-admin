import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Clock,
  Zap,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  validateBulkUpload,
  approveBulkUpload,
  getBulkUploadStatus,
  type ValidationError,
  type ValidationResult,
  type UploadJobStatus,
} from "@/services/product/bulkUploadApi";

/* ─── Types ──────────────────────────────────────────────────────────────── */

type Phase = "idle" | "validating" | "validated_fail" | "validated_ok" | "approving" | "monitoring";

/* ─── Helper: Step Indicator ─────────────────────────────────────────────── */

function StepIndicator({ phase }: { phase: Phase }) {
  const steps = [
    { key: "upload", label: "Upload File" },
    { key: "validate", label: "Validate" },
    { key: "approve", label: "Approve" },
    { key: "complete", label: "Processing" },
  ];

  const activeStep =
    phase === "idle" ? 0
    : phase === "validating" ? 1
    : phase === "validated_fail" ? 1
    : phase === "validated_ok" ? 2
    : phase === "approving" ? 2
    : 3;

  return (
    <div className="flex items-center w-full mb-8">
      {steps.map((step, idx) => (
        <div key={step.key} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                idx < activeStep
                  ? "bg-primary border-primary text-primary-foreground"
                  : idx === activeStep
                  ? "border-primary text-primary bg-primary/10"
                  : "border-muted-foreground/30 text-muted-foreground"
              }`}
            >
              {idx < activeStep ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
            </div>
            <span
              className={`text-xs mt-1 whitespace-nowrap ${
                idx <= activeStep ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 mt-[-14px] transition-colors ${
                idx < activeStep ? "bg-primary" : "bg-muted-foreground/20"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Template Generator ─────────────────────────────────────────────────── */

function downloadTemplate() {
  const wb = XLSX.utils.book_new();

  // ── Sheet 1: product_base ──────────────────────────────────────────────
  const baseHeaders = [
    "slug", "title", "title_ar", "description", "description_ar",
    "enhance_title", "enhance_title_ar", "details", "details_ar",
    "details_points", "details_points_ar", "additional_details",
    "additional_details_ar", "sort_order", "status",
  ];
  const baseSample = [
    "executive-chair",
    "Executive Chair",
    "كرسي تنفيذي",
    "Premium ergonomic office chair with lumbar support",
    "كرسي مكتبي مريح وعالي الجودة مع دعم قطني",
    "Best-in-class Executive Chair",
    "أفضل كرسي تنفيذي في فئته",
    "Crafted from premium materials for all-day comfort.",
    "مصنوع من مواد فاخرة لراحة طوال اليوم.",
    "• Adjustable lumbar support\n• 4D armrests\n• Breathable mesh back",
    "• دعم قطني قابل للتعديل\n• مسند ذراع رباعي الأبعاد\n• ظهر شبكي",
    "",
    "",
    1,
    true,
  ];

  const baseWs = XLSX.utils.aoa_to_sheet([baseHeaders, baseSample]);
  // Style the header row width hints
  baseWs["!cols"] = baseHeaders.map(() => ({ wch: 28 }));
  XLSX.utils.book_append_sheet(wb, baseWs, "product_base");

  // ── Sheet 2: product_models ────────────────────────────────────────────
  const modelHeaders = [
    "base_slug", "slug", "title", "title_ar", "code", "base_price", "sort_order", "status",
  ];
  const modelSample = [
    "executive-chair",
    "model-black",
    "Black Edition",
    "الإصدار الأسود",
    "EC-BLK",
    299.99,
    1,
    true,
  ];
  const modelSample2 = [
    "executive-chair",
    "model-white",
    "White Edition",
    "الإصدار الأبيض",
    "EC-WHT",
    319.99,
    2,
    true,
  ];

  const modelWs = XLSX.utils.aoa_to_sheet([modelHeaders, modelSample, modelSample2]);
  modelWs["!cols"] = modelHeaders.map(() => ({ wch: 22 }));
  XLSX.utils.book_append_sheet(wb, modelWs, "product_models");

  // ── Sheet 3: product_variants ──────────────────────────────────────────
  const variantHeaders = [
    "base_slug", "model_slug", "sku", "product_code", "title", "title_ar",
    "design_title", "design_title_ar", "price", "stock", "is_primary",
    "sort_order", "status", "categories", "attributes",
  ];
  const variantSample1 = [
    "executive-chair",
    "model-black",
    "EC-BLK-M",
    "EC-BLK-M-001",
    "Medium",
    "متوسط",
    "Classic Black",
    "أسود كلاسيك",
    349.99,
    50,
    true,
    1,
    true,
    "office-chairs,ergonomic",
    "color:black|size:medium",
  ];
  const variantSample2 = [
    "executive-chair",
    "model-black",
    "EC-BLK-L",
    "EC-BLK-L-002",
    "Large",
    "كبير",
    "Classic Black",
    "أسود كلاسيك",
    369.99,
    30,
    false,
    2,
    true,
    "office-chairs,ergonomic",
    "color:black|size:large",
  ];
  const variantSample3 = [
    "executive-chair",
    "model-white",
    "EC-WHT-M",
    "EC-WHT-M-003",
    "Medium",
    "متوسط",
    "Pearl White",
    "أبيض لؤلؤي",
    379.99,
    20,
    true,
    1,
    true,
    "office-chairs",
    "color:white|size:medium",
  ];

  const variantWs = XLSX.utils.aoa_to_sheet([
    variantHeaders,
    variantSample1,
    variantSample2,
    variantSample3,
  ]);
  variantWs["!cols"] = variantHeaders.map((h) =>
    h === "attributes" || h === "categories" ? { wch: 36 } : { wch: 20 }
  );
  XLSX.utils.book_append_sheet(wb, variantWs, "product_variants");

  XLSX.writeFile(wb, "bosq_bulk_upload_template.xlsx");
}

/* ─── Helper: Column Reference Card ─────────────────────────────────────── */

function ColumnReference() {
  const [open, setOpen] = useState(false);

  const sheets = [
    {
      name: "product_base",
      required: ["slug", "title", "title_ar", "description", "description_ar"],
      optional: [
        "enhance_title", "enhance_title_ar", "details", "details_ar",
        "details_points", "details_points_ar", "additional_details",
        "additional_details_ar", "sort_order", "status",
      ],
    },
    {
      name: "product_models",
      required: ["base_slug", "slug", "title", "title_ar"],
      optional: ["code", "base_price", "sort_order", "status"],
    },
    {
      name: "product_variants",
      required: ["base_slug", "model_slug"],
      optional: [
        "sku", "product_code", "title", "title_ar", "design_title",
        "design_title_ar", "price", "stock", "is_primary", "sort_order",
        "status", "categories (comma-separated slugs)",
        "attributes (attr_slug:value_slug separated by |)",
      ],
    },
  ];

  return (
    <Card className="mb-6 border-dashed">
      <CardHeader className="pb-3 cursor-pointer" onClick={() => setOpen((p) => !p)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Excel Column Reference (3 required sheets)
          </CardTitle>
          {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </CardHeader>
      {open && (
        <CardContent className="pt-0">
          <div className="grid gap-4 md:grid-cols-3">
            {sheets.map((sheet) => (
              <div key={sheet.name} className="rounded-lg border p-3 bg-muted/30">
                <p className="font-mono text-xs font-semibold text-primary mb-2">{sheet.name}</p>
                <div className="space-y-1">
                  {sheet.required.map((f) => (
                    <div key={f} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                      <span className="font-mono text-[11px]">{f}</span>
                      <Badge variant="destructive" className="text-[9px] px-1 py-0 ml-auto">req</Badge>
                    </div>
                  ))}
                  {sheet.optional.map((f) => (
                    <div key={f} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0" />
                      <span className="font-mono text-[11px] text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            <strong>Note:</strong> In product_models, <code className="bg-muted px-1 rounded">base_slug</code> must match a slug from product_base sheet.
            In product_variants, <code className="bg-muted px-1 rounded">base_slug + model_slug</code> must match a row from product_models sheet.
          </p>
        </CardContent>
      )}
    </Card>
  );
}

/* ─── Helper: Validation Error Table ────────────────────────────────────── */

function ErrorTable({ errors }: { errors: ValidationError[] }) {
  const sheetColors: Record<string, string> = {
    product_base: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    product_models: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    product_variants: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[160px]">Sheet</TableHead>
            <TableHead className="w-[80px]">Row</TableHead>
            <TableHead className="w-[160px]">Field</TableHead>
            <TableHead>Error Message</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {errors.map((err, idx) => (
            <TableRow key={idx} className="text-sm">
              <TableCell>
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium ${sheetColors[err.sheet] ?? "bg-muted"}`}>
                  {err.sheet}
                </span>
              </TableCell>
              <TableCell className="font-mono text-muted-foreground">{err.row}</TableCell>
              <TableCell className="font-mono text-xs">{err.field}</TableCell>
              <TableCell className="text-muted-foreground">{err.message}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/* ─── Helper: Job Status Card ────────────────────────────────────────────── */

function JobStatusCard({
  jobId,
  onReset,
}: {
  jobId: string;
  onReset: () => void;
}) {
  const [status, setStatus] = useState<UploadJobStatus | null>(null);
  const [polling, setPolling] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await getBulkUploadStatus(jobId);
      setStatus(data);
      if (data.state === "completed" || data.state === "failed") {
        setPolling(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch job status");
      setPolling(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [jobId]);

  useEffect(() => {
    fetchStatus();
    intervalRef.current = setInterval(fetchStatus, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchStatus]);

  const stateConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    waiting:   { icon: <Clock className="h-5 w-5" />, color: "text-yellow-500", label: "Waiting in queue" },
    active:    { icon: <Loader2 className="h-5 w-5 animate-spin" />, color: "text-blue-500", label: "Processing" },
    completed: { icon: <CheckCircle2 className="h-5 w-5" />, color: "text-green-500", label: "Completed" },
    failed:    { icon: <XCircle className="h-5 w-5" />, color: "text-destructive", label: "Failed" },
    delayed:   { icon: <Clock className="h-5 w-5" />, color: "text-muted-foreground", label: "Delayed" },
  };

  const cfg = status ? (stateConfig[status.state] ?? { icon: <Loader2 className="h-5 w-5 animate-spin" />, color: "text-muted-foreground", label: status.state }) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="h-5 w-5 text-primary" />
          Upload Job
          <code className="ml-auto font-mono text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
            #{jobId}
          </code>
        </CardTitle>
        {polling && (
          <CardDescription className="flex items-center gap-1.5">
            <Loader2 className="h-3 w-3 animate-spin" />
            Auto-refreshing every 3 seconds…
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <XCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {cfg && status && (
          <>
            <div className={`flex items-center gap-2 font-medium ${cfg.color}`}>
              {cfg.icon}
              {cfg.label}
            </div>

            {status.state === "completed" && status.result && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { label: "Bases", value: status.result.bases_inserted },
                  { label: "Models", value: status.result.models_inserted },
                  { label: "Variants", value: status.result.variants_inserted },
                  { label: "Category Links", value: status.result.category_links },
                  { label: "Attribute Links", value: status.result.attribute_links },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg border p-3 text-center">
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}

            {status.state === "failed" && status.error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {status.error}
                {status.attempts_made !== undefined && (
                  <p className="mt-1 text-xs opacity-70">Attempts made: {status.attempts_made}</p>
                )}
              </div>
            )}
          </>
        )}

        {!polling && (
          <Button variant="outline" size="sm" onClick={onReset} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Start New Upload
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */

export default function ProductBulkUpload() {
  const { toast } = useToast();

  const [phase, setPhase] = useState<Phase>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  const reset = () => {
    setPhase("idle");
    setFile(null);
    setValidationResult(null);
    setJobId(null);
  };

  /* File drop */
  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) {
      setFile(accepted[0]);
      setValidationResult(null);
      if (phase !== "idle") setPhase("idle");
    }
  }, [phase]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
    disabled: phase === "validating" || phase === "approving" || phase === "monitoring",
  });

  /* Validate */
  const handleValidate = async () => {
    if (!file) return;
    setPhase("validating");
    setValidationResult(null);

    try {
      const result = await validateBulkUpload(file);
      setValidationResult(result);
      setPhase(result.status === "success" ? "validated_ok" : "validated_fail");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Validation failed", variant: "destructive" });
      setPhase("idle");
    }
  };

  /* Approve */
  const handleApprove = async () => {
    if (!validationResult?.token) return;
    setPhase("approving");

    try {
      const result = await approveBulkUpload(validationResult.token);
      setJobId(result.job_id);
      setPhase("monitoring");
      toast({ title: "Upload queued", description: `Job #${result.job_id} is processing in the background.` });
    } catch (err: any) {
      toast({ title: "Approval failed", description: err.message || "Could not queue upload", variant: "destructive" });
      setPhase("validated_ok");
    }
  };

  const isDisabled = phase === "validating" || phase === "approving" || phase === "monitoring";

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bulk Product Upload</h1>
          <p className="text-muted-foreground mt-1">
            Upload an Excel file to create Products, Models, and Variants in bulk.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={downloadTemplate} className="shrink-0 gap-2">
          <Download className="h-4 w-4" />
          Download Template
        </Button>
      </div>

      {/* Step Indicator */}
      <StepIndicator phase={phase} />

      {/* Column Reference */}
      <ColumnReference />

      {/* File Drop Zone */}
      {phase !== "monitoring" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Step 1 — Select Excel File</CardTitle>
            <CardDescription>Drag and drop your .xlsx file or click to browse.</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : file
                  ? "border-primary/50 bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/40 hover:bg-muted/30"
              } ${isDisabled ? "pointer-events-none opacity-60" : ""}`}
            >
              <input {...getInputProps()} />
              {file ? (
                <>
                  <FileSpreadsheet className="h-10 w-10 text-primary mb-3" />
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(file.size / 1024).toFixed(1)} KB — click or drop to replace
                  </p>
                </>
              ) : (
                <>
                  <UploadCloud className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium">
                    {isDragActive ? "Drop the file here" : "Drop your Excel file here"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Supports .xlsx and .xls — max 50 MB</p>
                </>
              )}
            </div>

            {file && (
              <Button
                className="w-full mt-4"
                onClick={handleValidate}
                disabled={isDisabled}
              >
                {phase === "validating" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Validating…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Step 2 — Validate File
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Validation Results */}
      {validationResult && phase !== "monitoring" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              {validationResult.status === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              {validationResult.status === "success" ? "Validation Passed" : "Validation Failed"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary */}
            {validationResult.summary && (
              <div className="flex flex-wrap gap-3">
                {validationResult.status === "success" ? (
                  <>
                    <StatBadge label="Bases" value={validationResult.summary.total_bases ?? 0} color="blue" />
                    <StatBadge label="Models" value={validationResult.summary.total_models ?? 0} color="purple" />
                    <StatBadge label="Variants" value={validationResult.summary.total_variants ?? 0} color="green" />
                  </>
                ) : (
                  <>
                    <StatBadge label="Total Rows" value={validationResult.summary.total_rows ?? 0} color="blue" />
                    <StatBadge label="Valid" value={validationResult.summary.valid_rows ?? 0} color="green" />
                    <StatBadge label="Invalid" value={validationResult.summary.invalid_rows ?? 0} color="red" />
                  </>
                )}
              </div>
            )}

            {/* Error list */}
            {validationResult.errors && validationResult.errors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  {validationResult.errors.length} error{validationResult.errors.length !== 1 ? "s" : ""} found
                </div>
                <ErrorTable errors={validationResult.errors} />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              {validationResult.status === "failed" && (
                <Button variant="outline" onClick={reset} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Fix & Re-upload
                </Button>
              )}

              {validationResult.status === "success" && (
                <Button
                  className="flex-1"
                  onClick={handleApprove}
                  disabled={phase === "approving"}
                >
                  {phase === "approving" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Queuing…
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Step 3 — Approve & Start Upload
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Monitor */}
      {phase === "monitoring" && jobId && (
        <JobStatusCard jobId={jobId} onReset={reset} />
      )}
    </div>
  );
}

/* ─── Small helper ───────────────────────────────────────────────────────── */

function StatBadge({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "blue" | "purple" | "green" | "red";
}) {
  const cls: Record<string, string> = {
    blue:   "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    green:  "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    red:    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };

  return (
    <div className={`rounded-lg px-3 py-2 text-center min-w-[80px] ${cls[color]}`}>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs">{label}</p>
    </div>
  );
}
