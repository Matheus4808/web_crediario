import { useState } from "react";
import {
  User,
  Users,
  Heart,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Home,
  DollarSign,
  CreditCard,
  Send,
  Loader2,
} from "lucide-react";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import SuccessModal from "./SuccessModal";
import { criarPreCadastro } from "@/services/api";

interface FormData {
  nomeCompleto: string;
  nomeMae: string;
  nomePai: string;
  estadoCivil: string;
  sexo: string;
  cep: string;
  cidade: string;
  cpf: string;
  telefone: string;
  email: string;
  dataNascimento: string;
  endereco: string;
  salario: string;
}

interface FormErrors {
  [key: string]: string;
}

interface TouchedFields {
  [key: string]: boolean;
}

const estadoCivilOptions = [
  { value: "solteiro", label: "Solteiro(a)" },
  { value: "casado", label: "Casado(a)" },
  { value: "divorciado", label: "Divorciado(a)" },
  { value: "viuvo", label: "Viúvo(a)" },
  { value: "uniao_estavel", label: "União Estável" },
];

const sexoOptions = [
  { value: "masculino", label: "Masculino" },
  { value: "feminino", label: "Feminino" },
  { value: "outro", label: "Outro" },
  { value: "prefiro_nao_dizer", label: "Prefiro não dizer" },
];

