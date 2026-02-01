import { Store } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full bg-card border-b border-border/50 shadow-soft sticky top-0 z-50">
      <div className="container mx-auto py-4 px-4 flex items-center justify-center md:justify-start gap-3">
        <div className="flex items-center gap-3 animate-fade-in-up">
          <a href="/" className="flex items-center shrink-0">
            <img
              src="/logo.png"
              alt="A Ideal Modas"
              className="h-8 md:h-10 w-auto"
              loading="eager"
            />
          </a>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                A Ideal Modas
              </h1>
              <p className="text-xs text-muted-foreground">Ideal para você, Ideal para sua família</p>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
