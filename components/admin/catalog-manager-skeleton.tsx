import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CatalogManagerSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="overflow-hidden rounded-[28px] border-border bg-card shadow-[0_20px_48px_rgba(148,163,184,0.16)]">
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-28 w-full rounded-[22px]" />
            <Skeleton className="h-28 w-full rounded-[22px]" />
            <Skeleton className="h-28 w-full rounded-[22px]" />
          </CardContent>
        </Card>

        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card
              key={index}
              className="overflow-hidden rounded-[28px] border-border bg-card shadow-[0_20px_48px_rgba(148,163,184,0.16)]"
            >
              <CardContent className="space-y-4 p-6">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-12 w-full rounded-2xl" />
                <Skeleton className="h-12 w-full rounded-2xl" />
                <Skeleton className="h-12 w-full rounded-2xl" />
                <Skeleton className="h-12 w-32 rounded-2xl" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
