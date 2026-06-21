"use client";

import {
  ArrowRight,
  BadgeCheck,
  CirclePlay,
  Sparkles,
  Star,
} from "lucide-react";
import {
  FeatureStory,
  getMarketingContent,
  InfoTile,
  MiniMetric,
  SectionHeading
} from "@/components/home/landing-section-blocks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useI18n } from "@/hooks/use-i18n";

export function HomeMarketingSections() {
  const homeMessages = useI18n("home");
  const {
    momentumCards,
    methodSteps,
    featureStories,
    reasons,
    testimonials,
    faqs,
    labels
  } = getMarketingContent(homeMessages.landing);
  return (
    <div className="space-y-14 pb-16 md:space-y-20 md:pb-24">
      <ScrollReveal className="container">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {momentumCards.map((card, index) => (
            <ScrollReveal
              key={card.title}
              delayMs={index * 90}
              distance={20}
              className="h-full"
            >
              <Card className="app-surface h-full overflow-hidden">
                <CardContent className="space-y-3 p-5">
                  <Badge
                    variant="muted"
                    className="w-fit rounded-full border-0 bg-primary/10 text-primary"
                  >
                    {card.eyebrow}
                  </Badge>
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold tracking-tight">{card.title}</h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal
        id="phuong-phap"
        className="container"
      >
        <SectionHeading
          badge={labels.methodBadge}
          title={labels.methodTitle}
          description={labels.methodDescription}
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {methodSteps.map((step, index) => (
            <ScrollReveal
              key={step.title}
              delayMs={index * 80}
              distance={18}
            >
              <Card className="app-surface h-full">
                <CardContent className="space-y-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    {step.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold">{step.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delayMs={140}>
          <Card className="app-surface mt-6 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="surface-contrast relative overflow-hidden p-6 sm:p-8">
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300" />
                <div className="relative space-y-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="surface-contrast-chip rounded-full px-3 py-1">
                      {labels.roadmapBadge}
                    </Badge>
                    <span className="surface-contrast-muted text-sm">
                      {labels.roadmapDescription}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black tracking-tight sm:text-3xl">
                      {labels.roadmapTitle}
                    </h3>
                    <p className="surface-contrast-muted max-w-xl text-sm leading-7 sm:text-base">
                      {labels.roadmapBody}
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {labels.roadmapMetrics.map((metric) => (
                      <MiniMetric
                        key={metric.label}
                        label={metric.label}
                        value={metric.value}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 bg-card/80 p-6 sm:p-8">
                <div className="rounded-[28px] border border-primary/10 bg-card p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-primary">{labels.quickListenTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        {labels.quickListenBody}
                      </p>
                    </div>
                    <CirclePlay className="h-9 w-9 shrink-0 rounded-full bg-accent/10 p-2 text-accent" />
                  </div>
                  <div className="mt-4 space-y-3">
                    {labels.quickListenWords.map(([word, meaning]) => (
                      <div
                        key={word}
                        className="rounded-2xl bg-muted/80 px-4 py-3"
                      >
                        <p className="font-semibold">{word}</p>
                        <p className="text-sm text-muted-foreground">{meaning}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <InfoTile
                    icon={<Sparkles className="h-4 w-4" />}
                    title={labels.quickTiles[0].title}
                    description={labels.quickTiles[0].description}
                  />
                  <InfoTile
                    icon={<BadgeCheck className="h-4 w-4" />}
                    title={labels.quickTiles[1].title}
                    description={labels.quickTiles[1].description}
                  />
                </div>
              </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </ScrollReveal>

      <section className="space-y-8">
        {featureStories.map((story, index) => (
          <FeatureStory
            key={story.title}
            labels={labels}
            story={story}
            reverse={index % 2 === 1}
          />
        ))}
      </section>

      <section
        id="ly-do"
        className="container"
      >
        <SectionHeading
          badge={labels.featureBadge}
          title={labels.featureTitle}
          description={labels.featureDescription}
        />

        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {reasons.map((reason, index) => (
            <ScrollReveal
              key={reason.title}
              delayMs={index * 80}
              distance={18}
            >
              <Card className="app-surface h-full">
                <CardContent className="space-y-4 p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                    {reason.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold">{reason.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {reason.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="container">
        <SectionHeading
          badge={labels.testimonyBadge}
          title={labels.testimonyTitle}
          description={labels.testimonyDescription}
        />

        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal
              key={testimonial.name}
              delayMs={index * 90}
              distance={18}
            >
              <Card className="app-surface h-full">
                <CardContent className="flex h-full flex-col gap-5 p-6">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className="h-4 w-4 fill-current"
                      />
                    ))}
                  </div>
                  <p className="flex-1 text-sm leading-7 text-foreground/90">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="border-t border-border/70 pt-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section
        id="faq"
        className="container"
      >
        <SectionHeading
          badge={labels.faqBadge}
          title={labels.faqTitle}
          description={labels.faqDescription}
        />

        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="app-surface group overflow-hidden"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 text-left font-semibold">
                <span>{faq.question}</span>
                <span className="text-lg text-primary transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm leading-7 text-muted-foreground">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="container">
        <ScrollReveal delayMs={120}>
          <Card className="app-surface overflow-hidden">
            <CardContent className="relative p-6 sm:p-8 md:p-10">
              <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-sky-100/80 via-cyan-50/50 to-transparent lg:block" />
              <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="min-w-0 space-y-4">
                  <Badge className="w-fit rounded-full bg-primary px-4 py-1.5 text-primary-foreground">
                    {labels.ctaBadge}
                  </Badge>
                  <div className="space-y-3">
                    <h2 className="max-w-2xl text-3xl font-black tracking-tight md:text-balance sm:text-4xl">
                      {labels.ctaTitle}
                    </h2>
                    <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                      {labels.ctaDescription}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full px-7"
                  >
                    <a href="#study-sets">
                      {labels.ctaPrimary}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="secondary"
                    className="rounded-full px-7"
                  >
                    <a href="#faq">{labels.ctaSecondary}</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>
    </div>
  );
}

