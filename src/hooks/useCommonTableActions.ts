import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { updateStatus, updateSortOrder, updateIsPrimary } from "@/services/commonApi";

interface UseCommonTableActionsProps<T> {
  modelName: string;
  data: T[];
  setData: React.Dispatch<React.SetStateAction<T[]>>;
}

export const useCommonTableActions = <T extends { id?: number }>({
  modelName,
  data,
  setData,
}: UseCommonTableActionsProps<T>) => {
  const { toast } = useToast();

  const [editingSortOrder, setEditingSortOrder] = useState<{ [key: number]: string }>({});
  const [updateTimeouts, setUpdateTimeouts] = useState<{ [key: number]: NodeJS.Timeout }>({});

  const handleStatusChange = async (id: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    try {
      await updateStatus({
        model_name: modelName,
        row_id: id,
        status: newStatus,
      });

      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );

      toast({ title: "Success", description: "Status updated successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const handleIsPrimaryChange = async (id: number, currentIsPrimary: boolean) => {
    const newIsPrimary = !currentIsPrimary;

    try {
      await updateIsPrimary({
        model_name: modelName,
        row_id: id,
        is_primary: newIsPrimary,
      });

      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_primary: newIsPrimary } : item
        )
      );

      toast({ title: "Success", description: "Primary status updated successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to update primary status", variant: "destructive" });
    }
  };




  
  const handleSortOrderChange = (id: number, newValue: string) => {
    setEditingSortOrder((prev) => ({ ...prev, [id]: newValue }));

    if (updateTimeouts[id]) clearTimeout(updateTimeouts[id]);

    const timeout = setTimeout(async () => {
      const sortOrder = parseInt(newValue, 10);
      if (isNaN(sortOrder)) return;

      try {
        await updateSortOrder({
          model_name: modelName,
          row_id: id,
          sort_order: sortOrder,
        });

        setData((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, sort_order: sortOrder } : item
          )
        );

        toast({ title: "Success", description: "Sort order updated successfully" });
      } catch {
        toast({ title: "Error", description: "Failed to update sort order", variant: "destructive" });
      } finally {
        setEditingSortOrder((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      }
    }, 1000);

    setUpdateTimeouts((prev) => ({ ...prev, [id]: timeout }));
  };

  return {
    editingSortOrder,
    handleStatusChange,
    handleSortOrderChange,
    handleIsPrimaryChange,
  };
};
