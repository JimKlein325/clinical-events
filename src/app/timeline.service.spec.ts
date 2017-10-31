import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpModule, Http, BaseRequestOptions, XHRBackend, Response, ResponseOptions } from "@angular/http";
import { MockBackend, MockConnection } from "@angular/http/testing";

import { TestData } from "./model/test-data";
import { TimelineService } from './timeline.service';

describe('TimelineService', () => {
  let service: TimelineService;
  let backend: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        TimelineService,
        { provide: XHRBackend, useClass: MockBackend }
      ]
    });

    // backend = TestBed.get(MockBackend);
    // service = TestBed.get(TimelineService);

  });

  it('should be created', inject([TimelineService], (service: TimelineService) => {
    const preparedData = service.prepareData(TestData.dataset);
    expect(service).toBeTruthy();
  }));

  describe('prepareData()', () => {
    it('should place Diagnosis information ABOVE X axis', inject([TimelineService], (service: TimelineService) => {
      let prepareData = service.prepareData(TestData.dataset);
      expect(prepareData[0].yValue).toBeGreaterThan(0);
    }));
    it('should place Treatment information ABOVE X axis', inject([TimelineService], (service: TimelineService) => {
      let prepareData = service.prepareData(TestData.dataset);
      expect(prepareData[2].yValue).toBeGreaterThan(0);
    }));
    it('should place Quality of Life information BELOW X axis', inject([TimelineService], (service: TimelineService) => {
      let prepareData = service.prepareData(TestData.dataset);
      expect(prepareData[prepareData.length -1].yValue).toBeLessThan(0);
    }));
    it('***Isolated Test**** should place Quality of Life information BELOW X axis',  () => {
      //example of isolated test style for testing pure methods
      const service = new TimelineService(null);
      let prepareData = service.prepareData(TestData.dataset);
      expect(prepareData[prepareData.length -1].yValue).toBeLessThan(0);
    });
  })

  /*
  Test loading of events by testing state after calling loadEvents().
  */
//   describe('loadEvents()', () => {

//     it('should load events and store them in state object',
//     fakeAsync(() => {
//       backend.connections.subscribe((connection) => { connection.mockRespond( new Response( new ResponseOptions({ body:  JSON.stringify(TestData.dataset)
//       })));
//     }); 
//     service.loadEvents();
//     tick();

//     service.state$.subscribe((result)=> {
//       console.log('result: ', result);
//       debugger;
//       expect(result.data.length).toBe(35);
//       });

//   }));
// });
    describe('loadEvents()', () => {
      it('should load events and store them in state object',
      inject([TimelineService, XHRBackend], (service, mockBackend) => {
        mockBackend.connections.subscribe((connection) => { connection.mockRespond( new Response( new ResponseOptions({ body:  JSON.stringify(TestData.dataset)
        })));
      }); 
      service.loadEvents();
  
      service.state$.subscribe((result)=> {
        console.log('result: ', result);
        debugger;
        expect(result.data.length).toBe(35);
        });
  
    }));
  });
});
