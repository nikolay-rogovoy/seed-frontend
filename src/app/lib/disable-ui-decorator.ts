import { Type } from '@angular/core';

/***/
export function DisableUIDecorator() {
  return function <T extends Type<IDisableUIComponent>>(target: T) {
    return class extends target {
      _isDisableUI = true;
      isDisabledUI(): boolean {
        return this._isDisableUI;
      }
      disableUI(): void {
        this._isDisableUI = true;
      }
      enableUI(): void {
        this._isDisableUI = false;
      }
    };
  };
}

export interface IDisableUIComponent {
  isDisabledUI(): boolean;
  disableUI(): void;
  enableUI(): void;
}
