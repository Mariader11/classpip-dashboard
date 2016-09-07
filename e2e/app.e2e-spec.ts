import { ClasspipDashboardPage } from './app.po';

describe('classpip-dashboard App', function() {
  let page: ClasspipDashboardPage;

  beforeEach(() => {
    page = new ClasspipDashboardPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
