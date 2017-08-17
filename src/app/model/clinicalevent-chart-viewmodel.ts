import { ClinicalEventItem } from "../clinicalevent-chart/models/clinical-event-item";
import { ClinicalEventItemWrapper } from "../clinicalevent-chart/models/clinical-event-item-wrapper";
import { ClinicalEventReport } from "../clinicalevent-chart/models/clinical-event-report";

export class ClinicaleventChartViewmodel {
    constructor(
        public eventItems: Array<ClinicalEventItemWrapper>,
    public report: ClinicalEventReport,
    public monthsInCurrentTimeframe: number,
    public minDate: Date,
    public maxDate: Date
    ){}
}
