import {ClinicalEventItem} from './clinical-event-item';

export class ClinicalEventItemWrapper {
    //itemDate: Date;
    constructor(public item: ClinicalEventItem,
        public yValue: number,
        itemDate: Date = null
        ) {
            // this.itemDate = this.item.getDate();
            // if (itemDate!=null) {
            //     this.itemDate = this.getDate(itemDate);
            // }
            
        }
        get itemDate(): Date {
            return this.getDate(this.item.eventtime);
        }

    getDate(s): Date {
        //  "eventtime": "2010-02-01",
        let strDate = new String(s);
        let year = +strDate.substr(0, 4);// unary operator converts string to number
        let month = +strDate.substr(5, 2) - 1;
        let day = +strDate.substr(8, 2);

        return new Date(year, month, day);
    }
    }
