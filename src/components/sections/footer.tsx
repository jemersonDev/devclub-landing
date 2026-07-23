"use client";

import { useState } from "react";
import { Github, Instagram, Linkedin, Youtube } from "lucide-react";
import { MagneticSubmitButton } from "@/components/ui/magnetic-submit-button";
import { NAV_LINKS } from "@/constants/navigation";
import { useMagnetic } from "@/hooks/use-magnetic";

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com", Icon: Instagram },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: Linkedin },
  { label: "YouTube", href: "https://youtube.com", Icon: Youtube },
  { label: "GitHub", href: "https://github.com", Icon: Github },
];

function SocialIcon({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: typeof Instagram;
}) {
  const magneticRef = useMagnetic<HTMLAnchorElement>({ strength: 0.5 });
  return (
    <a
      ref={magneticRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      data-cursor-hover
      className="glass-panel flex h-11 w-11 items-center justify-center rounded-full text-text-secondary transition-colors duration-300 hover:text-text-primary"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

export function Footer() {
  const [subscribeState, setSubscribeState] = useState<"idle" | "subscribed">(
    "idle"
  );

  function handleSubscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Wire this up to your email provider (e.g. an API route or a
    // service like Resend/Mailchimp) — the form already validates
    // the address natively via `type="email"` + `required`.
    setSubscribeState("subscribed");
  }

  return (
    <footer className="relative border-t border-white/10 bg-bg-secondary px-6 pb-10 pt-20 lg:px-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-evolution" />

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl font-semibold text-text-primary">
              Dev<span className="text-gradient-evolution">Club</span>
            </p>
            <p className="mt-4 max-w-sm text-sm text-text-secondary">
              A jornada completa para quem quer se tornar um desenvolvedor
              extraordinário — do primeiro console.log ao primeiro emprego
              full stack.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map((social) => (
                <SocialIcon key={social.label} {...social} />
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-cyan">
              Mapa do site
            </p>
            <nav aria-label="Links do rodapé">
              <ul className="mt-5 flex flex-col gap-3">
                {NAV_LINKS.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      data-cursor-hover
                      className="text-sm text-text-secondary transition-colors duration-300 hover:text-text-primary"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-cyan">
              Receba novidades
            </p>
            <p className="mt-5 text-sm text-text-secondary">
              Conteúdo sobre carreira, tecnologia e vagas — direto no seu
              e-mail, sem spam.
            </p>
            <form
              className="mt-4 flex gap-2"
              onSubmit={handleSubscribe}
            >
              <label htmlFor="footer-email" className="sr-only">
                Seu e-mail
              </label>
              <input
                id="footer-email"
                type="email"
                required
                placeholder="seu@email.com"
                disabled={subscribeState === "subscribed"}
                className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent-cyan focus:outline-none disabled:opacity-60"
              />
              <MagneticSubmitButton
                disabled={subscribeState === "subscribed"}
                className="!px-5 !py-2.5 !text-xs"
              >
                {subscribeState === "subscribed" ? "Inscrito ✓" : "Assinar"}
              </MagneticSubmitButton>
            </form>
            <p role="status" aria-live="polite" className="mt-2 text-xs text-accent-cyan">
              {subscribeState === "subscribed" &&
                "Prontinho! Você vai receber nossas novidades em breve."}
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-text-secondary/70 sm:flex-row">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} DevClub. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            {/* Troque por <Link href="/privacidade"> e <Link href="/termos">
                quando as páginas existirem. */}
            <span>Política de Privacidade</span>
            <span>Termos de Uso</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
