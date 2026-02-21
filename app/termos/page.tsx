import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Termos de Uso — Semente de Ogum",
};

export default function TermosPage() {
  return (
    <div className="flex min-h-screen flex-col bg-green-50">
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-green-500 hover:text-green-700"
        >
          ← Voltar
        </Link>

        <h1 className="mb-8 text-3xl font-bold text-green-900">
          Termos de Uso
        </h1>

        <div className="space-y-6 text-sm leading-relaxed text-green-700">
          <p>
            <strong>Última atualização:</strong> 21 de fevereiro de 2026
          </p>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-green-900">
              1. Sobre a Plataforma
            </h2>
            <p>
              A plataforma Semente de Ogum é um serviço gratuito de simulados no
              formato ENEM, desenvolvido para apoiar o cursinho preparatório
              comunitário Semente de Ogum. A plataforma é destinada
              exclusivamente a fins educacionais e não possui finalidade
              comercial.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-green-900">
              2. Cadastro e Acesso
            </h2>
            <p>
              Para utilizar a plataforma, é necessário criar uma conta
              fornecendo nome, email e senha. Existem dois perfis de acesso:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                <strong>Aluno:</strong> cadastro aberto a qualquer pessoa.
              </li>
              <li>
                <strong>Professor:</strong> requer um código de convite
                fornecido pela coordenação do cursinho.
              </li>
            </ul>
            <p className="mt-2">
              O usuário é responsável por manter a confidencialidade de suas
              credenciais e por todas as atividades realizadas com sua conta.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-green-900">
              3. Uso Adequado
            </h2>
            <p>Ao utilizar a plataforma, o usuário concorda em:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Fornecer informações verdadeiras no cadastro.</li>
              <li>
                Não compartilhar questões ou gabaritos dos simulados fora da
                plataforma.
              </li>
              <li>
                Não tentar acessar contas de outros usuários ou burlar
                mecanismos de segurança.
              </li>
              <li>
                Não utilizar a plataforma para qualquer finalidade ilegal ou não
                autorizada.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-green-900">
              4. Simulados e Conteúdo
            </h2>
            <p>
              Os simulados são criados pelos professores vinculados ao cursinho
              Semente de Ogum. As provas seguem o formato ENEM, com duração de 5
              horas e 30 minutos por dia de prova. Uma vez iniciado, o simulado
              não pode ser pausado e será finalizado automaticamente ao término
              do tempo.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-green-900">
              5. Propriedade Intelectual
            </h2>
            <p>
              O conteúdo das questões, simulados e materiais educacionais
              pertence à organização Semente de Ogum e aos respectivos autores.
              A reprodução, total ou parcial, deste conteúdo fora da plataforma
              é expressamente proibida. O software, a marca, logotipos e
              identidade visual são propriedade exclusiva da Semente de Ogum.
              Todos os direitos reservados.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-green-900">
              6. Disponibilidade do Serviço
            </h2>
            <p>
              A plataforma é fornecida &ldquo;como está&rdquo;, sem garantias de
              disponibilidade ininterrupta. Reservamo-nos o direito de suspender
              ou descontinuar o serviço a qualquer momento para manutenção ou
              por outras razões, sem aviso prévio.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-green-900">
              7. Limitação de Responsabilidade
            </h2>
            <p>
              A Semente de Ogum não se responsabiliza por danos diretos ou
              indiretos decorrentes do uso ou da impossibilidade de uso da
              plataforma, incluindo perda de dados ou resultados de simulados.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-green-900">
              8. Alterações nos Termos
            </h2>
            <p>
              Estes termos podem ser atualizados a qualquer momento. A
              continuidade de uso da plataforma após alterações implica
              aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-green-900">
              9. Contato
            </h2>
            <p>
              Em caso de dúvidas sobre estes termos, entre em contato com a
              coordenação do cursinho Semente de Ogum.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
