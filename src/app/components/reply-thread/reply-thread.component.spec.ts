import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyThreadComponent } from './reply-thread.component';

describe('ReplyThreadComponent', () => {
  let component: ReplyThreadComponent;
  let fixture: ComponentFixture<ReplyThreadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplyThreadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReplyThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
