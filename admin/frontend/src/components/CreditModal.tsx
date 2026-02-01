import { X, User, Phone, Mail, MapPin, Briefcase, Users, Calendar, CreditCard, FileText, Check, XIcon, Loader2 } from 'lucide-react';
import { CreditApplication } from '@/types/credit';
import { StatusBadge } from './StatusBadge';
import { DocumentCard } from './DocumentCard';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CreditModalProps {
  credit: CreditApplication;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const documents = [
  { name: 'RG', type: 'Documento de identidade', uploaded: false },
  { name: 'CPF', type: 'Cadastro de pessoa física', uploaded: false },
  { name: 'Comprovante de Renda', type: 'Holerite ou declaração', uploaded: false },
  { name: 'Comprovante de Residência', type: 'Conta de luz, água ou telefone', uploaded: false },
];

export function CreditModal({ credit, onClose, onApprove, onReject }: CreditModalProps) {
  const [isLoading, setIsLoading] = useState<'approve' | 'reject' | null>(null);

  const handleApprove = async () => {
    setIsLoading('approve');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onApprove(credit.id);
    setIsLoading(null);
  };

  const handleReject = async () => {
    setIsLoading('reject');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onReject(credit.id);
    setIsLoading(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="modal-backdrop animate-in fade-in-0 duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in-modal z-10">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <User size={24} className="text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{credit.name}</h2>
              <p className="text-sm text-muted-foreground">
                Cadastro em {new Date(credit.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={credit.status} />
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Personal Info */}
          <section className="mb-8">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
              <Users size={16} />
              Informações Pessoais
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem label="Nome completo" value={credit.name} />
              <InfoItem label="CPF" value={credit.cpf} icon={<CreditCard size={14} />} />
              <InfoItem label="Nome da mãe" value={credit.motherName} />
              <InfoItem label="Nome do pai" value={credit.fatherName} />
              <InfoItem label="Estado civil" value={credit.maritalStatus} />
              <InfoItem label="Sexo" value={credit.gender} />
              <InfoItem label="Data de nascimento" value={credit.birthDate} icon={<Calendar size={14} />} />
            </div>
          </section>

          {/* Contact Info */}
          <section className="mb-8">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
              <Phone size={16} />
              Contato
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem label="Telefone" value={credit.phone} icon={<Phone size={14} />} />
              <InfoItem label="E-mail" value={credit.email} icon={<Mail size={14} />} />
            </div>
          </section>

          {/* Address */}
          <section className="mb-8">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
              <MapPin size={16} />
              Endereço
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem label="CEP" value={credit.cep} />
              <InfoItem label="Cidade" value={credit.city} />
              <InfoItem label="Endereço" value={credit.address} className="sm:col-span-2" />
            </div>
          </section>

          {/* Financial */}
          <section className="mb-8">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
              <Briefcase size={16} />
              Informações Financeiras
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <InfoItem label="Salário" value={credit.salary} highlight />
            </div>
          </section>

          {/* Documents */}
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
              <FileText size={16} />
              Documentos Enviados
            </h3>
            <div className="space-y-3">
              {documents.map((doc) => (
                <DocumentCard key={doc.name} {...doc} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Funcionalidade de upload de documentos em breve
            </p>
          </section>
        </div>

        {/* Footer Actions */}
        {credit.status === 'pending' && (
          <div className="sticky bottom-0 bg-card border-t border-border p-6 flex gap-4">
            <Button
              onClick={handleReject}
              disabled={isLoading !== null}
              variant="outline"
              className={cn(
                'flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground',
                'transition-all duration-200'
              )}
            >
              {isLoading === 'reject' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <XIcon className="mr-2 h-4 w-4" />
              )}
              Recusar
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isLoading !== null}
              className={cn(
                'flex-1 bg-primary hover:bg-primary/90 text-primary-foreground',
                'transition-all duration-200'
              )}
            >
              {isLoading === 'approve' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Aprovar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  className?: string;
  highlight?: boolean;
}

function InfoItem({ label, value, icon, className, highlight }: InfoItemProps) {
  return (
    <div className={cn('p-3 rounded-lg bg-secondary/50', className)}>
      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
        {icon}
        {label}
      </p>
      <p className={cn('font-medium', highlight && 'text-primary text-lg')}>
        {value}
      </p>
    </div>
  );
}
