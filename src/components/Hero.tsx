import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { NewProjectDialog } from "./NewProjectDialog";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="animate-fade-in text-center">
          <div className="mb-6 inline-block rounded-full bg-background/10 px-4 py-2 text-sm font-medium text-primary-foreground backdrop-blur-sm">
            NSL Foods PLC R&D Platform
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-primary-foreground md:text-6xl lg:text-7xl">
            Design Requirements,
            <br />
            Build Innovation
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/90 md:text-xl">
            Streamline your R&D workflow with our comprehensive requirement design platform. 
            From concept to execution, manage every stage of food innovation.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <NewProjectDialog />
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary-foreground/20 bg-background/10 text-primary-foreground hover:bg-background/20 backdrop-blur-sm"
            >
              View Dashboard
            </Button>
          </div>
          
          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {[
              "Requirement Tracking",
              "Workflow Management",
              "Team Collaboration"
            ].map((feature, i) => (
              <div 
                key={i}
                className="flex items-center justify-center gap-2 text-primary-foreground/90"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
