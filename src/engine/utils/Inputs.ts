// @ts-types="@types/three"
import { EventDispatcher } from "three";

export type InputActionEvent = {
  type: string,
  message: {
    start: boolean;
  }
}

export type InputMapping = {
  name: string,
  keys: Array<string>,
};

type Actions = Set<string>;

type KeyMapState = {
  pressed: boolean;
  actions: Actions;
}

export type InputKeyActions = Map<string, KeyMapState>;

export default class Inputs extends EventDispatcher {
  mappings: InputKeyActions;

  constructor(mappings: Array<InputMapping> = []) {
    super();
    this.mappings = this.setInputActionsLookup(mappings);
    
    // keyboard listeners
    globalThis.addEventListener('keydown', this.keyDown);
    globalThis.addEventListener('keyup', this.keyUp);
  
    // mouse listener
    globalThis.addEventListener('mousedown', this.mouseDown);
    globalThis.addEventListener('mouseup', this.mouseUp);

    // TODO: gamepad listeners
  }

  setInputActionsLookup = (mappings: Array<InputMapping>) => {
    const inputKeysMap = new Map<string, KeyMapState>();
    mappings.forEach(({name, keys}) => {
      keys.forEach((inputKey: string) => {
        if(!inputKeysMap.has(inputKey)) {
          inputKeysMap.set(inputKey, {
            pressed: false,
            actions: new Set(),
          });
        }
        const { actions } = inputKeysMap.get(inputKey) as KeyMapState;
        if(actions && !actions.has(name)) {
          actions.add(name);
        }
      });
    });
    return inputKeysMap;
  };

  inputAction = (inputKey: string, start: boolean = false) => {
    const keyState = this.mappings.get(inputKey);
    if (keyState) {
      keyState.actions?.forEach((action) => {
        if (start !== keyState.pressed) {
          keyState.pressed = start;
          // @ts-expect-error never-expected
          this.dispatchEvent({
            type: action,
            message: {
              start,
            }
          });
        }
      });
    }
  };

  keyDown = (event: KeyboardEvent) => {
    const { code } = event;
    if (this.mappings.has(code)) {
      this.inputAction(code, true);
    }
  };
  
  keyUp = (event: KeyboardEvent) => {
    const { code } = event;
    if (this.mappings.has(code)) {
      this.inputAction(code);
    }
  };

  mouseDown = (event: MouseEvent) => {
    const { button } = event;

    if (button === 0) {
      this.inputAction('Mouse1', true);
    }
    if (button === 2) {
      this.inputAction('Mouse2', true);
    }
  };
  mouseUp = (event: MouseEvent) => {
    const { button } = event;
    
    if (button === 0) {
      this.inputAction('Mouse1');
    }
    if (button === 2) {
      this.inputAction('Mouse2');
    }
  };
}