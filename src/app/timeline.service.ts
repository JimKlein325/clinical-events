import { Injectable } from '@angular/core';
import { ClinicalEventItem } from "./clinicalevent-chart/models/clinical-event-item";
import { ClinicalEventReport } from "./clinicalevent-chart/models/clinical-event-report";
import { ClinicalEventItemWrapper } from "./clinicalevent-chart/models/clinical-event-item-wrapper";

@Injectable()
export class TimelineService {

  public clinicalEventReport: ClinicalEventReport;
  


  public dataset: ClinicalEventItem[] = [
    {
      "patientid": 1,
      "sourceid": 1000000000,
      "semantictype": "DiagnosticProcedure",
      "clinicalevent": "Diagnosis",
      "eventtime": "2010-02-01",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000001,
      "semantictype": "DiagnosticProcedure",
      "clinicalevent": "Staging",
      "eventtime": "2010-02-01",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000003,
      "semantictype": "Medication",
      "clinicalevent": "Aloxi",
      "eventtime": "2010-03-18",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000002,
      "semantictype": "Medication",
      "clinicalevent": "Taxotere",
      "eventtime": "2010-03-18",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000006,
      "semantictype": "Medication",
      "clinicalevent": "Tarceva",
      "eventtime": "2010-05-20",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000007,
      "semantictype": "Medication",
      "clinicalevent": "Tarceva",
      "eventtime": "2010-06-16",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000008,
      "semantictype": "Medication",
      "clinicalevent": "Gemzar",
      "eventtime": "2010-06-17",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000009,
      "semantictype": "Medication",
      "clinicalevent": "Navelbine",
      "eventtime": "2010-06-17",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000010,
      "semantictype": "Medication",
      "clinicalevent": "Aloxi",
      "eventtime": "2010-06-27",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000011,
      "semantictype": "Medication",
      "clinicalevent": "Gemzar",
      "eventtime": "2010-06-27",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000012,
      "semantictype": "Medication",
      "clinicalevent": "Navelbine",
      "eventtime": "2010-06-27",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000015,
      "semantictype": "Medication",
      "clinicalevent": "Emend",
      "eventtime": "2010-07-11",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000016,
      "semantictype": "Medication",
      "clinicalevent": "Gemzar",
      "eventtime": "2010-07-11",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000017,
      "semantictype": "Medication",
      "clinicalevent": "Navelbine",
      "eventtime": "2010-07-11",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000019,
      "semantictype": "Medication",
      "clinicalevent": "Emend",
      "eventtime": "2010-07-21",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000020,
      "semantictype": "Medication",
      "clinicalevent": "Gemzar",
      "eventtime": "2010-07-21",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000021,
      "semantictype": "Medication",
      "clinicalevent": "Navelbine",
      "eventtime": "2010-07-21",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000023,
      "semantictype": "Medication",
      "clinicalevent": "Emend",
      "eventtime": "2010-08-07",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000024,
      "semantictype": "Medication",
      "clinicalevent": "Gemzar",
      "eventtime": "2010-08-07",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000025,
      "semantictype": "Medication",
      "clinicalevent": "Navelbine",
      "eventtime": "2010-08-07",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000027,
      "semantictype": "Medication",
      "clinicalevent": "Emend",
      "eventtime": "2010-08-14",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000028,
      "semantictype": "Medication",
      "clinicalevent": "Gemzar",
      "eventtime": "2010-08-14",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000029,
      "semantictype": "Medication",
      "clinicalevent": "Navelbine",
      "eventtime": "2010-08-14",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000031,
      "semantictype": "Medication",
      "clinicalevent": "Emend",
      "eventtime": "2010-08-28",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000032,
      "semantictype": "Medication",
      "clinicalevent": "Gemzar",
      "eventtime": "2010-08-28",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000033,
      "semantictype": "Medication",
      "clinicalevent": "Navelbine",
      "eventtime": "2010-08-28",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 1
    },
    {
      "patientid": 1,
      "sourceid": 1000000004,
      "semantictype": "Medication",
      "clinicalevent": "Dexamethasone p.o.",
      "eventtime": "2010-03-18",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 0
    },
    {
      "patientid": 1,
      "sourceid": 1000000005,
      "semantictype": "Medication",
      "clinicalevent": "Neulasta",
      "eventtime": "2010-03-19",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 0
    },
    {
      "patientid": 1,
      "sourceid": 1000000013,
      "semantictype": "Medication",
      "clinicalevent": "Dexamethasone i.v.",
      "eventtime": "2010-06-27",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 0
    },
    {
      "patientid": 1,
      "sourceid": 1000000014,
      "semantictype": "Medication",
      "clinicalevent": "Neupogen",
      "eventtime": "2010-07-04",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 0
    },
    {
      "patientid": 1,
      "sourceid": 1000000018,
      "semantictype": "Medication",
      "clinicalevent": "Zofran",
      "eventtime": "2010-07-11",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 0
    },
    {
      "patientid": 1,
      "sourceid": 1000000022,
      "semantictype": "Medication",
      "clinicalevent": "Zofran",
      "eventtime": "2010-07-21",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 0
    }
    ,
    {
      "patientid": 1,
      "sourceid": 1000000026,
      "semantictype": "Medication",
      "clinicalevent": "Zofran",
      "eventtime": "2010-08-07",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 0
    },
    {
      "patientid": 1,
      "sourceid": 1000000030,
      "semantictype": "Medication",
      "clinicalevent": "Zofran",
      "eventtime": "2010-08-14",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 0
    },
    {
      "patientid": 1,
      "sourceid": 1000000034,
      "semantictype": "Medication",
      "clinicalevent": "Zofran",
      "eventtime": "2010-08-28",
      "problem": "Non-Small-Cell Lung Cancer, EGRF Mutation Positive, Stage IIIb",
      "eventtype": 0
    }
  ];

