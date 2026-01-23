import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, ArrowLeft, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import {
  fetchProductVariantById,
  createProductVariant,
  updateProductVariant,
  fetchAttributesWithValues,
  AttributeWithValues,
} from "@/services/product/productVariantApi";
import { fetchProductModelById, ProductModel } from "@/services/product/productModelApi";

interface AttributeValueSelection {
  id: string;
  valueId: number | null;
  price: string;
}

interface AttributeSelectionState {
  [attributeId: number]: AttributeValueSelection[];
}

export default function ProductVariantForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { productId, id } = useParams(); // productId is now model ID
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [model, setModel] = useState<ProductModel | null>(null);
  const [attributes, setAttributes] = useState<AttributeWithValues[]>([]);

  // Form state
  const [sku, setSku] = useState("");
  const [productCode, setProductCode] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(0);
  const [sortOrder, setSortOrder] = useState(1);
  const [status, setStatus] = useState(true);

  // Attribute selections organized by attribute ID
  const [attributeSelections, setAttributeSelections] = useState<AttributeSelectionState>({});

  useEffect(() => {
    loadInitialData();
  }, [productId, id]);

  const loadInitialData = async () => {
    try {
      setInitialLoading(true);

      // Load model info
      if (productId) {
        const modelResponse = await fetchProductModelById(parseInt(productId));
        setModel(modelResponse.data);
      }

      // Load attributes with values
      const attributesResponse = await fetchAttributesWithValues();
      if (attributesResponse.success) {
        setAttributes(attributesResponse.data);

        // Initialize empty selections for each attribute
        const initialSelections: AttributeSelectionState = {};
        attributesResponse.data.forEach((attr) => {
          initialSelections[attr.id] = [];
        });
        setAttributeSelections(initialSelections);
      }

      // Load variant data if editing
      if (isEditing && id) {
        const variantResponse = await fetchProductVariantById(parseInt(id));
        const data = variantResponse.data;

        setSku(data.sku || "");
        setProductCode(data.product_code || "");
        setPrice(data.price || "");
        setStock(data.stock || 0);
        setSortOrder(data.sort_order || 1);
        setStatus(data.status ?? true);

        // Set attribute selections if available
        if (data.variant_attributes && data.variant_attributes.length > 0) {
          const loadedSelections: AttributeSelectionState = {};

          // Initialize with empty arrays for all attributes
          attributesResponse.data.forEach((attr) => {
            loadedSelections[attr.id] = [];
          });

          // Populate with existing data
          data.variant_attributes.forEach((attr) => {
            if (!loadedSelections[attr.attribute_id]) {
              loadedSelections[attr.attribute_id] = [];
            }
            loadedSelections[attr.attribute_id].push({
              id: crypto.randomUUID(),
              valueId: attr.attribute_value_id,
              price: attr.price || "",
            });
          });

          setAttributeSelections(loadedSelections);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const addValueSelection = (attributeId: number) => {
    setAttributeSelections((prev) => ({
      ...prev,
      [attributeId]: [...(prev[attributeId] || []), { id: crypto.randomUUID(), valueId: null, price: "" }],
    }));
  };

  const removeValueSelection = (attributeId: number, selectionId: string) => {
    setAttributeSelections((prev) => ({
      ...prev,
      [attributeId]: prev[attributeId].filter((s) => s.id !== selectionId),
    }));
  };

  const updateValueSelection = (attributeId: number, selectionId: string, field: "valueId" | "price", value: number | string | null) => {
    setAttributeSelections((prev) => ({
      ...prev,
      [attributeId]: prev[attributeId].map((s) => (s.id === selectionId ? { ...s, [field]: value } : s)),
    }));
  };

  // Get the slug/code for an attribute value
  const getValueSlug = (attributeId: number, valueId: number): string => {
    const attribute = attributes.find((a) => a.id === attributeId);
    if (!attribute) return "";
    const value = attribute.values.find((v) => v.id === valueId);
    return value?.slug || "";
  };

  // Get already selected value IDs for a specific attribute
  const getSelectedValueIds = (attributeId: number, currentSelectionId: string): number[] => {
    const selections = attributeSelections[attributeId] || [];
    return selections.filter((s) => s.id !== currentSelectionId && s.valueId !== null).map((s) => s.valueId as number);
  };

  // Get available values for an attribute (excluding already selected ones)
  const getAvailableValues = (attributeId: number, currentSelectionId: string) => {
    const attribute = attributes.find((a) => a.id === attributeId);
    if (!attribute) return [];

    const selectedValueIds = getSelectedValueIds(attributeId, currentSelectionId);
    return attribute.values.filter((v) => !selectedValueIds.includes(v.id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId) return;

    // Collect all valid attribute selections
    const allSelections: { attribute_id: number; attribute_value_id: number; price: string; sku_code: string }[] = [];

    Object.entries(attributeSelections).forEach(([attrId, selections]) => {
      selections.forEach((s) => {
        if (s.valueId !== null) {
          allSelections.push({
            attribute_id: parseInt(attrId),
            attribute_value_id: s.valueId,
            price: s.price || "0",
            sku_code: getValueSlug(parseInt(attrId), s.valueId),
          });
        }
      });
    });

    try {
      setLoading(true);

      const variantData = {
        product_model_id: parseInt(productId),
        sku,
        product_code: productCode,
        price,
        stock,
        sort_order: sortOrder,
        status,
        attributes: allSelections,
      };

      if (isEditing && id) {
        await updateProductVariant(parseInt(id), variantData);
        toast({
          title: "Success",
          description: "Product variant updated successfully",
        });
      } else {
        await createProductVariant(variantData);
        toast({
          title: "Success",
          description: "Product variant created successfully",
        });
      }

      navigate(`/product-variants/${productId}/list`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? "update" : "create"} product variant`,
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
        <Button variant="outline" size="icon" onClick={() => navigate(`/product-variants/${productId}/list`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit" : "Add"} Product Variant
            {model ? ` for "${model.title}"` : ""}
          </h1>
          <p className="text-muted-foreground">{isEditing ? "Update" : "Create a new"} product variant</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information - only show when editing */}
        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>Variant Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" placeholder="Enter SKU" value={sku} onChange={(e) => setSku(e.target.value)} required disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productCode">Product Code</Label>
                  <Input
                    id="productCode"
                    placeholder="Enter product code"
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    required
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="Enter stock quantity"
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    placeholder="1"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>Status</Label>
                    <p className="text-sm text-muted-foreground">Enable or disable this variant</p>
                  </div>
                  <Switch checked={status} onCheckedChange={setStatus} />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Attribute Cards - One card per attribute */}
        {attributes.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-muted-foreground text-center">No attributes available</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {(isEditing
              ? attributes.filter((attr) => (attributeSelections[attr.id] || []).length > 0)
              : attributes
            ).map((attribute) => {
              const selections = attributeSelections[attribute.id] || [];

              return (
                <Card key={attribute.id}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">{attribute.name}</CardTitle>
                    {!isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addValueSelection(attribute.id)}
                        disabled={selections.length >= attribute.values.length}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selections.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">Click + to add {attribute.name.toLowerCase()} values</p>
                    ) : (
                      selections.map((selection) => (
                        <div key={selection.id} className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30">
                          <div className="flex-1 space-y-2">
                            <Select
                              value={selection.valueId?.toString() || ""}
                              onValueChange={(value) => updateValueSelection(attribute.id, selection.id, "valueId", parseInt(value))}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={`Select ${attribute.name.toLowerCase()}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {getAvailableValues(attribute.id, selection.id).map((val) => (
                                  <SelectItem key={val.id} value={val.id.toString()}>
                                    {val.value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Price adjustment"
                              value={selection.price}
                              onChange={(e) => updateValueSelection(attribute.id, selection.id, "price", e.target.value)}
                              className="w-full"
                            />
                          </div>
                          {!isEditing && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive shrink-0"
                              onClick={() => removeValueSelection(attribute.id, selection.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(`/product-variants/${productId}/list`)}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
}
