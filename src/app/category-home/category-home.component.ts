import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ScriptsService } from '../services/scripts.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-category-home',
  templateUrl: './category-home.component.html',
  styleUrls: ['./category-home.component.css']
})
export class CategoryHomeComponent implements OnInit {
  todos: any = []
  completed: any = []

  editForm = new FormGroup({
    categoryname: new FormControl('', Validators.required),
    tagname: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
  });
  constructor( private scriptService: ScriptsService,
    private router: Router,
    private http: HttpClient) {
  }
  ngOnInit(): void {
    this.getCategory();
    this.getCategoryRight();
  }
  getCategory() {
    this.scriptService.getCategory().subscribe((data: any) => {
     this.todos = data;
     this.completed= data;
    });
    
  }
  getCategoryRight() {
    this.scriptService.getCategorySaved().subscribe((res: any) => {
       this.completed= res;
    });
    
  }


  onEditClick(id: any): void {
    this.router.navigate(['/edit', id]);
  }
  addCategory() {
    this.router.navigate(['/add-cat']);
  }
  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data,
        event.previousIndex,
        event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex, event.currentIndex);
        console.log('event', event.dropPoint);
        console.log('event', event);
        console.log('Right Side Data', event.container.data[ event.currentIndex + 1])
    }
    console.log(event.container.data)
    // this.http.post('http://localhost:3000/categorysaved', event.container.data).subscribe(
    //   response => console.log('Data saved to database!', response),
    //   error => console.error('Error saving data to database:', error)
    // )
  }
}