const PreRegistrationForm = () => {
  const [formData, setFormData] = useState<FormData>({
    nomeCompleto: "",
    nomeMae: "",
    nomePai: "",
    estadoCivil: "",
    sexo: "",
    cep: "",
    cidade: "",
    cpf: "",
    telefone: "",
    email: "",
    dataNascimento: "",
    endereco: "",
    salario: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .slice(0, 14);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9);
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const amount = parseInt(numbers || "0", 10) / 100;
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "nomeCompleto":
        if (!value.trim()) return "Nome completo é obrigatório";
        if (value.trim().split(" ").length < 2) return "Informe nome e sobrenome";
        return "";
      case "nomeMae":
        if (!value.trim()) return "Nome da mãe é obrigatório";
        return "";
      case "estadoCivil":
        if (!value) return "Selecione o estado civil";
        return "";
      case "sexo":
        if (!value) return "Selecione o sexo";
        return "";
      case "cep":
        if (!value.trim()) return "CEP é obrigatório";
        if (value.replace(/\D/g, "").length !== 8) return "CEP inválido";
        return "";
      case "cidade":
        if (!value.trim()) return "Cidade é obrigatória";
        return "";
      case "cpf":
        if (!value.trim()) return "CPF é obrigatório";
        if (value.replace(/\D/g, "").length !== 11) return "CPF inválido";
        return "";
      case "telefone":
        if (!value.trim()) return "Telefone é obrigatório";
        if (value.replace(/\D/g, "").length < 10) return "Telefone inválido";
        return "";
      case "email":
        if (!value.trim()) return "E-mail é obrigatório";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "E-mail inválido";
        return "";
      case "dataNascimento":
        if (!value) return "Data de nascimento é obrigatória";
        return "";
      case "endereco":
        if (!value.trim()) return "Endereço é obrigatório";
        return "";
      case "salario":
        if (!value.trim() || value === "R$ 0,00") return "Salário é obrigatório";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let formattedValue = value;

    switch (name) {
      case "cpf":
        formattedValue = formatCPF(value);
        break;
      case "telefone":
        formattedValue = formatPhone(value);
        break;
      case "cep":
        formattedValue = formatCEP(value);
        break;
      case "salario":
        formattedValue = formatCurrency(value);
        break;
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, formattedValue),
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const allTouched: TouchedFields = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) newErrors[key] = error;
      allTouched[key] = true;
    });

    setErrors(newErrors);
    setTouched(allTouched);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // 🔥 envia para o backend
      await criarPreCadastro(formData);

      setShowSuccessModal(true);

      // reset form
      setFormData({
        nomeCompleto: "",
        nomeMae: "",
        nomePai: "",
        estadoCivil: "",
        sexo: "",
        cep: "",
        cidade: "",
        cpf: "",
        telefone: "",
        email: "",
        dataNascimento: "",
        endereco: "",
        salario: "",
      });

      setTouched({});
      setErrors({});
    } catch (error: any) {
      alert(error.message || "Erro ao enviar formulário");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFieldValid = (name: string): boolean => {
    return !!(touched[name] && !errors[name] && formData[name as keyof FormData]);
  };

  return (
    <>
      <section className="py-1 px-4 pb-16">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-card p-6 md:p-10 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Formulário de Pré-Cadastro
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Nome Completo *"
                  icon={User}
                  name="nomeCompleto"
                  placeholder="Digite seu nome completo"
                  value={formData.nomeCompleto}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.nomeCompleto}
                  touched={!!touched.nomeCompleto}
                  isValid={isFieldValid("nomeCompleto")}
                />
                <FormInput
                  label="Nome da Mãe *"
                  icon={Users}
                  name="nomeMae"
                  placeholder="Nome completo da mãe"
                  value={formData.nomeMae}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.nomeMae}
                  touched={!!touched.nomeMae}
                  isValid={isFieldValid("nomeMae")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Nome do Pai"
                  icon={Users}
                  name="nomePai"
                  placeholder="Nome completo do pai (opcional)"
                  value={formData.nomePai}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.nomePai}
                  touched={!!touched.nomePai}
                  isValid={isFieldValid("nomePai")}
                />
                <FormInput
                  label="CPF *"
                  icon={CreditCard}
                  name="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.cpf}
                  touched={!!touched.cpf}
                  isValid={isFieldValid("cpf")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormSelect
                  label="Estado Civil *"
                  icon={Heart}
                  name="estadoCivil"
                  placeholder="Selecione"
                  options={estadoCivilOptions}
                  value={formData.estadoCivil}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.estadoCivil}
                  touched={!!touched.estadoCivil}
                  isValid={isFieldValid("estadoCivil")}
                />
                <FormSelect
                  label="Sexo *"
                  icon={User}
                  name="sexo"
                  placeholder="Selecione"
                  options={sexoOptions}
                  value={formData.sexo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.sexo}
                  touched={!!touched.sexo}
                  isValid={isFieldValid("sexo")}
                />
                <FormInput
                  label="Data de Nascimento *"
                  icon={Calendar}
                  name="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.dataNascimento}
                  touched={!!touched.dataNascimento}
                  isValid={isFieldValid("dataNascimento")}
                />
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Telefone / WhatsApp *"
                  icon={Phone}
                  name="telefone"
                  placeholder="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.telefone}
                  touched={!!touched.telefone}
                  isValid={isFieldValid("telefone")}
                />
                <FormInput
                  label="E-mail *"
                  icon={Mail}
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                  touched={!!touched.email}
                  isValid={isFieldValid("email")}
                />
              </div>

              {/* Address */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="CEP *"
                  icon={MapPin}
                  name="cep"
                  placeholder="00000-000"
                  value={formData.cep}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.cep}
                  touched={!!touched.cep}
                  isValid={isFieldValid("cep")}
                />
                <FormInput
                  label="Cidade *"
                  icon={MapPin}
                  name="cidade"
                  placeholder="Sua cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.cidade}
                  touched={!!touched.cidade}
                  isValid={isFieldValid("cidade")}
                />
                <FormInput
                  label="Salário *"
                  icon={DollarSign}
                  name="salario"
                  placeholder="R$ 0,00"
                  value={formData.salario}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.salario}
                  touched={!!touched.salario}
                  isValid={isFieldValid("salario")}
                />
              </div>

              <FormInput
                label="Endereço Completo *"
                icon={Home}
                name="endereco"
                placeholder="Rua, número, bairro, complemento"
                value={formData.endereco}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.endereco}
                touched={!!touched.endereco}
                isValid={isFieldValid("endereco")}
              />

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full md:w-auto md:min-w-[200px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar Pré-Cadastro
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </>
  );
};

export default PreRegistrationForm;
