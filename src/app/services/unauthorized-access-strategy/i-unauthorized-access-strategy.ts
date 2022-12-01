import { Observable } from 'rxjs';

/***/
export interface IUnauthorizedAccessStrategy {
    /***/
    handle(error: any): Observable<never>;
}
