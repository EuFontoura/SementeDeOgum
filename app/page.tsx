import Image from "next/image";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-green-50">
      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
        <Image
          src="/images/brand/logo/logo-primary.png"
          alt="Semente de Ogum"
          width={400}
          height={212}
          priority
        />
        <p className="max-w-md text-lg text-green-700">
          Cursinho preparatório gratuito — Plataforma de simulados ENEM
        </p>
        <div className="flex gap-4">
          <a
            href="/login"
            className="rounded-full bg-green-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-green-700"
          >
            Entrar
          </a>
          <a
            href="/register"
            className="rounded-full border-2 border-green-500 px-8 py-3 font-semibold text-green-500 transition-colors hover:bg-green-500 hover:text-white"
          >
            Cadastrar
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
