import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Política de Privacidade — Semente de Ogum",
};

export default function PrivacidadePage() {
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
          Política de Privacidade
        </h1>

        <div className="space-y-6 text-sm leading-relaxed text-green-700">
          <p>
            <strong>Última atualização:</strong> 21 de fevereiro de 2026
          </p>

          <p>
            Esta política descreve como a plataforma Semente de Ogum coleta,
            utiliza e protege os dados pessoais dos seus usuários, em
            conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº
            13.709/2018).
          </p>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-green-900">
              1. Dados Coletados
            </h2>
            <p>Coletamos os seguintes dados pessoais:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                <strong>Cadastro:</strong> nome, endereço de email e perfil
                (aluno ou professor).
              </li>
              <li>
                <strong>Autenticação:</strong> credenciais de acesso (a senha é
                gerenciada pelo Firebase Authentication e não é armazenada por
                nós em texto legível).
              </li>
              <li>
                <strong>Uso da plataforma:</strong> respostas de simulados,
                resultados, horários de início e término das provas.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-green-900">
              2. Finalidade do Tratamento
            </h2>
            <p>Os dados são utilizados exclusivamente para:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Permitir o acesso e funcionamento da plataforma.</li>
              <li>
                Registrar respostas e calcular resultados dos simulados.
              </li>
              <li>
                Permitir que professores analisem o desempenho dos alunos.
              </li>
              <li>
                Melhorar a experiência educacional oferecida pelo cursinho.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-green-900">
              3. Base Legal
            </h2>
            <p>
              O tratamento dos dados é realizado com base no consentimento do
              usuário (Art. 7º, I da LGPD), fornecido no momento do cadastro,
              e no legítimo interesse da organização em oferecer o serviço
              educacional (Art. 7º, IX da LGPD).
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-green-900">
              4. Armazenamento e Segurança
            </h2>
            <p>
              Os dados são armazenados nos serviços do Firebase (Google Cloud
              Platform), que adota medidas técnicas e organizacionais de
              segurança conforme padrões internacionais. A autenticação é
              gerenciada pelo Firebase Authentication com criptografia de
              senhas.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-green-900">
              5. Compartilhamento de Dados
            </h2>
            <p>
              Seus dados pessoais <strong>não são vendidos, alugados ou
              compartilhados</strong> com terceiros para fins comerciais. Os
              dados podem ser acessados por:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                <strong>Professores:</strong> visualizam resultados e respostas
                dos simulados dos alunos.
              </li>
              <li>
                <strong>Firebase (Google):</strong> como provedor de
                infraestrutura, conforme seus próprios termos de serviço e
                política de privacidade.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-green-900">
              6. Direitos do Titular (LGPD)
            </h2>
            <p>
              Conforme a LGPD, você tem direito a:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Confirmar a existência de tratamento dos seus dados.</li>
              <li>Acessar seus dados pessoais.</li>
              <li>Corrigir dados incompletos ou desatualizados.</li>
              <li>
                Solicitar a exclusão dos seus dados pessoais.
              </li>
              <li>Revogar o consentimento a qualquer momento.</li>
            </ul>
            <p className="mt-2">
              Para exercer esses direitos, entre em contato com a coordenação
              do cursinho Semente de Ogum.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-green-900">
              7. Retenção de Dados
            </h2>
            <p>
              Os dados são mantidos enquanto a conta do usuário estiver ativa.
              Ao solicitar a exclusão da conta, todos os dados pessoais
              associados serão removidos, exceto quando houver obrigação legal
              de retenção.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-green-900">
              8. Cookies e Dados de Navegação
            </h2>
            <p>
              A plataforma utiliza apenas cookies essenciais para autenticação e
              funcionamento do serviço. Não utilizamos cookies de rastreamento
              ou publicidade.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-green-900">
              9. Alterações nesta Política
            </h2>
            <p>
              Esta política pode ser atualizada periodicamente. Recomendamos
              que o usuário revise esta página regularmente. A continuidade de
              uso após alterações implica aceitação da nova versão.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-green-900">
              10. Contato
            </h2>
            <p>
              Para dúvidas, solicitações ou reclamações relacionadas à
              privacidade dos seus dados, entre em contato com a coordenação do
              cursinho Semente de Ogum.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
