import { FileText, Download, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentCardProps {
  name: string;
  type: string;
  uploaded: boolean;
}

export function DocumentCard({ name, type, uploaded }: DocumentCardProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 rounded-lg border',
        uploaded
          ? 'bg-accent/30 border-primary/20'
          : 'bg-muted/30 border-border'
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            uploaded ? 'bg-primary/10' : 'bg-muted'
          )}
        >
          <FileText
            size={20}
            className={cn(uploaded ? 'text-primary' : 'text-muted-foreground')}
          />
        </div>
        <div>
          <p className={cn('font-medium', !uploaded && 'text-muted-foreground')}>
            {name}
          </p>
          <p className="text-xs text-muted-foreground">{type}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled={!uploaded}
          className={cn(
            'p-2 rounded-lg transition-colors',
            uploaded
              ? 'hover:bg-secondary text-foreground'
              : 'text-muted-foreground/50 cursor-not-allowed'
          )}
          title="Visualizar"
        >
          <Eye size={18} />
        </button>
        <button
          disabled={!uploaded}
          className={cn(
            'p-2 rounded-lg transition-colors',
            uploaded
              ? 'hover:bg-secondary text-foreground'
              : 'text-muted-foreground/50 cursor-not-allowed'
          )}
          title="Baixar"
        >
          <Download size={18} />
        </button>
      </div>
    </div>
  );
}
