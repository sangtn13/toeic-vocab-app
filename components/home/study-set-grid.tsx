"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { usePreferences } from "@/app/preferences-provider";
import {
  formatVisibleRange,
  getIndicatorIndexes,
  StudySetCarouselCard,
  type VisibleRange
} from "@/components/home/study-set-grid-helpers";
import { useI18n } from "@/hooks/use-i18n";
import { useStudySets } from "@/hooks/use-study-queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const INITIAL_RENDER_COUNT = 6;
const RENDER_BATCH_SIZE = 6;
const RENDER_AHEAD_THRESHOLD = 2;
const MAX_VISIBLE_INDICATORS = 7;

function getCarouselSlides(carousel: HTMLDivElement) {
  return Array.from(
    carousel.querySelectorAll<HTMLElement>("[data-study-set-slide]")
  );
}

export function StudySetGrid() {
  const { locale } = usePreferences();
  const homeMessages = useI18n("home");
  const studySetLearningStatusLabels = useI18n("common").labels.studySetLearningStatus;
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useStudySets();
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [visibleRange, setVisibleRange] = useState<VisibleRange>({ start: 0, end: 0 });
  const [renderedCount, setRenderedCount] = useState(INITIAL_RENDER_COUNT);
  const [pendingScrollIndex, setPendingScrollIndex] = useState<number | null>(null);

  const studySets = data?.pages.flatMap((page) => page.items) ?? [];
  const fetchedStudySets = studySets.length;
  const totalStudySets = data?.pages[0]?.totalElements ?? fetchedStudySets;
  const visibleStudySets = studySets.slice(0, renderedCount);
  const hasMoreRenderedStudySets = renderedCount < fetchedStudySets;
  const hasMoreStudySets = hasMoreRenderedStudySets || !!hasNextPage;
  const firstStudySetId = studySets[0]?.id ?? null;

  useEffect(() => {
    if (!fetchedStudySets) {
      setRenderedCount(INITIAL_RENDER_COUNT);
      setActiveIndex(0);
      setPendingScrollIndex(null);
      return;
    }

    setRenderedCount(Math.min(fetchedStudySets, INITIAL_RENDER_COUNT));
    setActiveIndex(0);
    setVisibleRange({ start: 0, end: Math.min(fetchedStudySets, INITIAL_RENDER_COUNT) - 1 });
    setPendingScrollIndex(null);
  }, [firstStudySetId, fetchedStudySets]);

  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    const updateCarouselState = () => {
      const cards = getCarouselSlides(carousel);
      const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
      const carouselRect = carousel.getBoundingClientRect();

      setCanScrollPrev(carousel.scrollLeft > 8);
      setCanScrollNext(hasMoreStudySets || carousel.scrollLeft < maxScrollLeft - 8);

      if (!cards.length) {
        setActiveIndex(0);
        setVisibleRange({ start: 0, end: 0 });
        return;
      }

      let nextIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const distance = Math.abs(card.offsetLeft - carousel.scrollLeft);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nextIndex = index;
        }
      });

      const visibleIndexes = cards
        .map((card, index) => {
          const rect = card.getBoundingClientRect();
          const overlap =
            Math.min(rect.right, carouselRect.right) -
            Math.max(rect.left, carouselRect.left);
          const isMostlyVisible = overlap > rect.width * 0.45;

          return isMostlyVisible ? index : -1;
        })
        .filter((index) => index >= 0);

      setActiveIndex(nextIndex);
      setVisibleRange({
        start: visibleIndexes[0] ?? nextIndex,
        end: visibleIndexes[visibleIndexes.length - 1] ?? nextIndex
      });
    };

    updateCarouselState();
    carousel.addEventListener("scroll", updateCarouselState, { passive: true });
    window.addEventListener("resize", updateCarouselState);

    return () => {
      carousel.removeEventListener("scroll", updateCarouselState);
      window.removeEventListener("resize", updateCarouselState);
    };
  }, [hasMoreStudySets, renderedCount, fetchedStudySets]);

  useEffect(() => {
    if (!hasMoreStudySets) {
      return;
    }

    if (activeIndex < renderedCount - RENDER_AHEAD_THRESHOLD) {
      return;
    }

    if (hasMoreRenderedStudySets) {
      setRenderedCount((current) => Math.min(fetchedStudySets, current + RENDER_BATCH_SIZE));
      return;
    }

    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [
    activeIndex,
    hasMoreStudySets,
    hasMoreRenderedStudySets,
    renderedCount,
    fetchedStudySets,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  ]);

  useEffect(() => {
    const carousel = carouselRef.current;
    const trigger = loadMoreRef.current;

    if (!carousel || !trigger || !hasMoreStudySets) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        if (hasMoreRenderedStudySets) {
          setRenderedCount((current) => Math.min(fetchedStudySets, current + RENDER_BATCH_SIZE));
          return;
        }

        if (hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      {
        root: carousel,
        threshold: 0.2,
        rootMargin: "0px 120px 0px 0px"
      }
    );

    observer.observe(trigger);

    return () => observer.disconnect();
  }, [
    hasMoreStudySets,
    hasMoreRenderedStudySets,
    fetchedStudySets,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  ]);

  useEffect(() => {
    if (pendingScrollIndex === null) {
      return;
    }

    if (pendingScrollIndex >= fetchedStudySets) {
      if (hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }

      return;
    }

    if (pendingScrollIndex >= renderedCount) {
      setRenderedCount((current) =>
        Math.min(fetchedStudySets, Math.max(current + RENDER_BATCH_SIZE, pendingScrollIndex + 1))
      );
    }
  }, [pendingScrollIndex, renderedCount, fetchedStudySets, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (pendingScrollIndex === null || pendingScrollIndex >= renderedCount) {
      return;
    }

    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    const nextCard = getCarouselSlides(carousel)[pendingScrollIndex];

    if (!nextCard) {
      return;
    }

    nextCard.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest"
    });
    setPendingScrollIndex(null);
  }, [pendingScrollIndex, renderedCount]);

  const scrollToCard = (index: number) => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    if (index >= fetchedStudySets) {
      setPendingScrollIndex(index);
      if (hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
      return;
    }

    if (index >= renderedCount) {
      setRenderedCount((current) =>
        Math.min(fetchedStudySets, Math.max(current + RENDER_BATCH_SIZE, index + 1))
      );
      setPendingScrollIndex(index);
      return;
    }

    const cards = getCarouselSlides(carousel);
    const nextCard = cards[index];

    if (!nextCard) {
      return;
    }

    nextCard.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest"
    });
  };

  const handleArrowClick = (direction: -1 | 1) => {
    const totalCards = totalStudySets;
    const nextIndex = Math.max(0, Math.min(activeIndex + direction, totalCards - 1));

    scrollToCard(nextIndex);
  };
  const copy = homeMessages.studySetGrid;
  const indicatorIndexes = getIndicatorIndexes(
    totalStudySets,
    activeIndex,
    MAX_VISIBLE_INDICATORS
  );

  return (
    <ScrollReveal
      id="study-sets"
      className="container space-y-6"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            {copy.eyebrow}
          </p>
          <h2 className="text-3xl font-black tracking-tight md:text-balance sm:text-4xl">
            {copy.title}
          </h2>
          <p className="text-sm leading-7 text-muted-foreground sm:text-base">
            {copy.description}
          </p>
        </div>

        {!isLoading && !isError && totalStudySets > 1 ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:max-w-sm md:justify-end md:text-right">
            <p className="text-sm leading-6 text-muted-foreground">{copy.navigationHint}</p>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="relative z-10 h-11 w-11 shrink-0 rounded-full border-border/70 bg-card/85 shadow-[0_14px_35px_rgba(15,23,42,0.08)]"
                onClick={() => handleArrowClick(-1)}
                disabled={!canScrollPrev}
                aria-label={copy.prevLabel}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="relative z-10 h-11 w-11 shrink-0 rounded-full border-border/70 bg-card/85 shadow-[0_14px_35px_rgba(15,23,42,0.08)]"
                onClick={() => handleArrowClick(1)}
                disabled={!canScrollNext}
                aria-label={copy.nextLabel}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      {isLoading ? (
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
      ) : null}

      {isError ? (
        <Card className="app-surface border-destructive/25">
          <CardContent className="space-y-3 p-6 text-sm text-destructive">
            <div className="flex items-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{copy.loadingErrorTitle}</span>
            </div>
            <p className="text-muted-foreground">{copy.loadingErrorBody}</p>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !isError && !studySets.length ? (
        <Card className="app-surface">
          <CardContent className="space-y-3 p-6">
            <p className="text-lg font-bold">{copy.emptyTitle}</p>
            <p className="text-sm leading-7 text-muted-foreground">
              {copy.emptyBody}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !isError && studySets.length ? (
        <div className="relative overflow-hidden rounded-[32px] border border-border/60 bg-card/45 p-3 shadow-glow backdrop-blur sm:p-4">
          <div
            ref={carouselRef}
            className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 pt-1"
            aria-label={copy.listAriaLabel}
          >
            {visibleStudySets.map((studySet, index) => (
              <ScrollReveal
                key={studySet.id}
                data-study-set-slide
                delayMs={Math.min(index, 4) * 70}
                distance={18}
                className="shrink-0"
              >
                <StudySetCarouselCard
                  locale={locale}
                  studySet={studySet}
                  isActive={index === activeIndex}
                  studySetLearningStatusLabels={studySetLearningStatusLabels}
                  copy={copy}
                />
              </ScrollReveal>
            ))}
            {hasMoreStudySets ? (
              <div
                ref={loadMoreRef}
                className="flex w-16 shrink-0 snap-start items-center justify-center"
                aria-hidden="true"
              >
                <Loader2 className="h-5 w-5 animate-spin text-primary/60" />
              </div>
            ) : null}
          </div>

          {totalStudySets > 1 ? (
            <div className="mt-5 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                {indicatorIndexes.map((index) => (
                  <button
                    key={visibleStudySets[index]?.id ?? index}
                    type="button"
                    className={cn(
                      "relative z-10 h-2.5 shrink-0 rounded-full transition-all",
                      index === activeIndex
                        ? "w-10 bg-primary"
                        : "w-2.5 bg-primary/20 hover:bg-primary/40"
                    )}
                    onClick={() => scrollToCard(index)}
                    aria-label={`${copy.cardAriaPrefix} ${studySets[index]?.title ?? index + 1}`}
                    aria-pressed={index === activeIndex}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {formatVisibleRange(visibleRange, totalStudySets, copy)}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </ScrollReveal>
  );
}

