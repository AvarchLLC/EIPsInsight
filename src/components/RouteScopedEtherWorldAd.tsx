import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useMemo } from "react";

const CloseableAdCard = dynamic(() => import("@/components/CloseableAdCard"), {
  ssr: false,
});

const AD_ROUTES = new Set<string>([
  "/", // root index
  "/home",
  "/signin",
  "/signup",
  "/test",
  "/testv2",
  "/trivia",
  "/authors/[name]",
  "/catTable/[status]/[cat]",
  "/ercs/[erc-number]",
  "/insight/[2023]/[month]",
  "/issue/[Type]/[number]",
  "/monthly/[type]/[year]/[month]/[status]",
  "/PR/[Type]/[number]",
  "/stats/[status]/[date]",
  "/tableStatus/[type]/[status]",
  "/[redirects]",
]);

export default function RouteScopedEtherWorldAd() {
  const router = useRouter();

  const shouldShow = useMemo(() => {
    return AD_ROUTES.has(router.pathname);
  }, [router.pathname]);

  if (!shouldShow) return null;

  return (
    <div style={{ marginTop: "2rem" }}>
      {/* <CloseableAdCard /> */}
    </div>
  );
}
