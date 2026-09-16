import {
  BellRing,
  Calculator,
  CloudUpload,
  FileText,
  Layers,
  Lock,
  MessageCircle,
  PenTool,
  Scale,
  ShieldCheck,
  Smartphone,
  Stamp,
  Truck,
  Wand2,
} from "lucide-react";
import { FEATURES } from "@/lib/site";
import { Card } from "@/components/ui/card";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/section-heading";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  Wand2,
  Stamp,
  PenTool,
  Scale,
  FileText,
  Calculator,
  MessageCircle,
  CloudUpload,
  BellRing,
  Lock,
  Smartphone,
  Truck,
};

/**
 * `limit` keeps the homepage to the six features that actually differentiate
 * the service. The full thirteen still render on /how-it-works, where someone
 * has already opted into the detail.
 */
export function Features({ limit }: { limit?: number } = {}) {
  const features = limit ? FEATURES.slice(0, limit) : FEATURES;
  return (
    <section id="features" className="section bg-white">
      <div className="container-page">
        <SectionHeading
          eyebrow="Everything included"
          icon={Layers}
          title="Everything you would otherwise chase separately"
          body="A vendor for the non-judicial stamp paper, a typist for the draft, a lawyer for the review, a courier for the copy. All of it from one place, on one invoice."
        />

        <Stagger className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" amount={0.05}>
          {features.map((feature) => {
            const Icon = ICONS[feature.icon] ?? ShieldCheck;
            return (
              <StaggerItem key={feature.title}>
                <Card
                  interactive
                  className="group h-full bg-canvas/60 p-6 transition-colors hover:bg-white"
                >
                  <span className="grid size-11 place-items-center rounded-xl border border-line bg-white text-brand-600 shadow-soft transition-all duration-300 group-hover:border-brand-600 group-hover:bg-brand-600 group-hover:text-white">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 font-display text-[16.5px] font-bold text-navy-950">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.7] text-navy-500">{feature.body}</p>
                </Card>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
