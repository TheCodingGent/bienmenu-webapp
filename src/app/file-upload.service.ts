import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private fileServerUrl = 'http://localhost:5000/menu/pdf'; // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  private log(message: string) {
    this.messageService.add(`RestaurantService: ${message}`);
  }

  postFile(file: File, id: string, name?: string): Observable<boolean> {
    const url = `${this.fileServerUrl}/upload/${id}`;
    const filename = name ? name + '.pdf' : file.name;
    const formData: FormData = new FormData();
    formData.append('fileKey', file, filename);
    return this.http.post(url, formData).pipe(
      map(() => {
        return true;
      })
      // catchError(this.handleError('uploadFile', file.name))
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
