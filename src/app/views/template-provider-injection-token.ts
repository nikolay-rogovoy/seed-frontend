import { InjectionToken } from '@angular/core';
import { TemplateProviderComponent } from '../lib/template-provider-component/template-provider-component';

/***/
export const templateProviderInjectionToken = new InjectionToken<ITemplateProviderStorage>('templateProviderInjectionToken');

/***/
export interface ITemplateProviderStorage {
    /***/
    templateProvider: TemplateProviderComponent;
}
