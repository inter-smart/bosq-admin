import { useState, useEffect, useCallback, useRef, type ChangeEvent } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import {
  Search,
  TableIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { fetchProductVariantMetaList, ProductVariantMeta } from "@/services/product/productVariantMetaApi";
import {
  exportProductVariantMetaBulk,
  validateProductVariantMetaBulk,
  approveProductVariantMetaBulk,
  getProductVariantMetaBulkStatus,
  type MetaValidationResult,
  type MetaJobStatus,
  type ValidationError,
} from "@/services/product/productVariantMetaBulkApi";

/* ─── Sheet generation ───────────────────────────────────────────────────── */

const META_SHEET_NAME = "product_meta";

const META_COLUMNS: { key: keyof ProductVariantMeta | string; header: string; width: number }[] = [
  { key: "sku", header: "sku", width: 22 },
  { key: "product_title", header: "product_title", width: 30 },
  { key: "meta_title", header: "meta_title", width: 30 },
  { key: "meta_title_ar", header: "meta_title_ar", width: 30 },
  { key: "meta_description", header: "meta_description", width: 40 },
  { key: "meta_description_ar", header: "meta_description_ar", width: 40 },
  { key: "meta_keywords", header: "meta_keywords", width: 30 },
  { key: "meta_keywords_ar", header: "meta_keywords_ar", width: 30 },
  { key: "other_meta", header: "other_meta", width: 44 },
  { key: "other_meta_ar", header: "other_meta_ar", width: 44 },
];

function generateMetaSheet(rows: Record<string, string>[]) {
  const headers = META_COLUMNS.map((c) => c.header);
  const dataRows = rows.map((r) => META_COLUMNS.map((c) => r[c.key as string] ?? ""));

  const ws = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);
  ws["!cols"] = META_COLUMNS.map((c) => ({ wch: c.width }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, META_SHEET_NAME);

  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  XLSX.writeFile(wb, `bosq_variant_meta_${date}.xlsx`);
}

/* ─── Export Dialog (pick variants → download pre-filled sheet) ────────────── */

const EXPORT_PAGE_SIZE = 20;

export function MetaExportDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [variants, setVariants] = useState<ProductVariantMeta[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [generating, setGenerating] = useState(false);

  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 400);
  };

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchProductVariantMetaList(page, EXPORT_PAGE_SIZE, debouncedSearch || undefined);
        if (cancelled) return;
        setVariants(res.data.list);
        setTotalPages(res.data.pagination.totalPages);
        setTotalCount(res.data.pagination.totalCount);
      } catch {
        if (!cancelled) toast({ title: "Error", description: "Failed to load variants.", variant: "destructive" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [open, page, debouncedSearch]);

  useEffect(() => {
    if (open) {
      setSearch("");
      setDebouncedSearch("");
      setPage(1);
      setSelectedIds(new Set());
      setGenerating(false);
    }
  }, [open]);

  const toggleId = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const currentPageIds = variants.map((v) => v.id).filter(Boolean);
  const allCurrentSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.has(id));
  const someCurrentSelected = currentPageIds.some((id) => selectedIds.has(id));

  const togglePage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allCurrentSelected) {
        currentPageIds.forEach((id) => next.delete(id));
      } else {
        currentPageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleGenerate = async () => {
    if (selectedIds.size === 0) return;
    setGenerating(true);
    try {
      const result = await exportProductVariantMetaBulk(Array.from(selectedIds));
      if (result.status === "success" && result.data) {
        generateMetaSheet(result.data.rows);
        toast({ title: "Sheet generated", description: `Downloaded ${result.data.rows.length} variant row(s).` });
        onClose();
      } else {
        toast({ title: "Export failed", description: result.message || "Could not generate sheet.", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Export failed", description: err.message || "Could not generate sheet.", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const selectedCount = selectedIds.size;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && !generating && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <TableIcon className="h-5 w-5 text-primary" />
            Download Meta Tags Sheet
          </DialogTitle>
          <DialogDescription>Select variants to include in a pre-filled Excel sheet you can edit and re-upload.</DialogDescription>
        </DialogHeader>

        <div className="px-6 py-3 border-b shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search variant by SKU or title" value={search} onChange={handleSearchChange} className="pl-9" />
          </div>
        </div>

        <div className="flex-1 overflow-auto min-h-0">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={allCurrentSelected ? true : someCurrentSelected ? "indeterminate" : false}
                    onCheckedChange={togglePage}
                    disabled={loading || currentPageIds.length === 0}
                    aria-label="Toggle current page"
                  />
                </TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Product Title</TableHead>
                <TableHead>Meta Title</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                    Loading variants…
                  </TableCell>
                </TableRow>
              ) : variants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                    No variants found.
                  </TableCell>
                </TableRow>
              ) : (
                variants.map((v) => {
                  const isChecked = selectedIds.has(v.id);
                  return (
                    <TableRow
                      key={v.id}
                      className={`cursor-pointer hover:bg-muted/50 ${isChecked ? "bg-primary/5" : ""}`}
                      onClick={() => toggleId(v.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={isChecked} onCheckedChange={() => toggleId(v.id)} aria-label={`Select variant ${v.product_slug}`} />
                      </TableCell>
                      <TableCell className="font-mono text-xs">{v.product_slug || "—"}</TableCell>
                      <TableCell className="text-sm">{v.product_title || "—"}</TableCell>
                      <TableCell className="text-sm max-w-[200px] truncate">{v.meta_title || "—"}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <div className="px-6 py-3 border-t shrink-0 flex items-center justify-between gap-4 bg-muted/30">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1 || loading}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground ml-2">{totalCount} total</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{selectedCount} selected</span>
            <Button size="sm" onClick={handleGenerate} disabled={selectedCount === 0 || generating}>
              {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
              Download Sheet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Error table ────────────────────────────────────────────────────────── */

function ErrorTable({ errors }: { errors: ValidationError[] }) {
  return (
    <div className="max-h-64 overflow-auto border rounded-md">
      <Table>
        <TableHeader className="sticky top-0 bg-background">
          <TableRow>
            <TableHead>Row</TableHead>
            <TableHead>Field</TableHead>
            <TableHead>Message</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {errors.map((err, idx) => (
            <TableRow key={idx}>
              <TableCell className="text-sm">{err.row}</TableCell>
              <TableCell className="text-sm font-mono">{err.field}</TableCell>
              <TableCell className="text-sm">{err.message}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/* ─── Upload Dialog (upload edited sheet → validate → approve → poll) ──────── */

type UploadPhase = "idle" | "validating" | "validated_ok" | "validated_fail" | "approving" | "monitoring";

const stateConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  waiting: { icon: <Clock className="h-5 w-5" />, color: "text-yellow-500", label: "Waiting in queue" },
  active: { icon: <Loader2 className="h-5 w-5 animate-spin" />, color: "text-blue-500", label: "Processing" },
  completed: { icon: <CheckCircle2 className="h-5 w-5" />, color: "text-green-500", label: "Completed" },
  failed: { icon: <XCircle className="h-5 w-5" />, color: "text-destructive", label: "Failed" },
  delayed: { icon: <Clock className="h-5 w-5" />, color: "text-muted-foreground", label: "Delayed" },
};

export function MetaUploadDialog({ open, onClose, onCompleted }: { open: boolean; onClose: () => void; onCompleted?: () => void }) {
  const { toast } = useToast();

  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<MetaValidationResult | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<MetaJobStatus | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    setPhase("idle");
    setFile(null);
    setValidationResult(null);
    setJobId(null);
    setJobStatus(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (open) reset();
  }, [open]);

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) {
        setFile(accepted[0]);
        setValidationResult(null);
        if (phase !== "idle") setPhase("idle");
      }
    },
    [phase],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
    disabled: phase === "validating" || phase === "approving" || phase === "monitoring",
  });

  const handleValidate = async () => {
    if (!file) return;
    setPhase("validating");
    setValidationResult(null);
    try {
      const result = await validateProductVariantMetaBulk(file);
      setValidationResult(result);
      setPhase(result.status === "success" ? "validated_ok" : "validated_fail");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Validation failed", variant: "destructive" });
      setPhase("idle");
    }
  };

  const handleApprove = async () => {
    if (!validationResult?.token) return;
    setPhase("approving");
    try {
      const result = await approveProductVariantMetaBulk(validationResult.token);
      setJobId(result.job_id);
      setPhase("monitoring");
      toast({ title: "Upload queued", description: `Job #${result.job_id} is processing in the background.` });
    } catch (err: any) {
      toast({ title: "Approval failed", description: err.message || "Could not queue upload", variant: "destructive" });
      setPhase("validated_ok");
    }
  };

  const fetchStatus = useCallback(async () => {
    if (!jobId) return;
    try {
      const data = await getProductVariantMetaBulkStatus(jobId);
      setJobStatus(data);
      if (data.state === "completed" || data.state === "failed") {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (data.state === "completed") onCompleted?.();
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to fetch job status", variant: "destructive" });
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [jobId, onCompleted, toast]);

  useEffect(() => {
    if (phase === "monitoring" && jobId) {
      fetchStatus();
      intervalRef.current = setInterval(fetchStatus, 3000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [phase, jobId, fetchStatus]);

  const isDisabled = phase === "validating" || phase === "approving" || phase === "monitoring";

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v && !isDisabled) onClose();
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-primary" />
            Upload Meta Tags Sheet
          </DialogTitle>
          <DialogDescription>Upload the edited product_meta sheet. Rows are matched by SKU — existing meta is updated, new ones are created.</DialogDescription>
        </DialogHeader>

        {phase !== "monitoring" && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            } ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
          >
            <input {...getInputProps()} />
            <FileSpreadsheet className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            {file ? (
              <div>
                <p className="font-medium text-sm">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024).toFixed(1)} KB — click or drop to replace</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Drag & drop the .xlsx sheet here, or click to browse</p>
            )}
          </div>
        )}

        {file && (phase === "idle" || phase === "validating") && (
          <Button onClick={handleValidate} disabled={phase === "validating"} className="w-full">
            {phase === "validating" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Validate File
          </Button>
        )}

        {validationResult && phase !== "monitoring" && (
          <div className="border rounded-md p-4 space-y-3">
            <div className="flex items-center gap-2">
              {validationResult.status === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <span className="font-medium">{validationResult.status === "success" ? "Validation Passed" : "Validation Failed"}</span>
            </div>

            {validationResult.summary && (
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Total: {validationResult.summary.total_rows ?? 0}</span>
                {validationResult.summary.valid_rows !== undefined && <span>Valid: {validationResult.summary.valid_rows}</span>}
                {validationResult.summary.invalid_rows !== undefined && <span>Invalid: {validationResult.summary.invalid_rows}</span>}
              </div>
            )}

            {validationResult.errors && validationResult.errors.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">
                  {validationResult.errors.length} error{validationResult.errors.length !== 1 ? "s" : ""} found
                </p>
                <ErrorTable errors={validationResult.errors} />
              </div>
            )}

            {validationResult.status === "failed" && (
              <Button variant="outline" onClick={reset} className="w-full">
                Try a different file
              </Button>
            )}

            {validationResult.status === "success" && (
              <Button onClick={handleApprove} disabled={phase === "approving"} className="w-full">
                {phase === "approving" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Confirm & Upload
              </Button>
            )}
          </div>
        )}

        {phase === "monitoring" && jobId && (
          <div className="border rounded-md p-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Processing upload</span>
              <code className="ml-auto font-mono text-xs bg-muted px-2 py-1 rounded text-muted-foreground">#{jobId}</code>
            </div>

            {jobStatus &&
              (() => {
                const cfg = stateConfig[jobStatus.state] ?? { icon: <Clock className="h-5 w-5" />, color: "text-muted-foreground", label: jobStatus.state };
                return (
                  <div>
                    <div className={`flex items-center gap-2 ${cfg.color}`}>
                      {cfg.icon}
                      <span className="font-medium">{cfg.label}</span>
                    </div>

                    {jobStatus.state === "completed" && jobStatus.result && (
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        <div className="text-center p-3 bg-muted/50 rounded-md">
                          <p className="text-2xl font-bold text-primary">{jobStatus.result.created}</p>
                          <p className="text-xs text-muted-foreground">Created</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-md">
                          <p className="text-2xl font-bold text-primary">{jobStatus.result.updated}</p>
                          <p className="text-xs text-muted-foreground">Updated</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-md">
                          <p className="text-2xl font-bold text-primary">{jobStatus.result.total}</p>
                          <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                      </div>
                    )}

                    {jobStatus.state === "failed" && jobStatus.error && (
                      <div className="mt-2 text-sm text-destructive bg-destructive/10 rounded-md p-3">
                        {jobStatus.error}
                        {jobStatus.attempts_made !== undefined && <p className="mt-1 text-xs opacity-70">Attempts made: {jobStatus.attempts_made}</p>}
                      </div>
                    )}
                  </div>
                );
              })()}

            {(jobStatus?.state === "completed" || jobStatus?.state === "failed") && (
              <Button onClick={onClose} className="w-full">
                Close
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
