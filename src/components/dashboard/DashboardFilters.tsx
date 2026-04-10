import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface DashboardFiltersProps {
  year: number;
  month?: number;
  onChange: (year: number, month?: number) => void;
}

function getYearOptions() {
  const current = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => current - i);
}

export function DashboardFilters({ year, month, onChange }: DashboardFiltersProps) {
  const years = getYearOptions();

  return (
    <div className="flex items-center gap-3">
      <CalendarDays className="h-4 w-4 text-muted-foreground" />
      <Select
        value={String(year)}
        onValueChange={(val) => onChange(parseInt(val), month)}
      >
        <SelectTrigger className="w-28">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={month ? String(month) : "all"}
        onValueChange={(val) => onChange(year, val === "all" ? undefined : parseInt(val))}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="All Months" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Months</SelectItem>
          {MONTHS.map((name, i) => (
            <SelectItem key={i + 1} value={String(i + 1)}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
