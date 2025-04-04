import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

/**
 * Test suite for the {@link AppComponent}.
 *
 * This suite contains tests to verify that the {@link AppComponent} behaves as expected.
 */
describe('AppComponent', () => {

  /**
   * Initializes the testing environment for the {@link AppComponent} before each test.
   * This configuration sets up the testing module and compiles components.
   *
   * @returns {Promise<void>} A promise that resolves when the testing module has been compiled.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  /**
   * Tests if the {@link AppComponent} is successfully created.
   * 
   * This test checks whether an instance of {@link AppComponent} can be created without errors.
   */
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  /**
   * Tests if the {@link AppComponent} has the correct title.
   * 
   * This test checks if the title property of {@link AppComponent} is set to 'join'.
   */
  it(`should have the 'join' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('join');
  });

  /**
   * Tests if the title is correctly rendered in the template.
   * 
   * This test ensures that the {@link AppComponent} renders the title 'join' within an <h1> element in the HTML template.
   */
  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, join');
  });
});
