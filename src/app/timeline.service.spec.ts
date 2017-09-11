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
    it('should place Diagnosis information above axis', inject([TimelineService], (service: TimelineService) => {
      const prepareData = service.prepareData(TestData.dataset);
      // console.log(prepareData[0].yValue);
      expect(prepareData[0].yValue).toBeGreaterThan(0);
    }));
    it('should place Treatment information above axis', inject([TimelineService], (service: TimelineService) => {
      const prepareData = service.prepareData(TestData.dataset);
      // console.log(prepareData[2].yValue);
      expect(prepareData[2].yValue).toBeGreaterThan(0);
    }));
    it('should place Quality of Life information above axis', inject([TimelineService], (service: TimelineService) => {
      const prepareData = service.prepareData(TestData.dataset);
      // console.log(prepareData[prepareData.length -1].yValue);
      expect(prepareData[prepareData.length -1].yValue).toBeLessThan(0);
    }));
  })
});
