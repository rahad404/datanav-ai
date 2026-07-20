import { Scale } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-600/10 mx-auto mb-6">
          <Scale className="size-7 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-4 text-muted-foreground">Last updated: January 2026</p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using DataNav AI, you agree to be bound by these Terms of Service. 
            If you do not agree, please do not use the service.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            DataNav AI provides an AI-powered data analysis platform that allows users to upload 
            structured data files and receive automated analysis, including trends, KPIs, risks, 
            and recommendations.
          </p>
        </Section>

        <Section title="3. User Accounts">
          <p>
            You are responsible for maintaining the confidentiality of your account credentials 
            and for all activities that occur under your account. You must provide accurate 
            information when creating an account.
          </p>
        </Section>

        <Section title="4. Acceptable Use">
          <p>
            You agree not to upload illegal, harmful, or infringing content. You retain all 
            rights to your uploaded data. We claim no intellectual property rights over your data.
          </p>
        </Section>

        <Section title="5. Service Limitations">
          <p>
            While we strive for accuracy, AI-generated analysis should be treated as a 
            preliminary read, not a final audit. We are not responsible for decisions made 
            based on analysis results.
          </p>
        </Section>

        <Section title="6. Termination">
          <p>
            We reserve the right to suspend or terminate accounts that violate these terms. 
            You may delete your account at any time through your profile settings.
          </p>
        </Section>

        <Section title="7. Changes to Terms">
          <p>
            We may update these terms from time to time. Continued use of the service after 
            changes constitutes acceptance of the new terms.
          </p>
        </Section>

        <Section title="8. Contact">
          <p>
            For questions about these terms, please contact us at legal@datanav.ai.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-2">{title}</h2>
      {children}
    </div>
  );
}
