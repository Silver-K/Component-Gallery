export interface TagResolved {
  token: string,
  attrs: Record<string, string | boolean>,
}
const resolveTag = (t: string[]) => {
  const [_, c] = t;

  const result: TagResolved = {
    token: '',
    attrs: {},
  };
  const sp = c.split(' ');
  result.token = sp[0];
  sp.slice(1).forEach((att) => {
    const [key, value] = att.split('=');
    if (value) {
      result.attrs[key] = value.slice(1, -1);
    } else {
      result.attrs[key] = true;
    }
  });
  return result;
}
const generateTag = (t: TagResolved) => {
  const attr = Object.entries(t.attrs).map((v) => {
    const [key, value] = v;
    if ('boolean' === typeof value) {
      return key;
    } else {
      return `${key}="${value}"`;
    }
  }).join(' ');
  return `<${t.token} ${attr}>`;
}
export const resolveHtml = async (_html: string, plugin: (t: TagResolved) => void) => {
  const list: string[] =  []
  const html = _html.replace(/<[^]*?>/g, (_) => {
    list.push(_);
    return '{|%|}';
  });

  const resolver = async (v: RegExpMatchArray) => {
    const tagRes = resolveTag(v);
    await plugin(tagRes);
    return generateTag(tagRes);
  };

  for (let i = 0; i < list.length; i++) {
    list[i] = await resolver([list[i], list[i].slice(1, -1)]);
  }
  return html.replace(/\{\|\%\|\}/g, () => {
    return list.shift() as string;
  });
}