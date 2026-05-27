import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStatesByCountry, getActiveCategories, updateDeliveryRules } from "@/services/deliveryRulesApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";

export default function DeliveryChargesList() {
  const queryClient = useQueryClient();
  const [selectedState, setSelectedState] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rulesForm, setRulesForm] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const { data: statesRes, isLoading: statesLoading } = useQuery({
    queryKey: ["delivery-states"],
    queryFn: () => getStatesByCountry("ae"),
  });

  const { data: categoriesRes } = useQuery({
    queryKey: ["active-categories"],
    queryFn: () => getActiveCategories(),
  });

  const states = statesRes?.data || [];
  const categories = categoriesRes?.data || [];

  const handleManageRules = (state: any) => {
    setSelectedState(state);
    setSelectedCategoryId(""); // Reset dropdown
    
    const existingRules = state.delivery_rules || [];
    const formState = [];
    
    // 1. Default rule (category_id: null) - always present at the top
    const defaultRule = existingRules.find((r: any) => r.category_id === null);
    formState.push({
      category_id: null,
      name: "Default (All other categories)",
      charge: defaultRule ? Number(defaultRule.charge) : 0,
      is_free: defaultRule ? defaultRule.is_free : false,
    });

    // 2. Existing specific category rules
    existingRules.forEach((rule: any) => {
      if (rule.category_id !== null) {
        const cat = categories.find((c: any) => c.id === rule.category_id);
        if (cat) {
          formState.push({
            category_id: cat.id,
            name: cat.name,
            charge: Number(rule.charge),
            is_free: rule.is_free,
          });
        }
      }
    });

    setRulesForm(formState);
    setIsModalOpen(true);
  };

  const handleAddCategoryRule = () => {
    if (!selectedCategoryId) return;
    const catId = parseInt(selectedCategoryId);
    
    // Check if already in form
    if (rulesForm.some(r => r.category_id === catId)) {
      toast.error("Rule for this category already exists");
      return;
    }

    const cat = categories.find((c: any) => c.id === catId);
    if (!cat) return;

    setRulesForm([
      ...rulesForm,
      {
        category_id: cat.id,
        name: cat.name,
        charge: 0,
        is_free: false,
      }
    ]);
    setSelectedCategoryId("");
  };

  const handleRemoveRule = (index: number) => {
    const updated = [...rulesForm];
    updated.splice(index, 1);
    setRulesForm(updated);
  };

  const updateRulesMutation = useMutation({
    mutationFn: (data: { stateId: number; rules: any[] }) =>
      updateDeliveryRules(data.stateId, data.rules),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-states"] });
      toast.success("Delivery rules updated successfully");
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update delivery rules");
    },
  });

  const handleSave = () => {
    if (!selectedState) return;

    // Validation: Explicitly added categories must have a charge > 0 if not free
    const invalidRule = rulesForm.find(r => r.category_id !== null && !r.is_free && (r.charge === null || r.charge <= 0));
    if (invalidRule) {
      toast.error(`Please enter a valid charge (greater than 0) for ${invalidRule.name} or mark it as Free.`);
      return;
    }

    updateRulesMutation.mutate({
      stateId: selectedState.id,
      rules: rulesForm,
    });
  };

  const handleRuleChange = (index: number, field: string, value: any) => {
    const updated = [...rulesForm];
    updated[index] = { ...updated[index], [field]: value };
    setRulesForm(updated);
  };

  // Filter categories for the dropdown (exclude already added ones and only include parent categories)
  const availableCategories = categories.filter((c: any) => 
    !c.parent_id && !rulesForm.some(r => r.category_id === c.id)
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Delivery Charges (UAE)</h1>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>State Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Current Rules Count</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statesLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-500" />
                </TableCell>
              </TableRow>
            ) : states.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  No states found.
                </TableCell>
              </TableRow>
            ) : (
              states.map((state: any) => (
                <TableRow key={state.id}>
                  <TableCell className="font-medium">{state.name}</TableCell>
                  <TableCell>{state.slug}</TableCell>
                  <TableCell>{state.delivery_rules?.length || 0} rules</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleManageRules(state)}>
                      Manage Rules
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Delivery Rules - {selectedState?.name}</DialogTitle>
          </DialogHeader>

          <div className="py-2 space-y-6">
            
            {/* Add specific category rule section */}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 flex items-end gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Add Pricing Override for Specific Category</label>
                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select a category to override..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.length === 0 ? (
                      <SelectItem value="none" disabled>All categories added</SelectItem>
                    ) : (
                      availableCategories.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" onClick={handleAddCategoryRule} disabled={!selectedCategoryId || selectedCategoryId === "none"}>
                <Plus className="w-4 h-4 mr-2" />
                Add Override
              </Button>
            </div>

            {/* Rules list */}
            <div>
              <div className="grid grid-cols-12 gap-4 font-semibold border-b pb-2 px-2 text-sm text-gray-600">
                <div className="col-span-5">Category / Rule Type</div>
                <div className="col-span-2 text-center">Is Free?</div>
                <div className="col-span-3">Charge (AED)</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {rulesForm.map((rule, index) => (
                <div key={index} className={`grid grid-cols-12 gap-4 items-center py-4 border-b last:border-0 px-2 transition-colors ${rule.category_id === null ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}>
                  <div className="col-span-5 font-medium text-sm">
                    {rule.name}
                    {rule.category_id === null && <span className="text-xs text-blue-600 block font-normal mt-1">Applies to all unlisted categories</span>}
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <Checkbox
                      checked={rule.is_free}
                      onCheckedChange={(checked) => handleRuleChange(index, "is_free", checked)}
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={rule.is_free}
                      value={rule.charge}
                      onChange={(e) => handleRuleChange(index, "charge", parseFloat(e.target.value) || 0)}
                      className={rule.is_free ? 'opacity-50' : ''}
                    />
                  </div>
                  <div className="col-span-2 text-right">
                    {rule.category_id !== null ? (
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleRemoveRule(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    ) : (
                      <span className="text-xs text-gray-400 italic px-2">Required</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={updateRulesMutation.isPending}>
              {updateRulesMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Rules
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
