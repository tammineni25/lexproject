import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ScriptsService } from '../services/scripts.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {

  category: any = {}
  categoryIdToUpdate = null;
  itemId: any;
  statusCode: any;
  requestProcessing = false;
  processValidation = false;
  roles = ['Admin', 'User', 'Others'];
  editForm: FormGroup;
  // editForm = new FormGroup({
  //   categoryName: new FormControl('', [Validators.required, Validators.minLength(2)]),
  //   tagName: new FormControl('', Validators.required),
  //   role: new FormControl('', Validators.required),
  // });
  subscriptionRoute: Subscription;
  heading: any;
  constructor(private scriptsService: ScriptsService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder) {
      this.editForm = this.fb.group({
        categoryName: ['', Validators.required],
        tagName: ['', Validators.required],
        role: ['', Validators.required]
      });

      this.subscriptionRoute = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          console.log(event.url);
          if(event.url == '/add-cat') {
            this.heading = 'Add'
          }else {
            this.heading = 'Edit'
          }
        }
      });

     }

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id');
    if (!!this.itemId) {
      this.categoryIdToUpdate = this.itemId;
      this.scriptsService.getCategoryById(this.itemId).subscribe(category => {
        this.editForm.setValue({ categoryName: category.categoryName, tagName: category.tagName, role: category.role });
      });
    }
  }

  onSubmit(): void {
    this.processValidation = true;
    if (this.editForm.invalid) {
      return; //Validation failed, exit from method.
    }
    //Form is valid, now perform create or update
    this.preProcessConfigurations();
    this.category = this.editForm.value;
    if (this.categoryIdToUpdate === null) {
      this.scriptsService.createCategory(this.category).subscribe((statusCode) => {
        this.statusCode = statusCode;
        this.backToCreateArticle();
        if (statusCode === 201) {
          this.router.navigate(['/cat-home']);
        }
      },
        errorCode => this.statusCode = errorCode);
    } else {
      this.category.id = this.categoryIdToUpdate;
      this.scriptsService.updateCategory(this.category)
        .subscribe(statusCode => {
          this.statusCode = 200;
          this.backToCreateArticle();
          if (statusCode === 200) {
            this.router.navigate(['/cat-home']);
          }
        },
          errorCode => this.statusCode = errorCode);
    }
  }
  //Perform preliminary processing configurations
  preProcessConfigurations() {
    this.statusCode = null;
    this.requestProcessing = true;
  }
  //Go back from update to create
  backToCreateArticle() {
    this.categoryIdToUpdate = null;
    this.editForm.reset();
    this.processValidation = false;
  }
  close() {
    this.router.navigate(['/cat-home']);
  }
  
}
