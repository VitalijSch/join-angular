import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search-add-task',
  standalone: true,
  imports: [],
  templateUrl: './search-add-task.component.html',
  styleUrl: './search-add-task.component.scss'
})
export class SearchAddTaskComponent {
  @ViewChild('search') search!: ElementRef;

  public focusInput(): void {
    this.search.nativeElement.focus();
  }
}
