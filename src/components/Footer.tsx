import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-6 border-t border-border/50 bg-card/50">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
          Feito pela equipe{" "}
          <span className="font-semibold text-foreground"> A Ideal Modas</span>
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          © {new Date().getFullYear()} A Ideal Modas. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
