import {IDependency} from '../interfaces/i-dependency';

/***/
export class FailedDependency {
  /***/
  constructor(public dependency: IDependency[]) {
  }
}
