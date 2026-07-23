import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Rota não encontrada",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg-primary px-6 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-evolution opacity-20 blur-[120px]"
      />

      <div className="relative">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-accent-cyan">
          Erro 404
        </p>

        <h1 className="mt-6 font-display text-6xl font-semibold tracking-display-tighter text-text-primary sm:text-8xl">
          Rota não encontrada
        </h1>

        <p className="mx-auto mt-6 max-w-md text-text-secondary">
          Esta página não existe — mas sua carreira ainda tem muitas rotas para
          percorrer. Vamos voltar para o início?
        </p>

        <pre className="mx-auto mt-8 w-fit rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-left font-mono text-xs text-text-secondary">
          <code>
            <span className="text-accent-purple">const</span> destino ={" "}
            <span className="text-accent-cyan">await</span> devclub.
            <span className="text-accent-blue">home</span>();
          </code>
        </pre>

        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-evolution px-8 py-4 font-display text-sm font-medium text-bg-primary transition-[filter,transform] duration-300 ease-cinematic hover:brightness-110 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}
