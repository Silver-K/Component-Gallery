export const isDownloadable: (url: string) => Promise<boolean> = (url: string) => {
  return fetch(`/api/download?url=${url}`, {
    method: 'HEAD'
  }).then((res) => {
    if (res) {
      const disposition = res.headers.get('content-disposition');
      return !!disposition?.includes('attachment');
    } else {
      console.warn('network error');
      return Promise.reject(false);
    }
  })
}