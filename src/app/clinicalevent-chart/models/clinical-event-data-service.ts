import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ClinicalEventItem } from  './clinical-event-item';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Injectable()
export class ClinicalEventDataService {

    constructor(private http: Http) { }

    getClinicalEventData():  Observable<ClinicalEventItem[]> {
        return  this.http.get('http://192.168.2.207/RecentiaHealth/Patient/getClinicalItem.php?ClinicalItem=ClinicalEventTimeline&PatientID=1')//('./app/simple-barchart/models/clinical-event.json')
            .map((response: Response) => { console.log(response); <ClinicalEventItem[]>response.json()})
            .do(data => console.log("data:  " + data))
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error("handle error:"  + error);
        let msg = `Error status code ${error.status} at ${error.url}`;
        return Observable.throw(msg);
    }

}

