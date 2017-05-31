export interface Item {
    //getDate(): Date;
}
export class ClinicalEventItem  {

    constructor(public patientid: number,
        public sourceid: number,
        public semantictype: string,
        public clinicalevent: string,
        public eventtime: string,
        public problem: string,
        public eventtype: number) {
    }

    // getDate(): Date {
    //     //  "eventtime": "2010-02-01",
    //     let strDate = new String(this.eventtime);
    //     let year = +strDate.substr(0, 4);// unary operator converts string to number
    //     let month = +strDate.substr(5, 2) - 1;
    //     let day = +strDate.substr(8, 2);

    //     return new Date(year, month, day);

    // }

}