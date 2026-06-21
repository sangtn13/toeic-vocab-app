import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StudySetGridSkeleton() {
  return (
    <section
      id="study-sets"
      className="container space-y-6"
    >
      <div className="max-w-2xl space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-full max-w-2xl" />
      </div>

      <div className="overflow-hidden rounded-[32px] border border-border/60 bg-card/45 p-3 shadow-glow backdrop-blur sm:p-4">
        <div className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card
              key={index}
              className="app-surface min-w-[min(86vw,22rem)] shrink-0 snap-start overflow-hidden sm:min-w-[24rem] lg:min-w-[calc((100%-1rem)/2)] xl:min-w-[calc((100%-2rem)/3)]"
            >
              <CardContent className="space-y-4 p-6">
                <Skeleton className="h-24 w-full rounded-[22px]" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-10 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
