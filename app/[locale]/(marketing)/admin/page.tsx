import { RouteMessagesProvider } from "@/app/route-messages-provider";
import { AdminPageClient } from "@/components/admin/admin-page-client";
import type { Locale } from "@/lib/preferences";

export default function LocalizedAdminPage({
  params
}: {
  params: { locale: string };
}) {
  return (
    <RouteMessagesProvider
      locale={params.locale as Locale}
      namespaces={["admin"]}
    >
      <AdminPageClient />
    </RouteMessagesProvider>
  );
}
