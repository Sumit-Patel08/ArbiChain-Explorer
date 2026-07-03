import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>
          Built by <span className="text-foreground font-medium">Sumit Patel</span> ·{" "}
          <span className="gradient-text font-medium">Arbitrum Builder Pods</span>
        </p>
        <a
          href="https://github.com/Sumit-Patel08"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
        >
          <Github size={16} />
          github.com/Sumit-Patel08
        </a>
      </div>
    </footer>
  );
}
