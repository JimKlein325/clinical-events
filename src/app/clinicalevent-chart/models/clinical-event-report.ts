import { ClinicalEventItem } from './clinical-event-item';
import { ClinicalEventItemWrapper } from './clinical-event-item-wrapper';

export class ClinicalEventReport {
    public problemName: string;
    public wrappedItems: ClinicalEventItemWrapper[] = new Array();
    public problemTreatmentItemCount: number;
    public palliativeItemCount: number;
    public problemTreatmentEntrySlots: number;
    public palliativeEntrySlots: number;


    constructor(public eventItems: ClinicalEventItem[],
        public totalVerticalEntrySlots: number,
        public verticalOffset: number) {
        this.problemName = eventItems[0].problem != null ? eventItems[0].problem : "";

        this.problemTreatmentItemCount = //30;
            eventItems.reduce((count, item) => {
                let counter = (item.eventtype === 1 ? 1 : 0);// 1 = Problem Treatment drug
                return count + counter
            }
                , 0);

        this.palliativeItemCount =
            eventItems.reduce((count, item) => {
                let counter = (item.eventtype != 1 ? 1 : 0);
                return count + counter
            }
                , 0);

        this.problemTreatmentEntrySlots = this.getNumberOfVeriticalEntrySlots(this.problemTreatmentItemCount);
        this.palliativeEntrySlots = this.getNumberOfVeriticalEntrySlots(this.palliativeItemCount);

        // assemble wrappedItems collection
        let treatmentCounter = 0;
        let palliativeCounter = 0;
        for (let item of eventItems) {
            let itemDate = this.getDate(item.eventtime);

            if (item.eventtype === 1) {
                let wrappedItem = new ClinicalEventItemWrapper(item, this.yValue(item, this.problemTreatmentEntrySlots, this.problemTreatmentItemCount, 
                    treatmentCounter), itemDate);
                this.wrappedItems.push(wrappedItem);
                ++treatmentCounter;
            }
            if (item.eventtype === 0) {
                let wrappedItem = new ClinicalEventItemWrapper(item, this.yValue(item, this.palliativeEntrySlots, this.palliativeItemCount,
                    palliativeCounter), itemDate);
                this.wrappedItems.push(wrappedItem);
                ++palliativeCounter;
            }
        }
    }

    getNumberOfVeriticalEntrySlots(itemCount: number): number {
        // return 20;
        if (itemCount <= this.totalVerticalEntrySlots / 2) {
            return itemCount;
        }
        else {
            if (itemCount < this.totalVerticalEntrySlots) {
                return itemCount / 2;
            }
            else {
                return this.totalVerticalEntrySlots / 2;
            }
        }

    }

    yValue(item: ClinicalEventItem, numberOfSlots: number, itemCount: number, indexValue: number): number {
        let value = ((itemCount - indexValue) % numberOfSlots);
        //console.log(value);
        let yAbsoluteValue = value > 0 ? value * this.verticalOffset : numberOfSlots* this.verticalOffset;;
        let yVal = item.eventtype === 1 ? yAbsoluteValue : (-1) * yAbsoluteValue;
        //console.log(yVal);
        return yVal;
    }

    getDate(d): Date {
        //  "eventtime": "2010-02-01",
        let strDate = new String(d);
        let year = +strDate.substr(0, 4);// unary operator converts string to number
        let month = +strDate.substr(5, 2) - 1;
        let day = +strDate.substr(8, 2);

        return new Date(year, month, day);

    }

}