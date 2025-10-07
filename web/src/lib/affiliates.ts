function encodeUrl(u: string): string {
  try {
    return encodeURIComponent(u);
  } catch {
    return u;
  }
}

export function amazonLink(asin: string, baseUrl = "https://www.amazon.com/dp/"): string {
  const tag = process.env.NEXT_PUBLIC_AMAZON_TAG || process.env.AMAZON_TAG || "slctrips-20";
  return `${baseUrl}${asin}?tag=${tag}`;
}

export function awinLink(mid: string, target: string, ref = "slctrips"): string {
  const pid = process.env.NEXT_PUBLIC_AWIN_PID || process.env.AWIN_PID || "";
  const encoded = encodeUrl(target);
  return `https://www.awin1.com/cread.php?awinmid=${mid}&awinaffid=${pid}&clickref=${ref}&ued=${encoded}`;
}

export function viatorLink(target: string): string {
  const pid = process.env.NEXT_PUBLIC_VIATOR_PID || process.env.VIATOR_PID || "";
  const encoded = encodeUrl(target);
  return `https://www.viator.com/?pid=${pid}&mcid=42383&url=${encoded}`;
}


