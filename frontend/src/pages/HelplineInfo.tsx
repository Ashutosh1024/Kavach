import Layout from "../components/Layout";
import { HeadsetIcon } from "../components/Icons";

export default function HelplineInfo() {
  return (
    <Layout>
      <div className="flex flex-col items-center text-center">
        <HeadsetIcon className="h-12 w-12 text-navy" />
        <h1 className="mt-4 text-xl font-semibold text-ink">Kavach helpline</h1>
        <p className="mt-2 text-3xl font-bold tracking-wide text-navy">1800-XXX-KAVACH</p>
        <a href="tel:1800000000" className="btn-primary mt-4">
          Call now
        </a>
        <p className="mt-4 text-sm text-muted">
          No smartphone or data needed. Call this number, choose your language, and describe what
          happened. You'll get a spoken verdict and next steps — powered by the same Kavach engine
          as this app.
        </p>
      </div>
    </Layout>
  );
}
