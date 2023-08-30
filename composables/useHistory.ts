type StateT = Record<string, any>;
type HookT = (state: StateT) => void;
function createHistoryStateList() {
  const callbacks: HookT[] = [];
  const push = (state: StateT, url: string) => {
    let s = Object.create(null);
    try {
      s = JSON.stringify(state);
    } catch {

    }
    
    window.history.pushState(s, '', url);
    onStateChange({ state: s });
  }
  const replace = (state: Record<string, any>, url: string) => {
    let s = Object.create(null);
    try {
      s = JSON.stringify(state);
    } catch {

    }
    window.history.replaceState(s, '', url);
    onStateChange({ state: s });
  }
  const onStateChange = (evt: { state: string }) => {
    const { state } = evt;
    callbacks.forEach((cb) => {
      let s = Object.create(null);
      try {
        s = JSON.parse(state);
      } catch {
  
      }
      cb(s);
    })
  }
  const registerHook = (hook: HookT) => {
    callbacks.push(hook);
  }
  const releaseHook = () => {
    Reflect.set(callbacks, 'length', 0);
  }
  return {
    onStateChange,
    push,
    replace,
    registerHook,
    releaseHook,
  }
}

export function useHistory() {
  const { onStateChange, push, replace, registerHook, releaseHook } = createHistoryStateList();
  onMounted(() => {
    if (!(window as any).__use_history__) {
      (window as any).__use_history__ = 1;
      window.addEventListener('popstate', onStateChange);      
    } else {
      (window as any).__use_history__ += 1;
    }
  });  
  onUnmounted(() => {
    releaseHook();
    (window as any).__use_history__ -= 1;
    if (0 === (window as any).__use_history__) {
      window.removeEventListener('popstate', onStateChange);
    }
  })

  return {
    pushState: push,
    replaceState: replace,
    registerHook,
  }
}