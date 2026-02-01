import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal = ({ isOpen, onClose }: SuccessModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-modal animate-fade-in-up"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-intense max-w-md w-full p-8 animate-scale-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground 
                     hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          {/* Success Icon */}
          <div className="mb-6 inline-flex">
            <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center animate-float">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Pré-cadastro Enviado!
          </h3>

          {/* Message */}
          <p className="text-muted-foreground leading-relaxed mb-6">
            Seu pré-cadastro foi enviado com sucesso! Te retornaremos no número de contato 
            informado dentro de <span className="font-semibold text-foreground">48 horas</span>.
          </p>

          {/* Thank you */}
          <div className="p-4 bg-accent/50 rounded-xl">
            <p className="text-sm text-accent-foreground font-medium">
              A equipe <span className="text-primary font-bold">Ideal Modas</span> agradece 
              a sua preferência! 💚
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="btn-primary mt-6 w-full"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
