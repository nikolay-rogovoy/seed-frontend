import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { MessageboxParam } from "./messagebox-component/messagebox-param";

@Injectable()
export class MessageboxService {
  listner: (messageboxParam: MessageboxParam) => Observable<boolean>;
  show(messageboxParam: MessageboxParam) {
    if (this.listner) {
      return this.listner(messageboxParam);
    }
  }
}
