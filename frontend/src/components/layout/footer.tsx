import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-mono font-semibold text-xs">
              &gt;
            </span>
          </div>
          <span className="font-mono text-sm text-foreground font-semibold">
            laboro
          </span>
          <span className="text-muted-foreground text-sm">
            · Empleos tech en Perú
          </span>
        </div>

        <p className="text-muted-foreground text-xs">
          Agregamos ofertas de 2 portales · Actualizado diariamente
        </p>
      </div>
    </footer>
  );
}