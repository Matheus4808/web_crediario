import { Search, Calendar, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CreditStatus } from '@/types/credit';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: CreditStatus | 'all';
  onStatusChange: (status: CreditStatus | 'all') => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

const statusOptions: { value: CreditStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Em análise' },
  { value: 'approved', label: 'Aprovados' },
  { value: 'rejected', label: 'Recusados' },
];

export function FilterBar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: FilterBarProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 mb-6 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Buscar por nome, CPF ou telefone..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-background"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Date filters */}
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1.5">
              <Calendar size={14} />
              Data inicial
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="flex-1">
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1.5">
              <Calendar size={14} />
              Data final
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="bg-background"
            />
          </div>
        </div>

        {/* Status filter */}
        <div className="flex-1">
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1.5">
            <Filter size={14} />
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onStatusChange(option.value)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  statusFilter === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
