import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard as CreditCardIcon, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { AppSidebar } from '@/components/AppSidebar';
import { CreditCard } from '@/components/CreditCard';
import { CreditModal } from '@/components/CreditModal';
import { FilterBar } from '@/components/FilterBar';
import { mockCredits } from '@/data/mockCredits';
import { CreditApplication, CreditStatus } from '@/types/credit';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Painel = () => {
  const navigate = useNavigate();
  const [credits, setCredits] = useState<CreditApplication[]>(mockCredits);
  const [selectedCredit, setSelectedCredit] = useState<CreditApplication | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CreditStatus | 'all'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Verifica autenticação
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [navigate]);

  // Filter credits
  const filteredCredits = useMemo(() => {
    return credits.filter((credit) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        credit.name.toLowerCase().includes(searchLower) ||
        credit.cpf.includes(searchTerm) ||
        credit.phone.includes(searchTerm);

      const matchesStatus = statusFilter === 'all' || credit.status === statusFilter;

      const creditDate = new Date(credit.createdAt);
      const matchesStartDate = !startDate || creditDate >= new Date(startDate);
      const matchesEndDate = !endDate || creditDate <= new Date(endDate);

      return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
    });
  }, [credits, searchTerm, statusFilter, startDate, endDate]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: credits.length,
      pending: credits.filter((c) => c.status === 'pending').length,
      approved: credits.filter((c) => c.status === 'approved').length,
      rejected: credits.filter((c) => c.status === 'rejected').length,
    };
  }, [credits]);

  const handleApprove = (id: string) => {
    setCredits((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'approved' as CreditStatus } : c))
    );
    setSelectedCredit(null);
    toast({
      title: 'Crediário aprovado!',
      description: 'O cliente será notificado por e-mail.',
    });
  };

  const handleReject = (id: string) => {
    setCredits((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'rejected' as CreditStatus } : c))
    );
    setSelectedCredit(null);
    toast({
      title: 'Crediário recusado',
      description: 'O cliente será notificado por e-mail.',
      variant: 'destructive',
    });
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />

      <main className="flex-1 lg:ml-0">
        <div className="p-6 lg:p-8 pt-16 lg:pt-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <CreditCardIcon className="text-primary" size={32} />
              Crediários
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os pré-cadastros de crediário
            </p>
          </header>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total"
              value={stats.total}
              icon={<Users size={20} />}
              variant="default"
            />
            <StatCard
              label="Em análise"
              value={stats.pending}
              icon={<Clock size={20} />}
              variant="pending"
            />
            <StatCard
              label="Aprovados"
              value={stats.approved}
              icon={<CheckCircle size={20} />}
              variant="approved"
            />
            <StatCard
              label="Recusados"
              value={stats.rejected}
              icon={<XCircle size={20} />}
              variant="rejected"
            />
          </div>

          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />

          {filteredCredits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredCredits.map((credit, index) => (
                <CreditCard
                  key={credit.id}
                  credit={credit}
                  onClick={() => setSelectedCredit(credit)}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <CreditCardIcon size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">
                Nenhum crediário encontrado
              </h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros de busca
              </p>
            </div>
          )}
        </div>
      </main>

      {selectedCredit && (
        <CreditModal
          credit={selectedCredit}
          onClose={() => setSelectedCredit(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  variant: 'default' | 'pending' | 'approved' | 'rejected';
}

function StatCard({ label, value, icon, variant }: StatCardProps) {
  const variantStyles = {
    default: 'bg-card border-border',
    pending: 'bg-muted/50 border-muted',
    approved: 'bg-accent/30 border-primary/20',
    rejected: 'bg-destructive/5 border-destructive/20',
  };

  const iconStyles = {
    default: 'text-foreground',
    pending: 'text-muted-foreground',
    approved: 'text-primary',
    rejected: 'text-destructive',
  };

  return (
    <div
      className={cn(
        'p-4 rounded-xl border transition-all hover:shadow-lg',
        variantStyles[variant]
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={cn('p-2 rounded-lg bg-secondary/50', iconStyles[variant])}>
          {icon}
        </span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export default Painel;
