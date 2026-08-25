import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Propedéutico LLM — Escuela CICADA",
  description: "Un recorrido introductorio de dos semanas para comprender las ideas básicas detrás de los grandes modelos de lenguaje.",
  openGraph: { title: "Propedéutico LLM — Escuela CICADA", description: "Tokens, embeddings, atención y transformers en menos de cinco horas.", type: "website" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body>{children}</body></html>; }
