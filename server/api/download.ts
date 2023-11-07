const getSearchParams = (path: string | undefined) => {
  if (!path) {
    return {};
  }
  const idx = path.indexOf('?');
  if (idx > -1) {
    const p: Record<string, string | boolean> = {};
    path.slice(idx + 1).split('&').forEach((_) => {
      const [key, value] = _.split('=');
      p[key] = 'undefined' === typeof value ? true : value;
    });
    return p;
  } else {
    return {};
  }
}
export default defineEventHandler(async (event) => {
  console.log('handle', event.path);
  const { path } = event;
  const searchParams = getSearchParams(path);
  if (searchParams && searchParams.url) {
    const url = decodeURIComponent(searchParams.url as string);
    try {
      console.log('request to:', url);
      const repo = await fetch(url, {
        method: 'HEAD',
      });
      const dips = repo.headers.get('content-disposition');
      console.log('set header:', dips);
      event.node.res.setHeader('Content-Disposition', dips || 'none');
      return true;     
    } catch (err) {
      console.warn('err', (err as Error).message)
      event.node.res.setHeader('Content-Disposition', 'none');
      return true; 
    }
  } else {
    event.node.res.setHeader('Content-Disposition', 'none');
    return true; 
  }
});