import dynamic from "next/dynamic";
import { RouteMessagesProvider } from "@/app/route-messages-provider";
import { HomePreferencesControls } from "@/components/home/home-preferences-controls";
import { HeroSection } from "@/components/home/hero-section";
import { StudySetGridSkeleton } from "@/components/home/study-set-grid-skeleton";
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

const StudySetGrid = dynamic(
  () => import("@/components/home/study-set-grid").then((module) => module.StudySetGrid),
  {
    loading: () => <StudySetGridSkeleton />
  }
);

const HomeMarketingSections = dynamic(
  () =>
    import("@/components/home/landing-sections").then(
      (module) => module.HomeMarketingSections
    ),
  {
    loading: () => null
  }
);

export default function LocalizedHomePage({
  params
}: {
  params: { locale: string };
}) {
  return (
    <RouteMessagesProvider
      locale={params.locale as Locale}
      namespaces={["home"]}
    >
      <StudyProgressBootstrap />
      <div className="space-y-12 pt-2 md:space-y-16 md:pt-4">
        <HeroSection />
        <StudySetGrid />
        <HomeMarketingSections />
      </div>
      <HomePreferencesControls />
    </RouteMessagesProvider>
  );
}
