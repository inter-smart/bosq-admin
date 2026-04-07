import { useState, useCallback, useRef, useEffect, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
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
  ArrowRight,
  Search,
  TableIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  validateBulkUpload,
  approveBulkUpload,
  getBulkUploadStatus,
  validateFaqUpload,
  approveFaqUpload,
  getFaqUploadStatus,
  exportVariantData,
  type ValidationError,
  type ValidationResult,
  type UploadJobStatus,
  type FaqValidationResult,
  type FaqJobStatus,
} from "@/services/product/bulkUploadApi";
import { fetchProductVariantList, type ProductVariant } from "@/services/product/productVariantApi";

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
    phase === "idle" ? 0 : phase === "validating" ? 1 : phase === "validated_fail" ? 1 : phase === "validated_ok" ? 2 : phase === "approving" ? 2 : 3;

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
            <span className={`text-xs mt-1 whitespace-nowrap ${idx <= activeStep ? "text-primary font-medium" : "text-muted-foreground"}`}>
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mt-[-14px] transition-colors ${idx < activeStep ? "bg-primary" : "bg-muted-foreground/20"}`} />
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
  // Note: no "slug" column — slug is auto-generated from title on insert
  // Content fields (description, details, etc.) have moved to product_variants
  const baseHeaders = ["title", "title_ar", "sort_order", "status"];
  const baseSample = ["Executive Chair", "كرسي تنفيذي", 1, true];

  const baseWs = XLSX.utils.aoa_to_sheet([baseHeaders, baseSample]);
  baseWs["!cols"] = [{ wch: 36 }, { wch: 36 }, { wch: 14 }, { wch: 10 }];
  XLSX.utils.book_append_sheet(wb, baseWs, "product_base");

  // ── Sheet 2: product_models ────────────────────────────────────────────
  // base_title must match a title from product_base sheet
  // No "slug" column — slug is auto-generated from title on insert
  // media_path: single filename from uploads/bulk/ (upload via Bulk Image Upload first)
  const modelHeaders = ["base_title", "title", "title_ar", "code", "base_price", "sort_order", "status", "media_path"];
  const modelSample = ["Executive Chair", "Black Edition", "الإصدار الأسود", "EC-BLK", 299.99, 1, true, "ec-blk-model.jpg"];
  const modelSample2 = ["Executive Chair", "White Edition", "الإصدار الأبيض", "EC-WHT", 319.99, 2, true, "ec-wht-model.jpg"];

  const modelWs = XLSX.utils.aoa_to_sheet([modelHeaders, modelSample, modelSample2]);
  modelWs["!cols"] = modelHeaders.map(() => ({ wch: 22 }));
  XLSX.utils.book_append_sheet(wb, modelWs, "product_models");

  // ── Sheet 3: product_variants ──────────────────────────────────────────
  // SKU is auto-generated from {model.code}-{attr_value_slug1}-{attr_value_slug2}... (all uppercase)
  // Do NOT include a "sku" column — it is computed server-side during validation.
  // Content fields (description, details, enhance_title, etc.) now live here (moved from product_base)
  // cover_image / hover_image / brochure: single filename from uploads/bulk/
  // images: comma-separated filenames (images + videos in display order)
  // video_thumbnails: comma-separated thumbnail filenames, one per video in "images" order
  // project_images: comma-separated filenames for the project/inspiration gallery
  const variantHeaders = [
    "base_title",
    "model_title",
    "product_code",
    "title",
    "title_ar",
    "design_title",
    "design_title_ar",
    "price",
    "stock",
    "is_featured",
    "sort_order",
    "status",
    "categories",
    "attributes",
    "description",
    "description_ar",
    "enhance_title",
    "enhance_title_ar",
    "details",
    "details_ar",
    "details_points",
    "details_points_ar",
    "additional_details",
    "additional_details_ar",
    "cover_image",
    "hover_image",
    "brochure",
    "images",
    "video_thumbnails",
    "project_images",
  ];
  const variantSample1 = [
    "Executive Chair",
    "Black Edition",
    "EC-BLK-M-001",
    "Medium",
    "متوسط",
    "Classic Black",
    "أسود كلاسيك",
    349.99,
    50,
    true,
    false,
    1,
    true,
    "office-chairs,ergonomic",
    "color:black|size:medium",
    "Premium ergonomic office chair with lumbar support",
    "كرسي مكتبي مريح وعالي الجودة",
    "Best-in-class Executive Chair",
    "أفضل كرسي تنفيذي في فئته",
    "Crafted from premium materials for all-day comfort.",
    "مصنوع من مواد فاخرة لراحة طوال اليوم.",
    "• Adjustable lumbar support\n• 4D armrests\n• Breathable mesh back",
    "• دعم قطني قابل للتعديل\n• مسند ذراع رباعي الأبعاد",
    "",
    "",
    "ec-blk-m-cover.jpg",
    "ec-blk-m-hover.jpg",
    "ec-blk-m-brochure.pdf",
    "ec-blk-m-1.jpg,ec-blk-m-2.jpg,ec-blk-m-tour.mp4",
    "ec-blk-m-tour-thumb.jpg",
    "ec-blk-m-proj1.jpg,ec-blk-m-proj2.jpg",
  ];
  const variantSample2 = [
    "Executive Chair",
    "Black Edition",
    "EC-BLK-L-002",
    "Large",
    "كبير",
    "Classic Black",
    "أسود كلاسيك",
    369.99,
    30,
    false,
    false,
    2,
    true,
    "office-chairs,ergonomic",
    "color:black|size:large",
    "Premium ergonomic office chair with lumbar support",
    "كرسي مكتبي مريح وعالي الجودة",
    "Best-in-class Executive Chair",
    "أفضل كرسي تنفيذي في فئته",
    "Crafted from premium materials for all-day comfort.",
    "مصنوع من مواد فاخرة لراحة طوال اليوم.",
    "",
    "",
    "",
    "",
    "ec-blk-l-cover.jpg",
    "ec-blk-l-hover.jpg",
    "",
    "ec-blk-l-1.jpg,ec-blk-l-2.jpg",
    "",
    "",
  ];
  const variantSample3 = [
    "Executive Chair",
    "White Edition",
    "EC-WHT-M-003",
    "Medium",
    "متوسط",
    "Pearl White",
    "أبيض لؤلؤي",
    379.99,
    20,
    true,
    false,
    1,
    true,
    "office-chairs",
    "color:white|size:medium",
    "Premium ergonomic office chair",
    "كرسي مكتبي مريح",
    "Pearl White Executive Chair",
    "كرسي تنفيذي أبيض لؤلؤي",
    "Premium materials for all-day comfort.",
    "مواد فاخرة لراحة طوال اليوم.",
    "",
    "",
    "",
    "",
    "ec-wht-m-cover.jpg",
    "ec-wht-m-hover.jpg",
    "",
    "ec-wht-m-1.jpg,ec-wht-m-tour.mp4",
    "ec-wht-m-tour-thumb.jpg",
    "ec-wht-m-proj1.jpg",
  ];

  const variantWs = XLSX.utils.aoa_to_sheet([variantHeaders, variantSample1, variantSample2, variantSample3]);
  const wideVariantCols = new Set([
    "attributes",
    "categories",
    "images",
    "video_thumbnails",
    "project_images",
    "description",
    "description_ar",
    "details",
    "details_ar",
    "details_points",
    "details_points_ar",
    "additional_details",
    "additional_details_ar",
    "enhance_title",
    "enhance_title_ar",
  ]);
  variantWs["!cols"] = variantHeaders.map((h) => (wideVariantCols.has(h) ? { wch: 44 } : { wch: 22 }));
  XLSX.utils.book_append_sheet(wb, variantWs, "product_variants");

  XLSX.writeFile(wb, "bosq_bulk_upload_template.xlsx");
}

/* ─── FAQ Template Generator ─────────────────────────────────────────────── */

function downloadFaqTemplate() {
  const wb = XLSX.utils.book_new();

  // sku: the auto-generated SKU of the target variant
  // Formula: {model_code}-{attr_value_slug1}-{attr_value_slug2}... (all uppercase, hyphen-joined)
  // e.g. model code "EC-BLK" + attributes "color:black|size:medium" → "EC-BLK-BLACK-MEDIUM"
  const headers = ["sku", "question", "question_ar", "answer", "answer_ar", "sort_order", "status"];
  const sample1 = [
    "EC-BLK-BLACK-MEDIUM",
    "What materials is this chair made from?",
    "ما المواد المستخدمة في صنع هذا الكرسي؟",
    "The chair is crafted from premium mesh fabric and high-grade aluminium for the frame.",
    "الكرسي مصنوع من قماش الشبك الفاخر وإطار من الألومنيوم عالي الجودة.",
    1,
    true,
  ];
  const sample2 = [
    "EC-BLK-BLACK-MEDIUM",
    "Does it come with a warranty?",
    "هل يأتي مع ضمان؟",
    "Yes, this chair comes with a 2-year manufacturer warranty.",
    "نعم، يأتي هذا الكرسي مع ضمان المصنع لمدة سنتين.",
    2,
    true,
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, sample1, sample2]);
  ws["!cols"] = headers.map((h) => (["question", "question_ar", "answer", "answer_ar"].includes(h) ? { wch: 50 } : { wch: 26 }));
  XLSX.utils.book_append_sheet(wb, ws, "product_faqs");
  XLSX.writeFile(wb, "bosq_faq_upload_template.xlsx");
}

/* ─── Helper: Upload Guide (tabbed) ─────────────────────────────────────── */

type GuideTab = "checklist" | "images" | "data" | "upsert";

function UploadGuide() {
  const [tab, setTab] = useState<GuideTab>("checklist");

  const tabs: { key: GuideTab; label: string }[] = [
    { key: "checklist", label: "Pre-Upload Checklist" },
    { key: "images", label: "Image & Media Rules" },
    { key: "data", label: "Sheet & Data Rules" },
    { key: "upsert", label: "Re-upload Behavior" },
  ];

  return (
    <Card className="mb-6 border-amber-200 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          Upload Guide — Read Before Proceeding
        </CardTitle>
        <CardDescription className="text-xs text-amber-700/80 dark:text-amber-400/80">
          Follow all rules below to avoid validation errors and ensure correct data import.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Tab bar */}
        <div className="flex gap-1 rounded-lg bg-muted p-1 text-xs flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 min-w-fit rounded-md px-3 py-1.5 font-medium transition-colors whitespace-nowrap ${
                tab === t.key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Pre-Upload Checklist ────────────────────────────────── */}
        {tab === "checklist" && (
          <div className="space-y-3">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Complete all steps in order before uploading</p>
            {(
              [
                {
                  title: "Upload all images and videos first",
                  desc: "Every image or video you plan to reference in the Excel sheet must be uploaded to the server before you run validation. Use the Bulk Image Upload page — files are stored under uploads/bulk/ using their original filenames.",
                  link: true,
                },
                {
                  title: "Prepare your Excel workbook with 3 required sheets",
                  desc: "The workbook must contain sheets named product_base, product_models, and product_variants (exact names, any order). Use the Download Template button above to get a correctly named file. FAQs are uploaded separately using the FAQ Upload section below.",
                },
                {
                  title: "Fill all required fields — leave no required cell empty",
                  desc: "Fields marked as required (red dot in the Column Reference) must be present and non-empty in every row. A single missing required field will cause that row — and the entire upload — to fail validation.",
                },
                {
                  title: "Ensure all cross-sheet references match exactly",
                  desc: "base_title in product_models must exactly match a title in product_base. base_title + model_title in product_variants must exactly match a row in product_models. Any mismatch is a validation error.",
                },
                {
                  title: "Verify every image filename before saving the file",
                  desc: "Filenames in media_path (product_models), cover_image, hover_image, images, and video_thumbnails (product_variants) must already exist in uploads/bulk/. Filenames are case-sensitive. Do not include the folder path — filenames only.",
                },
                {
                  title: "Validate first, approve only after zero errors",
                  desc: "Click Validate File and fix every reported error before clicking Approve. Do not bypass the validation step. The approval button only becomes available after a clean validation pass.",
                },
              ] as { title: string; desc: string; link?: boolean }[]
            ).map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  {item.link && (
                    <Link
                      to="/product-bulk-image-upload"
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline mt-0.5"
                    >
                      Go to Bulk Image Upload <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Tab: Image & Media Rules ─────────────────────────────────── */}
        {tab === "images" && (
          <div className="space-y-4">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
              All filenames must be pre-uploaded to uploads/bulk/ before validation
            </p>

            <div className="rounded-lg border p-3 space-y-2">
              <p className="text-xs font-semibold font-mono text-primary">product_models</p>
              <FieldRule field="media_path" required desc="Single filename. The main display image for the model." example="ec-blk-model.jpg" />
            </div>

            <div className="rounded-lg border p-3 space-y-2">
              <p className="text-xs font-semibold font-mono text-primary">product_variants</p>
              <div className="space-y-2">
                <FieldRule field="cover_image" desc="Single filename. The primary card/cover image shown in listings." example="ec-blk-m-cover.jpg" />
                <FieldRule field="hover_image" desc="Single filename. The alternate image shown on hover." example="ec-blk-m-hover.jpg" />
                <FieldRule
                  field="brochure"
                  desc="Single filename for a downloadable brochure/PDF attached to this variant."
                  example="ec-blk-m-brochure.pdf"
                />
                <FieldRule
                  field="images"
                  desc="Comma-separated filenames. Can mix images and videos in any display order. Videos are auto-detected by extension — no extra column needed."
                  example="img1.jpg, img2.jpg, tour.mp4"
                />
                <FieldRule
                  field="video_thumbnails"
                  desc="Comma-separated thumbnail filenames — one per video in the images column, in the exact same order the videos appear. Must not contain more entries than there are videos."
                  example="tour-thumb.jpg"
                />
                <FieldRule
                  field="project_images"
                  desc="Comma-separated filenames for the project/inspiration gallery shown on the variant page. Separate from the main product gallery."
                  example="proj1.jpg, proj2.jpg"
                />
              </div>
            </div>

            <div className="rounded-md bg-muted/50 border p-3 space-y-1.5 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">Video Detection & Thumbnail Rules</p>
              <p>
                Supported video extensions: <code className="bg-muted px-1 rounded">.mp4</code> <code className="bg-muted px-1 rounded">.webm</code>{" "}
                <code className="bg-muted px-1 rounded">.mov</code> <code className="bg-muted px-1 rounded">.avi</code>{" "}
                <code className="bg-muted px-1 rounded">.mkv</code>
              </p>
              <p>
                Thumbnails are mapped to videos positionally — the 1st thumbnail goes with the 1st video found in{" "}
                <code className="bg-muted px-1 rounded">images</code>, the 2nd thumbnail with the 2nd video, and so on.
              </p>
              <p>Having more thumbnails than videos is a validation error.</p>
            </div>

            <div className="rounded-md bg-destructive/5 border border-destructive/20 p-3 space-y-1 text-xs text-destructive">
              <p className="font-semibold flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Strict Rules — Violations Fail Validation
              </p>
              <p>
                • Filenames are <strong>case-sensitive</strong> — <code>Cover.jpg</code> and <code>cover.jpg</code> are different files
              </p>
              <p>
                • Enter filenames <strong>only</strong> — do not include the <code>uploads/bulk/</code> prefix
              </p>
              <p>• No spaces around commas in comma-separated lists</p>
              <p>
                • Files must be uploaded to the server <strong>before</strong> you validate the Excel file
              </p>
              <p>
                • Any filename not found in <code>uploads/bulk/</code> will be reported as a validation error
              </p>
            </div>
          </div>
        )}

        {/* ── Tab: Sheet & Data Rules ──────────────────────────────────── */}
        {tab === "data" && (
          <div className="space-y-4">
            <div className="rounded-md bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 p-3 text-xs text-blue-800 dark:text-blue-300 space-y-1">
              <p className="font-semibold">Content fields are now on product_variants</p>
              <p>
                <code className="bg-muted px-1 rounded">description</code>, <code className="bg-muted px-1 rounded">details</code>,{" "}
                <code className="bg-muted px-1 rounded">enhance_title</code>, <code className="bg-muted px-1 rounded">details_points</code>, and{" "}
                <code className="bg-muted px-1 rounded">additional_details</code> (plus their <code className="bg-muted px-1 rounded">_ar</code>{" "}
                equivalents) are columns on <strong>product_variants</strong>, not product_base. The product_base sheet now only needs{" "}
                <code className="bg-muted px-1 rounded">title</code> and <code className="bg-muted px-1 rounded">title_ar</code>.
              </p>
            </div>

            <div className="rounded-lg border p-3 space-y-2">
              <p className="text-xs font-semibold">Sheet Linking (cross-sheet references)</p>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p>
                  <code className="bg-muted px-1 rounded text-foreground">product_models → base_title</code> must exactly match a{" "}
                  <code className="bg-muted px-1 rounded text-foreground">title</code> value in the product_base sheet.
                </p>
                <p>
                  <code className="bg-muted px-1 rounded text-foreground">product_variants → base_title + model_title</code> must exactly match a row
                  in product_models under the same <code className="bg-muted px-1 rounded text-foreground">base_title</code>.
                </p>
                <p className="pt-1 text-[11px] text-blue-700 dark:text-blue-400">
                  <strong>FAQs</strong> are uploaded separately in the FAQ Upload section below — they are not part of this workbook.
                </p>
                <p className="pt-1 text-[11px]">
                  <strong className="text-foreground">Tip:</strong> Copy values directly — even a single extra space causes a mismatch error.
                </p>
              </div>
            </div>

            <div className="rounded-lg border p-3 space-y-2">
              <p className="text-xs font-semibold">Data Types</p>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Boolean fields</span> (<code className="bg-muted px-1 rounded">status</code>,{" "}
                  <code className="bg-muted px-1 rounded">is_featured</code>) — accepted values: <code className="bg-muted px-1 rounded">true</code> /{" "}
                  <code className="bg-muted px-1 rounded">false</code>, <code className="bg-muted px-1 rounded">1</code> /{" "}
                  <code className="bg-muted px-1 rounded">0</code>, <code className="bg-muted px-1 rounded">yes</code> /{" "}
                  <code className="bg-muted px-1 rounded">no</code>
                </p>
                <p>
                  <span className="font-medium text-foreground">Decimal fields</span> (<code className="bg-muted px-1 rounded">base_price</code>,{" "}
                  <code className="bg-muted px-1 rounded">price</code>) — must be valid numbers, e.g.{" "}
                  <code className="bg-muted px-1 rounded">299.99</code>
                </p>
                <p>
                  <span className="font-medium text-foreground">Integer fields</span> (<code className="bg-muted px-1 rounded">stock</code>,{" "}
                  <code className="bg-muted px-1 rounded">sort_order</code>) — must be whole numbers, e.g.{" "}
                  <code className="bg-muted px-1 rounded">50</code>
                </p>
              </div>
            </div>

            <div className="rounded-lg border p-3 space-y-2">
              <p className="text-xs font-semibold">Categories — product_variants</p>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p>
                  Enter comma-separated category <strong>slugs</strong> (not display names). Example:{" "}
                  <code className="bg-muted px-1 rounded">office-chairs,ergonomic</code>
                </p>
                <p>All slugs must already exist in the database — unknown slugs are a validation error.</p>
              </div>
            </div>

            <div className="rounded-lg border p-3 space-y-2">
              <p className="text-xs font-semibold">Attributes — product_variants</p>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p>
                  Enter pipe-separated <code className="bg-muted px-1 rounded">attribute_slug:value_slug</code> pairs. Example:{" "}
                  <code className="bg-muted px-1 rounded">color:black|size:medium</code>
                </p>
                <p>Both the attribute slug and the value slug must exist in the database — unknown slugs are a validation error.</p>
                <p>
                  A variant can have multiple attribute pairs separated by <code className="bg-muted px-1 rounded">|</code>.
                </p>
              </div>
            </div>

            <div className="rounded-lg border p-3 space-y-2">
              <p className="text-xs font-semibold">Slugs (product_base & product_models)</p>
              <p className="text-xs text-muted-foreground">
                Slugs are <strong>auto-generated</strong> from the <code className="bg-muted px-1 rounded">title</code> field — do{" "}
                <strong>not</strong> include a slug column in either sheet. If the generated slug already exists, a numeric suffix is appended
                automatically (e.g. <code className="bg-muted px-1 rounded">my-chair-1</code>). Slugs are <strong>never changed</strong> on re-upload
                to preserve existing URLs.
              </p>
            </div>
          </div>
        )}

        {/* ── Tab: Re-upload Behavior ──────────────────────────────────── */}
        {tab === "upsert" && (
          <div className="space-y-4">
            <div className="rounded-md bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 p-3 text-xs text-green-800 dark:text-green-300 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Re-uploading the same file is safe
              </p>
              <p>
                If a record already exists in the database it will be <strong>updated</strong> with the new values from the sheet. Existing records
                are never deleted. New rows create new records; existing rows update existing records.
              </p>
            </div>

            <div className="rounded-lg border p-3 space-y-2">
              <p className="text-xs font-semibold">How existing records are matched</p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex gap-2">
                  <code className="bg-muted px-1.5 py-0.5 rounded text-foreground shrink-0">ProductBase</code>
                  <span>
                    Matched by <code className="bg-muted px-1 rounded">title</code> (case-sensitive)
                  </span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-1.5 py-0.5 rounded text-foreground shrink-0">ProductModels</code>
                  <span>
                    Matched by <code className="bg-muted px-1 rounded">base_title + title</code> combination
                  </span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-1.5 py-0.5 rounded text-foreground shrink-0">ProductVariants</code>
                  <span>
                    Matched by auto-generated <code className="bg-muted px-1 rounded">sku</code> (always present — derived from model code + attribute
                    slugs); falls back to <code className="bg-muted px-1 rounded">product_code</code> as a secondary key.
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-3 space-y-2">
              <p className="text-xs font-semibold">What changes on update</p>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">All data fields</span> — overwritten with the new values from the sheet
                </p>
                <p>
                  <span className="font-medium text-foreground">Slug</span> — <strong>never changed</strong> on update to avoid breaking existing
                  product URLs
                </p>
                <p>
                  <span className="font-medium text-foreground">Categories & Attributes</span> — fully replaced: all existing links for updated
                  variants are removed, then the new set from the sheet is inserted
                </p>
                <p>
                  <span className="font-medium text-foreground">Gallery Images & Project Images</span> — add-only: new filenames are inserted; images
                  that already exist for a variant are never removed or duplicated
                </p>
              </div>
            </div>

            <div className="rounded-md bg-muted/50 border p-3 text-xs text-muted-foreground space-y-1.5">
              <p className="font-medium text-foreground">Common re-upload scenarios</p>
              <p>
                • <strong>Price/stock change</strong> — update the value in the sheet and re-upload; variants will be updated, no errors
              </p>
              <p>
                • <strong>New variant added</strong> — add the row to the sheet; existing rows update, new row creates a new variant
              </p>
              <p>
                • <strong>Image replaced</strong> — the new cover_image path overwrites the old one; old gallery images remain (use the product editor
                to remove them)
              </p>
              <p>
                • <strong>Category changed</strong> — update the categories cell; the old category links are removed and the new ones are applied
              </p>
              <p>
                • <strong>FAQ updated</strong> — use the FAQ Upload section below; upload a new FAQ sheet and all old FAQs for affected variants are
                replaced
              </p>
              <p>
                • <strong>Project images added</strong> — add filenames to the project_images cell; existing project images are kept (add-only)
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Field Rule Row ─────────────────────────────────────────────────────── */

function FieldRule({ field, required = false, desc, example }: { field: string; required?: boolean; desc: string; example: string }) {
  return (
    <div className="rounded-md bg-muted/40 p-2 space-y-0.5">
      <div className="flex items-center gap-1.5">
        <code className="text-[11px] font-semibold text-primary">{field}</code>
        {required && (
          <Badge variant="destructive" className="text-[9px] px-1 py-0">
            required
          </Badge>
        )}
      </div>
      <p className="text-[11px] text-muted-foreground leading-relaxed">{desc}</p>
      <p className="text-[11px] font-mono text-muted-foreground/70">
        e.g. <strong className="text-muted-foreground">{example}</strong>
      </p>
    </div>
  );
}

/* ─── Helper: Column Reference Card ─────────────────────────────────────── */

function ColumnReference() {
  const [open, setOpen] = useState(false);

  const sheets = [
    {
      name: "product_base",
      // slug is auto-generated from title — not a sheet column
      // content fields (description, details, etc.) have moved to product_variants
      required: ["title", "title_ar"],
      optional: ["sort_order", "status"],
    },
    {
      name: "product_models",
      // base_title links to a title in product_base; slug is auto-generated
      required: ["base_title", "title", "title_ar", "base_price"],
      optional: ["code", "sort_order", "status", "media_path (filename in uploads/bulk/)"],
    },
    {
      name: "product_variants",
      // base_title + model_title identify the parent model
      // sku is auto-generated — do NOT include a sku column
      required: ["base_title", "model_title"],
      optional: [
        "product_code",
        "title",
        "title_ar",
        "design_title",
        "design_title_ar",
        "price",
        "stock",
        "is_featured",
        "sort_order",
        "status",
        "categories (comma-separated slugs)",
        "attributes (attr_slug:value_slug | separated)",
        "description",
        "description_ar",
        "enhance_title",
        "enhance_title_ar",
        "details",
        "details_ar",
        "details_points",
        "details_points_ar",
        "additional_details",
        "additional_details_ar",
        "cover_image (filename)",
        "hover_image (filename)",
        "brochure (filename)",
        "images (comma-separated filenames)",
        "video_thumbnails (one per video, in order)",
        "project_images (comma-separated filenames)",
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
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {sheets.map((sheet) => (
              <div key={sheet.name} className="rounded-lg border p-3 bg-muted/30">
                <p className="font-mono text-xs font-semibold text-primary mb-2">{sheet.name}</p>
                <div className="space-y-1">
                  {sheet.required.map((f) => (
                    <div key={f} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                      <span className="font-mono text-[11px]">{f}</span>
                      <Badge variant="destructive" className="text-[9px] px-1 py-0 ml-auto">
                        req
                      </Badge>
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
          <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
            <p>
              <strong>Linking:</strong> <code className="bg-muted px-1 rounded">base_title</code> in product_models must match a{" "}
              <code className="bg-muted px-1 rounded">title</code> in product_base.{" "}
              <code className="bg-muted px-1 rounded">base_title + model_title</code> in product_variants must match a row in product_models.
            </p>
            <p>
              <strong>Slugs:</strong> Auto-generated from <code className="bg-muted px-1 rounded">title</code> — do not include a slug column.
            </p>
            <p>
              <strong>SKU (product_variants):</strong> Auto-generated — do not include a <code className="bg-muted px-1 rounded">sku</code> column.
              Formula: <code className="bg-muted px-1 rounded">{"{model_code}-{attr_value_slug1}-{attr_value_slug2}"}</code> (all uppercase).
            </p>
            <p className="text-blue-700 dark:text-blue-400">
              <strong>FAQs</strong> are uploaded separately — use the FAQ Upload section below after your products are in the system.
            </p>
            <p>
              <strong>Images:</strong> All image filenames (<code className="bg-muted px-1 rounded">media_path</code> in product_models,{" "}
              <code className="bg-muted px-1 rounded">cover_image</code>, <code className="bg-muted px-1 rounded">hover_image</code>, and{" "}
              <code className="bg-muted px-1 rounded">images</code> in product_variants) must exist in{" "}
              <code className="bg-muted px-1 rounded">uploads/bulk/</code> before running this upload. See the image workflow note above.
            </p>
          </div>
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

function JobStatusCard({ jobId, onReset }: { jobId: string; onReset: () => void }) {
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
    waiting: { icon: <Clock className="h-5 w-5" />, color: "text-yellow-500", label: "Waiting in queue" },
    active: { icon: <Loader2 className="h-5 w-5 animate-spin" />, color: "text-blue-500", label: "Processing" },
    completed: { icon: <CheckCircle2 className="h-5 w-5" />, color: "text-green-500", label: "Completed" },
    failed: { icon: <XCircle className="h-5 w-5" />, color: "text-destructive", label: "Failed" },
    delayed: { icon: <Clock className="h-5 w-5" />, color: "text-muted-foreground", label: "Delayed" },
  };

  const cfg = status
    ? (stateConfig[status.state] ?? { icon: <Loader2 className="h-5 w-5 animate-spin" />, color: "text-muted-foreground", label: status.state })
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="h-5 w-5 text-primary" />
          Upload Job
          <code className="ml-auto font-mono text-xs bg-muted px-2 py-1 rounded text-muted-foreground">#{jobId}</code>
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
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {[
                    { label: "Bases Created", value: status.result.bases_created },
                    { label: "Bases Updated", value: status.result.bases_updated },
                    { label: "Models Created", value: status.result.models_created },
                    { label: "Models Updated", value: status.result.models_updated },
                    { label: "Variants Created", value: status.result.variants_created },
                    { label: "Variants Updated", value: status.result.variants_updated },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg border p-3 text-center">
                      <p className="text-2xl font-bold text-primary">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[{ label: "Category Links", value: status.result.category_links }].map((stat) => (
                    <div key={stat.label} className="rounded-lg border p-3 text-center">
                      <p className="text-2xl font-bold text-primary">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {status.state === "failed" && status.error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {status.error}
                {status.attempts_made !== undefined && <p className="mt-1 text-xs opacity-70">Attempts made: {status.attempts_made}</p>}
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

/* ─── Export Sheet Generator ─────────────────────────────────────────────── */

function generateUpdateSheet(data: { bases: any[]; models: any[]; variants: any[] }) {
  const wb = XLSX.utils.book_new();

  const boolStr = (v: boolean | null | undefined) => (v ? "TRUE" : "FALSE");

  // product_base
  const baseHeaders = ["title", "title_ar", "sort_order", "status"];
  const baseRows = data.bases.map((b) => [b.title, b.title_ar, b.sort_order, boolStr(b.status)]);
  const baseWs = XLSX.utils.aoa_to_sheet([baseHeaders, ...baseRows]);
  baseWs["!cols"] = [{ wch: 36 }, { wch: 36 }, { wch: 14 }, { wch: 10 }];
  XLSX.utils.book_append_sheet(wb, baseWs, "product_base");

  // product_models
  const modelHeaders = ["base_title", "title", "title_ar", "code", "base_price", "sort_order", "status", "media_path"];
  const modelDataRows = data.models.map((m) => [
    m.base_title,
    m.title,
    m.title_ar,
    m.code,
    m.base_price,
    m.sort_order,
    boolStr(m.status),
    m.media_path ?? "",
  ]);
  const modelWs = XLSX.utils.aoa_to_sheet([modelHeaders, ...modelDataRows]);
  modelWs["!cols"] = modelHeaders.map(() => ({ wch: 22 }));
  XLSX.utils.book_append_sheet(wb, modelWs, "product_models");

  // product_variants
  const variantHeaders = [
    "base_title",
    "model_title",
    "product_code",
    "title",
    "title_ar",
    "design_title",
    "design_title_ar",
    "price",
    "stock",
    "is_featured",
    "sort_order",
    "status",
    "categories",
    "attributes",
    "description",
    "description_ar",
    "enhance_title",
    "enhance_title_ar",
    "details",
    "details_ar",
    "details_points",
    "details_points_ar",
    "additional_details",
    "additional_details_ar",
    "cover_image",
    "hover_image",
    "brochure",
    "images",
    "video_thumbnails",
    "project_images",
  ];
  const variantDataRows = data.variants.map((v) => [
    v.base_title,
    v.model_title,
    v.product_code,
    v.title,
    v.title_ar,
    v.design_title,
    v.design_title_ar,
    v.price,
    v.stock,
    boolStr(v.is_featured),
    v.sort_order,
    boolStr(v.status),
    v.categories,
    v.attributes,
    v.description,
    v.description_ar,
    v.enhance_title,
    v.enhance_title_ar,
    v.details,
    v.details_ar,
    v.details_points,
    v.details_points_ar,
    v.additional_details,
    v.additional_details_ar,
    v.cover_image ?? "",
    v.hover_image ?? "",
    v.brochure ?? "",
    v.images ?? "",
    v.video_thumbnails ?? "",
    v.project_images ?? "",
  ]);
  const wideVariantCols = new Set([
    "attributes",
    "categories",
    "description",
    "description_ar",
    "details",
    "details_ar",
    "details_points",
    "details_points_ar",
    "additional_details",
    "additional_details_ar",
    "enhance_title",
    "enhance_title_ar",
    "images",
    "video_thumbnails",
    "project_images",
  ]);
  const variantWs = XLSX.utils.aoa_to_sheet([variantHeaders, ...variantDataRows]);
  variantWs["!cols"] = variantHeaders.map((h) => (wideVariantCols.has(h) ? { wch: 44 } : { wch: 22 }));
  XLSX.utils.book_append_sheet(wb, variantWs, "product_variants");

  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  XLSX.writeFile(wb, `bosq_bulk_update_${date}.xlsx`);
}

/* ─── Export Dialog ──────────────────────────────────────────────────────── */

const EXPORT_PAGE_SIZE = 20;

function ExportDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [generating, setGenerating] = useState(false);

  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search input
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 400);
  };

  // Fetch variants on page/search change
  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchProductVariantList(page, EXPORT_PAGE_SIZE, debouncedSearch || undefined);
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

  // Reset dialog state when opened
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

  // Toggle all on current page
  const currentPageIds = variants.map((v) => v.id!).filter(Boolean);
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
      const result = await exportVariantData(Array.from(selectedIds));
      if (result.status === "success" && result.data) {
        generateUpdateSheet(result.data);
        toast({ title: "Sheet generated", description: `Downloaded ${result.data.variants.length} variant row(s).` });
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
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v && !generating) onClose();
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <TableIcon className="h-5 w-5 text-primary" />
            Get Update Data Sheet
          </DialogTitle>
          <DialogDescription>Select variants to include in a pre-filled Excel sheet you can edit and re-upload.</DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="px-6 py-3 border-b shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search variant by SKU or title" value={search} onChange={handleSearchChange} className="pl-9" />
          </div>
        </div>

        {/* Table */}
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
                <TableHead>Title</TableHead>
                <TableHead>Base Product</TableHead>
                <TableHead>Model</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                    Loading variants…
                  </TableCell>
                </TableRow>
              ) : variants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No variants found.
                  </TableCell>
                </TableRow>
              ) : (
                variants.map((v) => {
                  const id = v.id!;
                  const isChecked = selectedIds.has(id);
                  return (
                    <TableRow key={id} className={`cursor-pointer hover:bg-muted/50 ${isChecked ? "bg-primary/5" : ""}`} onClick={() => toggleId(id)}>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={isChecked} onCheckedChange={() => toggleId(id)} aria-label={`Select variant ${v.sku}`} />
                      </TableCell>
                      <TableCell className="font-mono text-xs">{v.sku || "—"}</TableCell>
                      <TableCell className="text-sm">{v.title || "—"}</TableCell>
                      <TableCell className="text-sm">{v.productModel?.product?.title || "—"}</TableCell>
                      <TableCell className="text-sm">{v.productModel?.title || "—"}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={v.status ? "default" : "secondary"} className="text-xs">
                          {v.status ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination + footer */}
        <div className="px-6 py-3 border-t shrink-0 flex items-center justify-between gap-4 bg-muted/30">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
            >
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
            {selectedCount > 0 && (
              <span className="text-xs text-muted-foreground">
                {selectedCount} variant{selectedCount !== 1 ? "s" : ""} selected
              </span>
            )}
            <Button variant="outline" size="sm" onClick={onClose} disabled={generating}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleGenerate} disabled={selectedCount === 0 || generating}>
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Sheet{selectedCount > 0 ? ` (${selectedCount})` : ""}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */

export default function ProductBulkUpload() {
  const { toast } = useToast();

  const [phase, setPhase] = useState<Phase>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const reset = () => {
    setPhase("idle");
    setFile(null);
    setValidationResult(null);
    setJobId(null);
  };

  /* File drop */
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
          <p className="text-muted-foreground mt-1">Upload an Excel file to create Products, Models, and Variants in bulk.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => setExportDialogOpen(true)} className="gap-2">
            <TableIcon className="h-4 w-4" />
            Get Update Data Sheet
          </Button>
          <Button variant="outline" size="sm" onClick={downloadTemplate} className="gap-2">
            <Download className="h-4 w-4" />
            Download Template
          </Button>
        </div>
      </div>

      {/* Export Dialog */}
      <ExportDialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)} />

      {/* Step Indicator */}
      <StepIndicator phase={phase} />

      {/* Upload Guide */}
      <UploadGuide />

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
                  <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024).toFixed(1)} KB — click or drop to replace</p>
                </>
              ) : (
                <>
                  <UploadCloud className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium">{isDragActive ? "Drop the file here" : "Drop your Excel file here"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Supports .xlsx and .xls — max 50 MB</p>
                </>
              )}
            </div>

            {file && (
              <Button className="w-full mt-4" onClick={handleValidate} disabled={isDisabled}>
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
                <Button className="flex-1" onClick={handleApprove} disabled={phase === "approving"}>
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
      {phase === "monitoring" && jobId && <JobStatusCard jobId={jobId} onReset={reset} />}

      {/* ── FAQ Upload Section ─────────────────────────────────────────── */}
      <FaqUploadSection />
    </div>
  );
}

/* ─── FAQ Upload Section ─────────────────────────────────────────────────── */

type FaqPhase = "idle" | "validating" | "validated_fail" | "validated_ok" | "approving" | "monitoring";

function FaqUploadSection() {
  const { toast } = useToast();

  const [faqPhase, setFaqPhase] = useState<FaqPhase>("idle");
  const [faqFile, setFaqFile] = useState<File | null>(null);
  const [faqValidationResult, setFaqValidationResult] = useState<FaqValidationResult | null>(null);
  const [faqJobId, setFaqJobId] = useState<string | null>(null);
  const [faqJobStatus, setFaqJobStatus] = useState<FaqJobStatus | null>(null);
  const [faqPolling, setFaqPolling] = useState(false);
  const [faqStatusError, setFaqStatusError] = useState<string | null>(null);
  const faqIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetFaq = () => {
    setFaqPhase("idle");
    setFaqFile(null);
    setFaqValidationResult(null);
    setFaqJobId(null);
    setFaqJobStatus(null);
    setFaqPolling(false);
    setFaqStatusError(null);
    if (faqIntervalRef.current) clearInterval(faqIntervalRef.current);
  };

  const onFaqDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) {
        setFaqFile(accepted[0]);
        setFaqValidationResult(null);
        if (faqPhase !== "idle") setFaqPhase("idle");
      }
    },
    [faqPhase],
  );

  const {
    getRootProps: getFaqRootProps,
    getInputProps: getFaqInputProps,
    isDragActive: isFaqDragActive,
  } = useDropzone({
    onDrop: onFaqDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
    disabled: faqPhase === "validating" || faqPhase === "approving" || faqPhase === "monitoring",
  });

  const handleFaqValidate = async () => {
    if (!faqFile) return;
    setFaqPhase("validating");
    setFaqValidationResult(null);
    try {
      const result = await validateFaqUpload(faqFile);
      setFaqValidationResult(result);
      setFaqPhase(result.status === "success" ? "validated_ok" : "validated_fail");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "FAQ validation failed", variant: "destructive" });
      setFaqPhase("idle");
    }
  };

  const handleFaqApprove = async () => {
    if (!faqValidationResult?.token) return;
    setFaqPhase("approving");
    try {
      const result = await approveFaqUpload(faqValidationResult.token);
      setFaqJobId(result.job_id);
      setFaqPhase("monitoring");
      setFaqPolling(true);
      toast({ title: "FAQ upload queued", description: `Job #${result.job_id} is processing in the background.` });
    } catch (err: any) {
      toast({ title: "Approval failed", description: err.message || "Could not queue FAQ upload", variant: "destructive" });
      setFaqPhase("validated_ok");
    }
  };

  const fetchFaqStatus = useCallback(async () => {
    if (!faqJobId) return;
    try {
      const data = await getFaqUploadStatus(faqJobId);
      setFaqJobStatus(data);
      if (data.state === "completed" || data.state === "failed") {
        setFaqPolling(false);
        if (faqIntervalRef.current) clearInterval(faqIntervalRef.current);
      }
    } catch (err: any) {
      setFaqStatusError(err.message || "Failed to fetch FAQ job status");
      setFaqPolling(false);
      if (faqIntervalRef.current) clearInterval(faqIntervalRef.current);
    }
  }, [faqJobId]);

  useEffect(() => {
    if (faqPhase === "monitoring" && faqJobId) {
      fetchFaqStatus();
      faqIntervalRef.current = setInterval(fetchFaqStatus, 3000);
      return () => {
        if (faqIntervalRef.current) clearInterval(faqIntervalRef.current);
      };
    }
  }, [faqPhase, faqJobId, fetchFaqStatus]);

  const isFaqDisabled = faqPhase === "validating" || faqPhase === "approving" || faqPhase === "monitoring";

  const stateConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    waiting: { icon: <Clock className="h-5 w-5" />, color: "text-yellow-500", label: "Waiting in queue" },
    active: { icon: <Loader2 className="h-5 w-5 animate-spin" />, color: "text-blue-500", label: "Processing" },
    completed: { icon: <CheckCircle2 className="h-5 w-5" />, color: "text-green-500", label: "Completed" },
    failed: { icon: <XCircle className="h-5 w-5" />, color: "text-destructive", label: "Failed" },
    delayed: { icon: <Clock className="h-5 w-5" />, color: "text-muted-foreground", label: "Delayed" },
  };

  return (
    <div className="border-t pt-8 mt-4 space-y-6">
      {/* FAQ section header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">FAQ Bulk Upload</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Upload FAQs for existing variants. Products must already be in the system before uploading FAQs.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={downloadFaqTemplate} className="shrink-0 gap-2">
          <Download className="h-4 w-4" />
          Download FAQ Template
        </Button>
      </div>

      {/* Brief guide */}
      <div className="rounded-lg border bg-muted/30 p-4 text-xs text-muted-foreground space-y-1.5">
        <p className="font-semibold text-foreground text-sm">How it works</p>
        <p>1. Upload your products via the main bulk upload above first.</p>
        <p>
          2. Fill the FAQ sheet: each row needs a <code className="bg-muted px-1 rounded text-foreground">sku</code> matching the auto-generated SKU
          of the target variant, plus <code className="bg-muted px-1 rounded text-foreground">question</code> and{" "}
          <code className="bg-muted px-1 rounded text-foreground">answer</code>.
        </p>
        <p>
          3. SKU formula: <code className="bg-muted px-1 rounded text-foreground">{"{model_code}-{attr_value_slug1}-{attr_value_slug2}"}</code> (all
          uppercase). Example: model code <code className="bg-muted px-1 rounded">EC-BLK</code> + attributes{" "}
          <code className="bg-muted px-1 rounded">color:black|size:medium</code> → <code className="bg-muted px-1 rounded">EC-BLK-BLACK-MEDIUM</code>
        </p>
        <p>4. Re-uploading replaces all existing FAQs for the affected variants (full replace per variant).</p>
      </div>

      {/* Drop zone */}
      {faqPhase !== "monitoring" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Select FAQ Excel File</CardTitle>
            <CardDescription>
              Must contain a sheet named <code>product_faqs</code>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getFaqRootProps()}
              className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center cursor-pointer transition-colors ${
                isFaqDragActive
                  ? "border-primary bg-primary/5"
                  : faqFile
                    ? "border-primary/50 bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/40 hover:bg-muted/30"
              } ${isFaqDisabled ? "pointer-events-none opacity-60" : ""}`}
            >
              <input {...getFaqInputProps()} />
              {faqFile ? (
                <>
                  <FileSpreadsheet className="h-10 w-10 text-primary mb-3" />
                  <p className="font-medium text-sm">{faqFile.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{(faqFile.size / 1024).toFixed(1)} KB — click or drop to replace</p>
                </>
              ) : (
                <>
                  <UploadCloud className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium">{isFaqDragActive ? "Drop the file here" : "Drop your FAQ Excel file here"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Supports .xlsx and .xls — max 50 MB</p>
                </>
              )}
            </div>

            {faqFile && (
              <Button className="w-full mt-4" onClick={handleFaqValidate} disabled={isFaqDisabled}>
                {faqPhase === "validating" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Validating…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Validate FAQ File
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* FAQ Validation Results */}
      {faqValidationResult && faqPhase !== "monitoring" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              {faqValidationResult.status === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              {faqValidationResult.status === "success" ? "FAQ Validation Passed" : "FAQ Validation Failed"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqValidationResult.summary && (
              <div className="flex flex-wrap gap-3">
                {faqValidationResult.status === "success" ? (
                  <>
                    <StatBadge label="FAQs" value={faqValidationResult.summary.total_faqs ?? 0} color="blue" />
                    <StatBadge label="Variants" value={faqValidationResult.summary.total_variants ?? 0} color="green" />
                  </>
                ) : (
                  <>
                    <StatBadge label="Total Rows" value={faqValidationResult.summary.total_rows ?? 0} color="blue" />
                    <StatBadge label="Valid" value={faqValidationResult.summary.valid_rows ?? 0} color="green" />
                    <StatBadge label="Invalid" value={faqValidationResult.summary.invalid_rows ?? 0} color="red" />
                  </>
                )}
              </div>
            )}

            {faqValidationResult.errors && faqValidationResult.errors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  {faqValidationResult.errors.length} error{faqValidationResult.errors.length !== 1 ? "s" : ""} found
                </div>
                <ErrorTable errors={faqValidationResult.errors} />
              </div>
            )}

            <div className="flex gap-3 pt-1">
              {faqValidationResult.status === "failed" && (
                <Button variant="outline" onClick={resetFaq} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Fix & Re-upload
                </Button>
              )}
              {faqValidationResult.status === "success" && (
                <Button className="flex-1" onClick={handleFaqApprove} disabled={faqPhase === "approving"}>
                  {faqPhase === "approving" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Queuing…
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Approve & Upload FAQs
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQ Job Monitor */}
      {faqPhase === "monitoring" && faqJobId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="h-5 w-5 text-primary" />
              FAQ Upload Job
              <code className="ml-auto font-mono text-xs bg-muted px-2 py-1 rounded text-muted-foreground">#{faqJobId}</code>
            </CardTitle>
            {faqPolling && (
              <CardDescription className="flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin" />
                Auto-refreshing every 3 seconds…
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {faqStatusError && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <XCircle className="h-4 w-4" />
                {faqStatusError}
              </div>
            )}

            {faqJobStatus &&
              (() => {
                const cfg = stateConfig[faqJobStatus.state] ?? {
                  icon: <Loader2 className="h-5 w-5 animate-spin" />,
                  color: "text-muted-foreground",
                  label: faqJobStatus.state,
                };
                return (
                  <>
                    <div className={`flex items-center gap-2 font-medium ${cfg.color}`}>
                      {cfg.icon}
                      {cfg.label}
                    </div>

                    {faqJobStatus.state === "completed" && faqJobStatus.result && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg border p-3 text-center">
                          <p className="text-2xl font-bold text-primary">{faqJobStatus.result.faqs_inserted}</p>
                          <p className="text-xs text-muted-foreground mt-1">FAQs Inserted</p>
                        </div>
                        <div className="rounded-lg border p-3 text-center">
                          <p className="text-2xl font-bold text-primary">{faqJobStatus.result.variants_updated}</p>
                          <p className="text-xs text-muted-foreground mt-1">Variants Updated</p>
                        </div>
                      </div>
                    )}

                    {faqJobStatus.state === "failed" && faqJobStatus.error && (
                      <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                        {faqJobStatus.error}
                        {faqJobStatus.attempts_made !== undefined && (
                          <p className="mt-1 text-xs opacity-70">Attempts made: {faqJobStatus.attempts_made}</p>
                        )}
                      </div>
                    )}
                  </>
                );
              })()}

            {!faqPolling && (
              <Button variant="outline" size="sm" onClick={resetFaq} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Upload Another FAQ File
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* ─── Small helper ───────────────────────────────────────────────────────── */

function StatBadge({ label, value, color }: { label: string; value: number; color: "blue" | "purple" | "green" | "red" }) {
  const cls: Record<string, string> = {
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };

  return (
    <div className={`rounded-lg px-3 py-2 text-center min-w-[80px] ${cls[color]}`}>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs">{label}</p>
    </div>
  );
}
