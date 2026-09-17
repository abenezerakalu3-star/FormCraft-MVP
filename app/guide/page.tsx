import { getSiteSettings } from "@/lib/settings";
import PublicShell from "@/components/public-shell";
import FadeIn from "@/components/motion/fade-in";
import { CheckCircle2, List, MousePointerClick, Send } from "lucide-react";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `How it works — ${settings.siteName}`,
    description: "Learn how to create, share, and collect responses with our platform.",
  };
}

export default async function GuidePage() {
  const settings = await getSiteSettings();

  const steps = [
    {
      title: "1. Create your form",
      icon: MousePointerClick,
      desc: "Start by logging in and navigating to your dashboard. Click on 'New Form' to open the visual builder. Drag and drop the fields you need—like text inputs, dropdowns, and checkboxes. Customize the labels and set whether fields are required.",
    },
    {
      title: "2. Customize the look",
      icon: List,
      desc: "Make the form yours by adding a description and adjusting the layout. You can preview exactly how the form will look to your users before you go live.",
    },
    {
      title: "3. Publish and Share",
      icon: Send,
      desc: "Once you are happy with the form, toggle it to 'Published'. You will instantly get a unique, shareable link. You can send this link via email, social media, or embed it on your own website.",
    },
    {
      title: "4. Collect Responses",
      icon: CheckCircle2,
      desc: "As people fill out your form, responses will automatically appear in your dashboard in real-time. You can view them in a neat table, filter them, and export the data to CSV or Excel for further analysis.",
    }
  ];

  return (
    <PublicShell settings={settings}>
      <div className="mx-auto max-w-3xl px-6 py-20">
        <FadeIn>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">How to use {settings.siteName}</h1>
            <p className="mt-4 text-lg text-muted">
              Everything you need to know to get up and running in minutes.
            </p>
          </div>
        </FadeIn>

        <div className="mt-16 space-y-12">
          {steps.map((step, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <step.icon className="h-6 w-6" />
                  </div>
                  {i !== steps.length - 1 && (
                    <div className="mt-4 h-full w-px bg-line" />
                  )}
                </div>
                <div className="pb-4">
                  <h2 className="text-xl font-bold tracking-tight">{step.title}</h2>
                  <p className="mt-2 text-muted leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}
