import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContactDialogComponent } from './edit-contact-dialog.component';

describe('EditContactDialogComponent', () => {
  let component: EditContactDialogComponent;
  let fixture: ComponentFixture<EditContactDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditContactDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditContactDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
