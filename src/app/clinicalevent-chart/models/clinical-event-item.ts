export class ClinicalEventItem {

    constructor(public patientid: number,
        public sourceid: number,
        public semantictype: string,
        public clinicalevent: string,
        public eventtime: string,
        public problem: string,
        public eventtype: number) {
    }

}