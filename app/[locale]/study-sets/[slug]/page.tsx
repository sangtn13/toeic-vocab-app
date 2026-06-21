import dynamic from "next/dynamic";
import { RouteMessagesProvider } from "@/app/route-messages-provider";
import { WorkspaceSkeleton } from "@/components/study/workspace/shared";
import type { Locale } from "@/lib/preferences";

const StudyProgressBootstrap = dynamic(
  () =>
    import("@/components/study/study-progress-bootstrap").then(
      (module) => module.StudyProgressBootstrap
    ),
  {
    ssr: false
  }
);

const VocabularyWorkspace = dynamic(
  () =>
    import("@/components/study/vocabulary-workspace").then(
      (module) => module.VocabularyWorkspace
    ),
  {
    loading: () => <div className="container py-8"><WorkspaceSkeleton /></div>
  }
);

export default function LocalizedStudySetPage({
  params
}: {
  params: { locale: string; slug: string };
}) {
  return (
    <RouteMessagesProvider
      locale={params.locale as Locale}
      namespaces={["study"]}
    >
      <StudyProgressBootstrap />
      <VocabularyWorkspace slug={params.slug} />
    </RouteMessagesProvider>
  );
}
