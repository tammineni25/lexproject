import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScriptsService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  createCategory(category: any): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.baseUrl}/category`, category,
      {
        headers: httpHeaders,
        observe: 'response'
      }
    ).pipe(
      map(res => res.status),
      catchError(this.handleError)
    );
  }
  getCategory(): Observable<any> {
    return this.http.get(`${this.baseUrl}/category`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCategorySaved(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categorysaved`)
      .pipe(
        catchError(this.handleError)
      );
  }
  getCategoryById(id: any): Observable<any> {
    console.log('id', `${this.baseUrl}/category/${id}`)
    return this.http.get(`${this.baseUrl}/category/${id}`)
      .pipe(
        catchError(this.handleError)
      );

  }

  updateCategory(category: any): Observable<any> {
    console.log('Inside upadte', category)
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put(`${this.baseUrl}/category/${category.id}`, category,
      {
        headers: httpHeaders,
        observe: 'response'
      }
    ).pipe(
      map(res => res.status),
      catchError(this.handleError)
    );
  }

  createDistCategory(category: any): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    console.log('category', JSON.stringify(category))
    return this.http.post(`${this.baseUrl}/categorysaved`, JSON.stringify(category),
      {
        headers: httpHeaders,
        observe: 'response'
      }
    ).pipe(
      map(res => res.status),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {

      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  };
}
