import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-green-100 bg-white py-6 mt-5">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 text-center">
        <div className="flex gap-4 text-sm">
          <Link
            href="/termos"
            className="text-green-400 transition-colors hover:text-green-700"
          >
            Termos de Uso
          </Link>
          <span className="text-green-200">|</span>
          <Link
            href="/privacidade"
            className="text-green-400 transition-colors hover:text-green-700"
          >
            Política de Privacidade
          </Link>
        </div>
        <p className="text-xs text-green-400">
          © {new Date().getFullYear()} Semente de Ogum. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
