export function jump(evt: Event) {
  evt.preventDefault();
  navigateTo(`${window.location.pathname}${window.location.search}`);
  const url = new URL((evt.target as HTMLAnchorElement).href);
  navigateTo(url.pathname);
}