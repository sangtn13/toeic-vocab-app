"use client";

import { useState } from "react";
import { KeyRound, UserRoundPlus } from "lucide-react";
import { toast } from "sonner";
import { usePreferences } from "@/app/preferences-provider";
import { useI18n } from "@/hooks/use-i18n";
import { useLogin, useRegister } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatMessage } from "@/locales/format";
import { getUserFacingErrorMessage } from "@/utils/error";
import { getRoleLabel } from "@/utils/user-copy";

type AuthMode = "login" | "register";

export function AuthPanel({
  defaultMode = "login",
  title,
  description,
  onSuccess
}: {
  defaultMode?: AuthMode;
  title?: string;
  description?: string;
  onSuccess?: () => void;
}) {
  const { locale } = usePreferences();
  const authMessages = useI18n("auth");
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const isPending = loginMutation.isPending || registerMutation.isPending;
  const copy = authMessages.panel;
  const resolvedTitle = title ?? copy.defaultTitle;
  const resolvedDescription = description ?? copy.defaultDescription;
  const normalizedEmail = email.trim().toLowerCase();

  const handleSubmit = async () => {
    try {
      if (mode === "login") {
        const result = await loginMutation.mutateAsync({
          email: normalizedEmail,
          password
        });
        toast.success(
          formatMessage(copy.loginWelcome, {
            fullName: result.user.fullName,
            roleLabel: getRoleLabel(result.user.role, locale)
          })
        );
      } else {
        const result = await registerMutation.mutateAsync({
          fullName: fullName.trim(),
          email: normalizedEmail,
          password
        });
        toast.success(
          formatMessage(copy.registerSuccess, {
            email: result.user.email
          })
        );
      }

      setPassword("");
      onSuccess?.();
    } catch (error) {
      toast.error(getUserFacingErrorMessage(error, copy.actionFailed, locale));
    }
  };

  return (
    <Card className="overflow-hidden rounded-[28px] border-border bg-card shadow-[0_18px_40px_rgba(148,163,184,0.16)]">
      <CardHeader className="space-y-4 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="rounded-full bg-primary px-4 py-1.5 text-primary-foreground">
            {copy.account}
          </Badge>
          <Badge
            variant="secondary"
            className="rounded-full border border-border bg-muted px-4 py-1.5 text-muted-foreground"
          >
            {copy.keepProgress}
          </Badge>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl font-black tracking-tight text-foreground">
            {resolvedTitle}
          </CardTitle>
          <CardDescription className="max-w-xl text-sm leading-6 text-muted-foreground">
            {resolvedDescription}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-2 rounded-[22px] border border-border bg-muted/60 p-1.5">
          <Button
            type="button"
            variant={mode === "login" ? "default" : "ghost"}
            className="rounded-[18px]"
            onClick={() => setMode("login")}
          >
            <KeyRound className="mr-2 h-4 w-4" />
            {copy.login}
          </Button>
          <Button
            type="button"
            variant={mode === "register" ? "default" : "ghost"}
            className="rounded-[18px]"
            onClick={() => setMode("register")}
          >
            <UserRoundPlus className="mr-2 h-4 w-4" />
            {copy.register}
          </Button>
        </div>

        <div className="space-y-4">
          {mode === "register" ? (
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-foreground">{copy.fullName}</span>
              <Input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Toeic User"
                className="h-12 rounded-2xl border-border"
              />
            </label>
          ) : null}

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-foreground">{copy.email}</span>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="user@example.com"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className="h-12 rounded-2xl border-border"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-foreground">{copy.password}</span>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="secret123"
              className="h-12 rounded-2xl border-border"
            />
          </label>
        </div>

        <Button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={
            isPending || (mode === "register" && (!normalizedEmail || !password.trim() || !fullName.trim()))
          }
          className="h-12 w-full rounded-2xl"
        >
          {mode === "login" ? copy.loginNow : copy.createAccount}
        </Button>
      </CardContent>
    </Card>
  );
}
