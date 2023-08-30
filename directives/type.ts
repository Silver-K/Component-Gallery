export default {
  mounted(el: HTMLElement, binding: { value: any, arg: string, modifiers: Record<string, boolean> }) {
    const { value, arg, modifiers } = binding;
    const originText = el.textContent;
    const text = originText;
    const interval = arg ? Number(arg) : 250;
    if (modifiers.placeholder) {
      el.style.width = `${el.offsetWidth + 32}px`;
      el.style.display = 'inline-block';
      el.style.textAlign = 'left';
    }
    el.textContent = '';
    
    if (!text) {
      return;
    }
    let renderText = '';
    let addState = true;
    const char = text.split('');
    const addChar = (currentText: string) => {
      let add = value || '_';
      if (char.length) {
        add = `${char.shift()}${add}`;
      }
      return `${currentText}${add}`;
    }
    const delChar = (currentText: string) => {
      return currentText.slice(0, -1);
    }
    let time = 0;
    const callback = (timestamp: number) => {
      if (timestamp - time >= interval / 2) {
        time = timestamp;
        if (addState) {
            renderText = addChar(renderText);
            el.textContent = renderText;
            addState = false;
          } else {
            renderText = delChar(renderText);
            el.textContent = renderText;
            addState = true;
          }
      }
      window.requestAnimationFrame(callback);
    }
    const timer = window.requestAnimationFrame(callback);
    (el as any).__vType = timer;
  },
  unmounted(el: Element) {
    cancelAnimationFrame((el as any).__vType);
  }
}