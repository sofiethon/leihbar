import Image from "next/image";
import { Package } from "lucide-react";

type Props = {
  /** Pfad unter public/; ohne Bild erscheint ein neutraler Platzhalter. */
  bild: string | null;
  alt: string;
  sizes: string;
  /** Das erste sichtbare Bild wird sofort geladen. */
  prioritaet?: boolean;
};

export default function GegenstandBild({ bild, alt, sizes, prioritaet = false }: Props) {
  if (!bild) {
    return (
      <div className="flex h-full w-full items-center justify-center text-muted">
        <Package size={48} aria-hidden="true" />
        <span className="sr-only">Kein Bild vorhanden</span>
      </div>
    );
  }

  return (
    <Image src={bild} alt={alt} fill sizes={sizes} className="object-cover" priority={prioritaet} />
  );
}
