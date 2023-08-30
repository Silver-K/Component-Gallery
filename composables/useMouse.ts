type Direction = '' | 'vertical' | 'horizontal';

function getDirection(x: number, y: number) {
  if (x > y) {
    return 'horizontal';
  }
  if (y > x) {
    return 'vertical';
  }
  return '';
}

export function useMouse() {
  const startX = ref(0);
  const startY = ref(0);
  const deltaX = ref(0);
  const deltaY = ref(0);
  const offsetX = ref(0);
  const offsetY = ref(0);
  const direction = ref<Direction>('');

  const isVertical = () => direction.value === 'vertical';
  const isHorizontal = () => direction.value === 'horizontal';

  const reset = () => {
    deltaX.value = 0;
    deltaY.value = 0;
    offsetX.value = 0;
    offsetY.value = 0;
    direction.value = '';
  };

  const start = ((event: MouseEvent) => {
    reset();
    startX.value = event.clientX;
    startY.value = event.clientY;
  }) as EventListener;

  const move = ((event: MouseEvent) => {
    const touch = event;
    // safari back will set clientX to negative number
    deltaX.value = (touch.clientX < 0 ? 0 : touch.clientX) - startX.value;
    deltaY.value = touch.clientY - startY.value;
    offsetX.value = Math.abs(deltaX.value);
    offsetY.value = Math.abs(deltaY.value);

    // lock direction when distance is greater than a certain value
    const LOCK_DIRECTION_DISTANCE = 10;
    if (
      !direction.value ||
      (offsetX.value < LOCK_DIRECTION_DISTANCE &&
        offsetY.value < LOCK_DIRECTION_DISTANCE)
    ) {
      direction.value = getDirection(offsetX.value, offsetY.value);
    }
  }) as EventListener;

  return {
    move,
    start,
    reset,
    startX,
    startY,
    deltaX,
    deltaY,
    offsetX,
    offsetY,
    direction,
    isVertical,
    isHorizontal,
  };
}