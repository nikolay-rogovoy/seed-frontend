import { InjectionToken } from '@angular/core';
import { IUnauthorizedAccessStrategy } from './i-unauthorized-access-strategy';

/***/
export const unauthorizedAccessStrategyInjectionToken = new InjectionToken<IUnauthorizedAccessStrategy>('unauthorizedAccessStrategyInjectionToken');
