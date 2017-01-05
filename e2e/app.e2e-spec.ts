import { ClasspipDashboardNewPage } from './app.po';

describe('classpip-dashboard-new App', function() {
  let page: ClasspipDashboardNewPage;

  beforeEach(() => {
    page = new ClasspipDashboardNewPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
