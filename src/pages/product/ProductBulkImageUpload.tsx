import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  ImageIcon,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Clock,
  Zap,
  X,
  ChevronDown,
  ChevronUp,
  FileVideo,
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
import { useToast } from "@/hooks/use-toast";
import {
  uploadBulkImages,
  getBulkImageUploadStatus,
  type BulkImageJobStatus,
  type BulkImageJobState,
} from "@/services/product/bulkImageUploadApi";

/* ─── Constants ──────────────────────────────────────────────────────────── */

const MAX_FILES = 100;
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

const ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "image/bmp": [".bmp"],
  "image/svg+xml": [".svg"],
  "image/tiff": [".tiff", ".tif"],
  "video/mp4": [".mp4"],
  "video/webm": [".webm"],
  "video/quicktime": [".mov"],
  "video/x-msvideo": [".avi"],
  "video/x-matroska": [".mkv"],
};

/* ─── Types ──────────────────────────────────────────────────────────────── */

type Phase = "idle" | "uploading" | "monitoring" | "done";

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isVideo(file: File): boolean {
  return file.type.startsWith("video/");
}

/* ─── Progress Bar ───────────────────────────────────────────────────────── */

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
      <div
        className="h-3 rounded-full bg-primary transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

/* ─── Job Status Monitor ─────────────────────────────────────────────────── */

