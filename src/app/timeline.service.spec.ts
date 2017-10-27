import { TestBed, inject } from '@angular/core/testing';
import { TestData } from "./model/test-data";
import { TimelineService } from './timeline.service';

describe('TimelineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimelineService]
    });
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
});
