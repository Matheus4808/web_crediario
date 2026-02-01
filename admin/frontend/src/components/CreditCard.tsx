import { Phone, User } from 'lucide-react';
import { CreditApplication } from '@/types/credit';
import { StatusBadge } from './StatusBadge';
import { cn } from '@/lib/utils';

interface CreditCardProps {
  credit: CreditApplication;
  onClick: () => void;
  index: number;
}

export function CreditCard({ credit, onClick, index }: CreditCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-5 rounded-xl bg-card border border-border',
        'card-hover cursor-pointer group',
        'opacity-0 animate-fade-up',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
      )}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <User size={18} className="text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {credit.name}
              </h3>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Phone size={12} />
                <span>{credit.phone}</span>
              </div>
            </div>
          </div>
        </div>
        <StatusBadge status={credit.status} />
      </div>

      <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
        <span>CPF: {credit.cpf}</span>
        <span>{new Date(credit.createdAt).toLocaleDateString('pt-BR')}</span>
      </div>
    </button>
  );
}
