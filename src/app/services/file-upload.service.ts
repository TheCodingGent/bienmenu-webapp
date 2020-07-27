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

  constructor(private http: HttpClient) {}

  postFile(file: File, id: string, name?: string): Observable<any> {
    const url = `${this.fileServerUrl}/upload/${id}`;
    const filename = name ? name + '.pdf' : file.name;
    const formData: FormData = new FormData();
    formData.append('MenuFile', file, filename);
    return this.http.post(url, formData, { responseType: 'text' }).pipe(
      map(() => {
        return 'File uploaded successfully!';
      })
    );
  }
}
