import { ClinicalEventsPage } from './app.po';

describe('clinical-events App', function() {
  let page: ClinicalEventsPage;

  beforeEach(() => {
    page = new ClinicalEventsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
