import { Injectable } from '@angular/core';
import { Restaurant } from '../models/restaurant';
import { Menu } from '../models/menu';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private restaurantsUrl = 'http://localhost:5000/restaurants'; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  private log(message: string) {
    this.messageService.add(`RestaurantService: ${message}`);
  }

  /** GET restaurants. Will 404 if id not found */
  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(this.restaurantsUrl).pipe(
      tap((_) => this.log('fetched restaurants')),
      catchError(this.handleError<Restaurant[]>('getRestaurants', []))
    );
  }

  /** GET restaurant by id. Will 404 if id not found */
  getRestaurant(id: string): Observable<Restaurant> {
    const url = `${this.restaurantsUrl}/${id}`;
    console.log(url);
    return this.http.get<Restaurant>(url).pipe(
      tap((_) => this.log(`fetched restaurant id=${id}`)),
      catchError(this.handleError<Restaurant>(`getRestaurant id=${id}`))
    );
  }

  addRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    const url = `${this.restaurantsUrl}/add`;
    //console.log(restaurant);
    return this.http
      .post<Restaurant>(url, restaurant, this.httpOptions)
      .pipe(catchError(this.handleError('addRestaurant', restaurant)));
  }

  addMenu(menu: Menu, id: string): Observable<Menu> {
    const url = `${this.restaurantsUrl}/menus/add/${id}`;
    //console.log(menu);
    return this.http
      .put<Menu>(url, JSON.stringify(menu), this.httpOptions)
      .pipe(
        tap((_) => this.log(`Added menu id=${menu.name} to restaurant:${id}`)),
        catchError(this.handleError('addMenu', menu))
      );
  }

  updateMenu(menu: Menu, id: string): Observable<Menu> {
    const url = `${this.restaurantsUrl}/menus/update/${id}`;
    return this.http
      .post<Menu>(url, JSON.stringify(menu), this.httpOptions)
      .pipe(
        tap((_) =>
          this.log(`Updated menu id=${menu.name} to restaurant:${id}`)
        ),
        catchError(this.handleError('updateMenu', menu))
      );
  }

  deleteMenu(menu: Menu, restaurantId: string): Observable<unknown> {
    const url = `${this.restaurantsUrl}/menus/delete/${restaurantId}`;
    return this.http.post(url, JSON.stringify(menu), this.httpOptions).pipe(
      tap((_) => this.log(`Deleted menu id=${menu._id}`)),
      catchError(this.handleError('deletedRestaurant'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
