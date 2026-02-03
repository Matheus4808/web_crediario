import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard as CreditCardIcon,
  Users,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

import { AppSidebar } from "@/components/AppSidebar";
import { CreditCard } from "@/components/CreditCard";
import { CreditModal } from "@/components/CreditModal";
import { FilterBar } from "@/components/FilterBar";
import { ApproveLimitModal } from "@/components/ApproveLimitModal";

//import { mockCredits } from "@/data/mockCredits";
import { CreditApplication, CreditStatus } from "@/types/credit";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const Painel = () => {
  const navigate = useNavigate();

  const [credits, setCredits] = useState<CreditApplication[]>([]);
  const [selectedCredit, setSelectedCredit] =
    useState<CreditApplication | null>(null);
  const [approveCredit, setApproveCredit] =
    useState<CreditApplication | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<CreditStatus | "all">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 🔐 Auth
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) navigate("/");
  }, [navigate]);

  function formatDateBR(dateString: string) {
    const date = new Date(dateString);

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }


  const mapApiToCredit = (item: any): CreditApplication => {
    const credit: any = {
      id: item.id.toString(),
      name: item.nome_completo,
      motherName: item.nome_mae,
      fatherName: item.nome_pai,
      gender: item.sexo,
      maritalStatus: item.estado_civil,
      birthDate: formatDateBR(item.data_nascimento),
      email: item.email,
      cep: item.cep,
      address: item.endereco,
      city: item.cidade,
      salary: item.salario,
      cpf: item.cpf,
      phone: item.telefone,
      status:
        item.status === "em_analise"
          ? "pending"
          : item.status === "aprovado"
            ? "approved"
            : "rejected",
      createdAt: item.created_at,
      limit: item.limite ?? undefined,
    };
    return credit as CreditApplication;
  };

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch('http://localhost:3000/cadastros', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        );

        const data = await response.json();

        const mapped = data.map(mapApiToCredit);
        setCredits(mapped);
      } catch (err) {
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível buscar os pré-cadastros",
          variant: "destructive",
        });
      }
    };

    fetchCredits();
  }, []);



  // 🔍 Filters
  const filteredCredits = useMemo(() => {
    return credits.filter((credit) => {
      const searchLower = searchTerm.toLowerCase();

      const matchesSearch =
        !searchTerm ||
        credit.name.toLowerCase().includes(searchLower) ||
        credit.cpf.includes(searchTerm) ||
        credit.phone.includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || credit.status === statusFilter;

      const creditDate = new Date(credit.createdAt);
      const matchesStartDate =
        !startDate || creditDate >= new Date(startDate);
      const matchesEndDate =
        !endDate || creditDate <= new Date(endDate);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [credits, searchTerm, statusFilter, startDate, endDate]);

  // 📊 Stats
  const stats = useMemo(() => {
    return {
      total: credits.length,
      pending: credits.filter((c) => c.status === "pending").length,
      approved: credits.filter((c) => c.status === "approved").length,
      rejected: credits.filter((c) => c.status === "rejected").length,
    };
  }, [credits]);

  // ✅ Aprovar (abre modal)
  const handleApprove = (credit: CreditApplication) => {
    setApproveCredit(credit);
  };

  // ✅ Confirma limite
  const confirmApproveWithLimit = async (limit: number) => {
    if (!approveCredit) return;

    try {
      const token = localStorage.getItem("token");

      await fetch(
        `http://localhost:3000/cadastros/${approveCredit.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "aprovado",
            limite_credito: limit,
          }),

        }
      );

      setCredits((prev) =>
        prev.map((c) =>
          c.id === approveCredit.id
            ? { ...c, status: "approved", limit }
            : c
        )
      );

      toast({
        title: "Crediário aprovado!",
        description: `O crediário do ${approveCredit.name} foi aceito!
O valor do limite é R$ ${limit}.
Avise para comprar na loja no número ${approveCredit.phone}`,
      });
    } catch {
      toast({
        title: "Erro ao aprovar",
        variant: "destructive",
      });
    } finally {
      setApproveCredit(null);
      setSelectedCredit(null);
    }
  };


  // ❌ Rejeitar
  const handleReject = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(
        `http://localhost:3000/cadastros/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "negado" }),
        }
      );

      setCredits((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "rejected" } : c
        )
      );

      toast({
        title: "Crediário recusado",
        variant: "destructive",
      });
    } catch {
      toast({
        title: "Erro ao recusar",
        variant: "destructive",
      });
    } finally {
      setSelectedCredit(null);
    }
  };


  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />

      <main className="flex-1">
        <div className="p-6 lg:p-8 pt-16 lg:pt-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <CreditCardIcon className="text-primary" size={32} />
              Crediários
            </h1>
            <p className="text-muted-foreground">
              Gerencie os pré-cadastros
            </p>
          </header>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total" value={stats.total} icon={<Users size={20} />} variant="default" />
            <StatCard label="Em análise" value={stats.pending} icon={<Clock size={20} />} variant="pending" />
            <StatCard label="Aprovados" value={stats.approved} icon={<CheckCircle size={20} />} variant="approved" />
            <StatCard label="Recusados" value={stats.rejected} icon={<XCircle size={20} />} variant="rejected" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredCredits.map((credit, index) => (
              <CreditCard
                key={credit.id}
                credit={credit}
                index={index}
                onClick={() => setSelectedCredit(credit)}
              />
            ))}
          </div>
        </div>
      </main>

      {selectedCredit && (
        <CreditModal
          credit={selectedCredit}
          onClose={() => setSelectedCredit(null)}
          onApprove={() => handleApprove(selectedCredit)}
          onReject={handleReject}
        />
      )}

      {approveCredit && (
        <ApproveLimitModal
          credit={approveCredit}
          onClose={() => setApproveCredit(null)}
          onConfirm={confirmApproveWithLimit}
        />
      )}
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  variant: "default" | "pending" | "approved" | "rejected";
}

function StatCard({ label, value, icon, variant }: StatCardProps) {
  const variantStyles = {
    default: "bg-card border-border",
    pending: "bg-muted/50 border-muted",
    approved: "bg-accent/30 border-primary/20",
    rejected: "bg-destructive/5 border-destructive/20",
  };

  return (
    <div className={cn("p-4 rounded-xl border", variantStyles[variant])}>
      <span className="p-2 rounded-lg bg-secondary/50">{icon}</span>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export default Painel;
