import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateAccounts } from './validate-accounts';

describe('ValidateAccounts', () => {
  let component: ValidateAccounts;
  let fixture: ComponentFixture<ValidateAccounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidateAccounts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidateAccounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
