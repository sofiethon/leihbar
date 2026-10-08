import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  titel: string;
  text: string;
};

export default function FeatureCard({ icon: Icon, titel, text }: Props) {
  return (
    <div className="border-2 border-border bg-card p-6">
      {/* Lucide-Icons sind ohne aria-label automatisch aria-hidden – rein dekorativ. */}
      <Icon className="mb-3 text-accent" size={28} strokeWidth={1.75} />
      <h2 className="mb-1 font-display text-xl font-extrabold">{titel}</h2>
      <p className="text-sm leading-relaxed text-muted">{text}</p>
    </div>
  );
}
