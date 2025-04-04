import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedComponent } from './shared.component';

/**
 * Test suite for the {@link SharedComponent} component.
 * 
 * The test suite contains basic tests for the {@link SharedComponent} to verify its creation
 * and functionality.
 * 
 * @example
 * // Test to ensure the SharedComponent is created successfully
 * it('should create', () => {
 *   expect(component).toBeTruthy();
 * });
 */
describe('SharedComponent', () => {
  let component: SharedComponent;
  let fixture: ComponentFixture<SharedComponent>;

  /**
   * Before each test, configure the test module and initialize the component.
   * 
   * This setup ensures that the component is compiled and ready for testing.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Test to ensure the SharedComponent is created successfully.
   * 
   * This test checks that the component is truthy after it is created.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
