import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletCardDialogComponent } from './delet-card-dialog.component';

describe('DeletCardDialogComponent', () => {
  let component: DeletCardDialogComponent;
  let fixture: ComponentFixture<DeletCardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletCardDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletCardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
