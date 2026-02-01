import { CreditCard, Clock, Shield } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="py-8 md:py-12 px-4">
      <div className="container mx-auto text-center max-w-3xl">
        <div className="animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 bg-accent text-accent-foreground text-sm font-medium rounded-full mb-4">
            Pré-Cadastro de Crediário
          </span>
        </div>

        <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4 animate-fade-in-up delay-100">
          Faça seu crediário na{" "}
          <span className="text-primary">A Ideal Modas</span>
        </h2>

        <p className="text-muted-foreground text-base md:text-lg mb-8 animate-fade-in-up delay-200">
          Preencha o formulário abaixo para realizar seu pré-cadastro.
          Nossa equipe entrará em contato em até 48 horas.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: CreditCard,
              title: "Crédito Fácil",
              description: (
                <>
                  <strong>Em até 10x sem juros!</strong>
                  <br />
                  <br />
                  Aprovação rápida e sem burocracia
                </>
              ),
            },
            {
              icon: Clock,
              title: "Retorno Rápido",
              description: "Resposta em até 72 horas",
            },
            {
              icon: Shield,
              title: "Dados Seguros",
              description: "Suas informações protegidas",
            },
          ].map((item, index) => (
            <div
              key={item.title}
              className={`p-4 rounded-xl bg-card border border-border/50 shadow-soft 
                         hover:shadow-medium hover:border-primary/30 transition-all duration-300
                         animate-fade-in-up`}
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mx-auto mb-3">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
