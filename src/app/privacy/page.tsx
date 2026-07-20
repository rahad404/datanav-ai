import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="flex size-14 items-center justify-center           rounded-2xl bg-success/10 mx-auto mb-6">
          <Shield className="size-7 text-success-text" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">Last updated: January 2026</p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
        <Section title="1. Information We Collect">
          <p>
            We collect information you provide when creating an account, uploading files, 
            and using our services. This includes your name, email address, and the data 
            files you upload for analysis.
          </p>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>
            Your uploaded files are processed solely to generate AI-powered analysis reports. 
            We do not use your data to train AI models, improve our algorithms, or share with third parties.
          </p>
        </Section>

        <Section title="3. Data Storage and Security">
          <p>
            We use industry-standard encryption and security measures to protect your data. 
            Files are stored securely and can be deleted at any time by the report owner.
          </p>
        </Section>

        <Section title="4. Data Retention">
          <p>
            We retain your account information for as long as your account is active. 
            Uploaded files and analysis results are retained until you delete them or close your account.
          </p>
        </Section>

        <Section title="5. Third-Party Services">
          <p>
            We use third-party AI providers (configurable by the instance administrator) 
            to process analysis requests. These providers do not retain or train on your data.
          </p>
        </Section>

        <Section title="6. Your Rights">
          <p>
            You have the right to access, update, and delete your personal information at any time. 
            You can manage your data through your account settings or by contacting us.
          </p>
        </Section>

        <Section title="7. Contact">
          <p>
            If you have questions about this privacy policy, please contact us at privacy@datanav.ai.
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
