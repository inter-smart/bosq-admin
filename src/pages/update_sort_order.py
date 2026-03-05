import re
import os

BASE_DIR = "/Users/intersmart/Desktop/AFSAL/BOSQ Ecomm/bosq-admin/src/pages"

FILES = [
    "product/AllProductModelsList.tsx",
    "product/BaseProductList.tsx",
    "product/ProductModelList.tsx",
    "product/ProductCategoriesList.tsx",
    "product/ProductAttributesList.tsx",
    "product/AttributeValuesList.tsx",
    "product/ProductSellingPointList.tsx",
    "product/ProductSectorsList.tsx",
    "product/ProductProjectImagesList.tsx",
    "product/ProductVariantImagesList.tsx",
    "cms/projects/ProjectsList.tsx",
    "cms/projects/ProjectImagesList.tsx",
    "cms/projects/ProjectCategoryList.tsx",
    "cms/projects/SpecialisedAreasList.tsx",
    "cms/home/HomeBannerSliderList.tsx",
    "cms/home/HomeBrandsList.tsx",
    "cms/home/FindYourFitsList.tsx",
    "cms/home/SmartSpaceCalculatorList.tsx",
    "cms/faq/FaqCategoryList.tsx",
    "cms/faq/FaqListList.tsx",
    "cms/materials/MaterialsList.tsx",
    "cms/materials/MaterialsCategoryList.tsx",
    "cms/materials/ExtraMaterialsList.tsx",
    "cms/delivery/DeliveryMethodList.tsx",
    "cms/delivery/DeliveryTimeList.tsx",
    "cms/about/WhyBosqList.tsx",
    "cms/about/AboutTestimonialsList.tsx",
    "cms/about/AboutOurClientsList.tsx",
    "cms/about/AboutJourneysList.tsx",
    "cms/sustainability/SustainabilityList.tsx",
    "cms/ergonomic-guide/ErgonomicsChairFeatureList.tsx",
    "common/SocialMediaList.tsx",
    "common/PaymentMethodsList.tsx",
    "policy/WarrantyPolicyList.tsx",
    "policy/PrivacyPolicyList.tsx",
    "policy/TermsAndConditionsList.tsx",
    "policy/ReturnPolicyList.tsx",
    "customization/CustomizationFeaturesList.tsx",
    "customization/CustomizationOptionsList.tsx",
    "customization/CustomizationProcessList.tsx",
    "landingPage/LandingPageList.tsx",
    "landingPage/ProductTypeList.tsx",
    "master/enquiryDropdown/EnquiryDropdownList.tsx",
]

NEW_CELL = '''      cell: ({ row }) => {
        const item = row.original;
        const currentVal =
          editingSortOrder[item.id!] !== undefined
            ? editingSortOrder[item.id!]
            : String(row.getValue("sort_order") || 1);
        const numVal = Math.max(1, parseInt(currentVal, 10) || 1);
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleSortOrderChange(item.id!, String(Math.max(1, numVal - 1)))}
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              min={1}
              value={currentVal}
              onChange={(e) => {
                const num = parseInt(e.target.value, 10);
                if (!isNaN(num) && num >= 1) {
                  handleSortOrderChange(item.id!, String(num));
                }
              }}
              className="w-14 h-7 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleSortOrderChange(item.id!, String(numVal + 1))}
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
          </div>
        );
      },'''

# Pattern to match the old sort_order cell content
# Matches from `cell: ({ row }) => {` up to (and including) the closing `},`
# within the sort_order column definition context.
# We use a broader approach: find the cell function that references editingSortOrder and has an <Input with w-20
OLD_CELL_PATTERN = re.compile(
    r'(      cell: \(\{ row \}\) => \{\s*'
    r'const item = row\.original;\s*'
    r'return \(\s*'
    r'<Input\s*'
    r'type="number"\s*'
    r'value=\{[^}]*editingSortOrder\[item\.id!\][^}]*\}[^<]*'
    r'onChange=\{\(e\) => handleSortOrderChange\(item\.id!, e\.target\.value\)\}\s*'
    r'className="w-20"\s*'
    r'/>\s*\);\s*\},)',
    re.DOTALL
)

results = []

for rel_path in FILES:
    full_path = os.path.join(BASE_DIR, rel_path)

    if not os.path.exists(full_path):
        results.append(f"MISSING: {rel_path}")
        continue

    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()

    original_content = content
    changed = False
    notes = []

    # 1. Replace old cell with new cell
    match = OLD_CELL_PATTERN.search(content)
    if match:
        content = content[:match.start()] + NEW_CELL + content[match.end():]
        notes.append("cell replaced")
        changed = True
    else:
        notes.append("cell pattern NOT found")

    # 2. Add ChevronUp and ChevronDown to lucide-react import
    lucide_import_pattern = re.compile(r'(import\s*\{)([^}]+)(\}\s*from\s*["\']lucide-react["\'])')
    lucide_match = lucide_import_pattern.search(content)

    if lucide_match:
        existing_imports = lucide_match.group(2)

        need_up = "ChevronUp" not in existing_imports
        need_down = "ChevronDown" not in existing_imports

        if need_up or need_down:
            # Strip trailing whitespace/newlines from existing imports
            stripped = existing_imports.rstrip()
            # Add comma if not already ending with comma
            if not stripped.rstrip().endswith(","):
                stripped = stripped + ","

            additions = []
            if need_down:
                additions.append(" ChevronDown")
            if need_up:
                additions.append(" ChevronUp")

            new_imports = stripped + "," .join(additions)
            content = content[:lucide_match.start(2)] + new_imports + content[lucide_match.end(2):]
            notes.append(f"added chevron icons: {', '.join(a.strip() for a in additions)}")
            changed = True
        else:
            notes.append("chevron icons already present")
    else:
        notes.append("lucide-react import NOT found")

    if changed:
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        results.append(f"UPDATED [{', '.join(notes)}]: {rel_path}")
    else:
        results.append(f"NO CHANGE [{', '.join(notes)}]: {rel_path}")

print("\n".join(results))
print(f"\nDone. Processed {len(FILES)} files.")
