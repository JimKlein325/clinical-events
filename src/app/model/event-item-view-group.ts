import { EventItemViewmodel } from "./event-item-viewmodel";

export class EventItemViewGroup {
    constructor(
        public title: string,
        public events: Array<EventItemViewmodel>
    ){}
}