  constructor() { }

  // generate the height above or below the unmarked axis based on item's index position
  genYValue(eventType: number,
    slots: number,
    offset: number,
    index: number
  ): number {
    let multiplier: number;
    let slotsAboveOrBelowAxis = slots / 2;
    // multiplier used to position item above or below axis
    if (eventType == 1) {
      multiplier = 1;
    } else {
      multiplier = -1;
    }
    return multiplier * (slotsAboveOrBelowAxis - (index % (slots / 2))) * offset
  };
  getDate(s): Date {
    //TODO: add regex test of date format
    // input format: "eventtime": "2010-02-01",
    let strDate = new String(s);
    let year = +strDate.substr(0, 4);// unary operator converts string to number
    let month = +strDate.substr(5, 2) - 1;
    let day = +strDate.substr(8, 2);

    return new Date(year, month, day);
  }

 prepareData() {
    let slots: number = 20;
    let offset: number = 3;
    this.clinicalEventReport = new ClinicalEventReport(slots, offset, null);

    let items: ClinicalEventItemWrapper[];

    // use reduce(fold) to build new list of wrapper items containing the yValue for chart elements
    let treatmentItems = this.dataset
      .filter(item => item.eventtype == 1)
      .reduce((acc, item, index) => {
        let yVal = this.genYValue(item.eventtype, slots, offset, index);
        let ce = [new ClinicalEventItemWrapper(item, yVal, this.getDate(item.eventtime))];
        // array.push returns a number, so use concat here
        return acc.concat(ce);
      },
      new Array<ClinicalEventItemWrapper>()
      );

    let palativeItems = this.dataset.filter(item => item.eventtype == 0)
      .reduce((acc, item, index) => {
        let yVal = this.genYValue(item.eventtype, slots, offset, index);
        let ce = [new ClinicalEventItemWrapper(item, yVal, this.getDate(item.eventtime))];
        // array.push returns a number, so use concat here
        return acc.concat(ce);
      },
      new Array<ClinicalEventItemWrapper>()
      );
    // this is the list of all clinical event items to display  
    let fullList = treatmentItems.concat(palativeItems);

    this.clinicalEventReport.wrappedItems = fullList;

    // set MaxDate/MinDate properties for timeline start and finish
    let FirstItem = fullList
      .reduce((acc, item) =>
        acc.itemDate < item.itemDate ? acc : item
      );
    this.clinicalEventReport.minDate = this.getDate(FirstItem.item.eventtime);

    let lastItem = fullList
      .reduce((acc, item) =>
        acc.itemDate > item.itemDate ? acc : item
      );
    this.clinicalEventReport.maxDate = this.getDate(lastItem.item.eventtime);

  }
}