function JobMonitor({
  jobId,
  totalFiles,
  onReset,
}: {
  jobId: string;
  totalFiles: number;
  onReset: () => void;
}) {
  const [status, setStatus] = useState<BulkImageJobStatus | null>(null);
  const [polling, setPolling] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skippedOpen, setSkippedOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await getBulkImageUploadStatus(jobId);
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
    intervalRef.current = setInterval(fetchStatus, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchStatus]);

  const stateConfig: Record<
    BulkImageJobState,
    { icon: React.ReactNode; color: string; label: string }
  > = {
    waiting: {
      icon: <Clock className="h-5 w-5" />,
      color: "text-yellow-500",
      label: "Waiting in queue",
    },
    active: {
      icon: <Loader2 className="h-5 w-5 animate-spin" />,
      color: "text-blue-500",
      label: "Processing files…",
    },
    completed: {
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: "text-green-500",
      label: "Completed",
    },
    failed: {
      icon: <XCircle className="h-5 w-5" />,
      color: "text-destructive",
      label: "Failed",
    },
    delayed: {
      icon: <Clock className="h-5 w-5" />,
      color: "text-muted-foreground",
      label: "Delayed",
    },
    unknown: {
      icon: <Loader2 className="h-5 w-5 animate-spin" />,
      color: "text-muted-foreground",
      label: "Unknown",
    },
  };

  const cfg = status
    ? (stateConfig[status.state] ?? stateConfig.unknown)
    : null;

  const progress = status?.progress ?? 0;
  const processedCount =
    status?.result
      ? status.result.saved_count + status.result.skipped_count
      : Math.round((progress / 100) * totalFiles);

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
          <CardDescription className="flex items-center gap-1.5 text-xs">
            <Loader2 className="h-3 w-3 animate-spin" />
            Auto-refreshing every 2 seconds…
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <XCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {cfg && status && (
          <>
            {/* State label */}
            <div className={`flex items-center gap-2 font-medium ${cfg.color}`}>
              {cfg.icon}
              {cfg.label}
            </div>

            {/* Progress bar — shown while active or waiting */}
            {(status.state === "active" || status.state === "waiting") && (
              <div className="space-y-1.5">
                <ProgressBar value={progress} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{processedCount} / {totalFiles} files</span>
                  <span>{progress}%</span>
                </div>
              </div>
            )}

            {/* Completed result */}
            {status.state === "completed" && status.result && (
              <div className="space-y-3">
                {/* Full progress bar on completion */}
                <ProgressBar value={100} />

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3 text-center bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                      {status.result.saved_count}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-500 mt-1 flex items-center justify-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Saved
                    </p>
                  </div>
                  <div className="rounded-lg border p-3 text-center bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                    <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                      {status.result.skipped_count}
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1 flex items-center justify-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Skipped (duplicates)
                    </p>
                  </div>
                </div>

                {/* Expandable skipped files list */}
                {status.result.skipped_files.length > 0 && (
                  <div className="rounded-md border border-yellow-200 dark:border-yellow-800 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setSkippedOpen((p) => !p)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-sm font-medium text-yellow-800 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        {status.result.skipped_files.length} skipped file
                        {status.result.skipped_files.length !== 1 ? "s" : ""}
                        &nbsp;(already exist in bulk folder)
                      </span>
                      {skippedOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    {skippedOpen && (
                      <div className="max-h-48 overflow-y-auto bg-white dark:bg-background">
                        {status.result.skipped_files.map((name) => (
                          <div
                            key={name}
                            className="px-3 py-1.5 text-xs font-mono text-muted-foreground border-b last:border-b-0 border-yellow-100 dark:border-yellow-900/20"
                          >
                            {name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Failed state */}
            {status.state === "failed" && status.error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {status.error}
                {status.attempts_made !== undefined && (
                  <p className="mt-1 text-xs opacity-70">
                    Attempts made: {status.attempts_made}
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {!polling && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Upload More Files
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */

export default function ProductBulkImageUpload() {
  const { toast } = useToast();

  const [phase, setPhase] = useState<Phase>("idle");
  const [files, setFiles] = useState<File[]>([]);
  const [jobId, setJobId] = useState<string | null>(null);
  const [totalFiles, setTotalFiles] = useState(0);

  const reset = () => {
    setPhase("idle");
    setFiles([]);
    setJobId(null);
    setTotalFiles(0);
  };

  /* Drop handler */
  const onDrop = useCallback(
    (accepted: File[], rejected: { file: File; errors: { message: string }[] }[]) => {
      if (rejected.length > 0) {
        const messages = rejected
          .flatMap((r) => r.errors.map((e) => e.message))
          .filter((v, i, a) => a.indexOf(v) === i)
          .slice(0, 3)
          .join(" · ");
        toast({
          title: `${rejected.length} file(s) rejected`,
          description: messages,
          variant: "destructive",
        });
      }

      if (accepted.length === 0) return;

      setFiles((prev) => {
        const merged = [...prev];
        for (const f of accepted) {
          // Avoid adding the same file (by name + size) twice
          if (!merged.some((e) => e.name === f.name && e.size === f.size)) {
            merged.push(f);
          }
        }
        return merged.slice(0, MAX_FILES);
      });
    },
    [toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE_BYTES,
    disabled: phase !== "idle",
  });

  /* Remove a single file from the selection */
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /* Upload */
  const handleUpload = async () => {
    if (files.length === 0) return;
    setPhase("uploading");

    try {
      const result = await uploadBulkImages(files);
      setJobId(result.job_id);
      setTotalFiles(result.total_files);
      setPhase("monitoring");
      toast({
        title: "Upload queued",
        description: `Job #${result.job_id} is processing ${result.total_files} file(s) in the background.`,
      });
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err.message || "Could not queue the upload",
        variant: "destructive",
      });
      setPhase("idle");
    }
  };

  const isDisabled = phase !== "idle";

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Bulk Image &amp; Video Upload
        </h1>
        <p className="text-muted-foreground mt-1">
          Upload up to {MAX_FILES} images or videos at once. Files are saved to{" "}
          <code className="bg-muted px-1 rounded text-xs">uploads/bulk/</code>{" "}
          with their original filenames. Duplicates are automatically skipped.
        </p>
      </div>

      {/* Info strip */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: `Max ${MAX_FILES} files per upload`, color: "secondary" },
          { label: "Max 50 MB per file", color: "secondary" },
          { label: "Images: jpg, png, webp, gif, bmp, svg, tiff", color: "outline" },
          { label: "Videos: mp4, webm, mov, avi, mkv", color: "outline" },
        ].map((b) => (
          <Badge key={b.label} variant={b.color as any} className="text-xs">
            {b.label}
          </Badge>
        ))}
      </div>

      {/* Drop Zone — hidden while monitoring */}
      {phase !== "monitoring" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Select Files
              {files.length > 0 && (
                <Badge className="ml-2 text-xs" variant="secondary">
                  {files.length} / {MAX_FILES}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Drag &amp; drop images and videos here, or click to browse. You
              can add files in multiple batches up to {MAX_FILES} total.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : files.length > 0
                  ? "border-primary/50 bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/40 hover:bg-muted/30"
              } ${isDisabled ? "pointer-events-none opacity-60" : ""}`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">
                {isDragActive
                  ? "Drop files here"
                  : files.length > 0
                  ? "Drop more files or click to add"
                  : "Drop your images & videos here"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Accepts images and videos — max {MAX_FILES} files, 50 MB each
              </p>
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  Selected files ({files.length})
                </p>
                <div className="max-h-64 overflow-y-auto rounded-md border divide-y">
                  {files.map((file, idx) => (
                    <div
                      key={`${file.name}-${file.size}-${idx}`}
                      className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted/40"
                    >
                      {isVideo(file) ? (
                        <FileVideo className="h-4 w-4 text-purple-500 shrink-0" />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-blue-500 shrink-0" />
                      )}
                      <span className="flex-1 truncate font-mono text-xs">
                        {file.name}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatBytes(file.size)}
                      </span>
                      {!isDisabled && (
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload button */}
            {files.length > 0 && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={reset}
                  disabled={isDisabled}
                  className="shrink-0"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleUpload}
                  disabled={isDisabled}
                >
                  {phase === "uploading" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading {files.length} file
                      {files.length !== 1 ? "s" : ""}…
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Upload &amp; Queue {files.length} file
                      {files.length !== 1 ? "s" : ""}
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Job Monitor */}
      {phase === "monitoring" && jobId && (
        <JobMonitor jobId={jobId} totalFiles={totalFiles} onReset={reset} />
      )}
    </div>
  );
}
