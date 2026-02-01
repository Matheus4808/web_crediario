import { cn } from '@/lib/utils';
import { CreditStatus } from '@/types/credit';

interface StatusBadgeProps {
  status: CreditStatus;
  className?: string;
}

const statusConfig: Record<CreditStatus, { label: string; className: string }> = {
  pending: {
    label: 'Em análise',
    className: 'badge-pending',
  },
  approved: {
    label: 'Aprovado',
    className: 'badge-approved',
  },
  rejected: {
    label: 'Recusado',
    className: 'badge-rejected',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
