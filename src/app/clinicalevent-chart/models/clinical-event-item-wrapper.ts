import {ClinicalEventItem} from './clinical-event-item';

export class ClinicalEventItemWrapper {

    constructor(public item: ClinicalEventItem,
        public yValue: number,
        public itemDate: Date
        ) {

    }


}