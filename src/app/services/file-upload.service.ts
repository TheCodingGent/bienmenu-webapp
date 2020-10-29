import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private fileServerUrl: string; // URL to web api

  constructor(private http: HttpClient, private appConfig: AppConfigService) {
    this.fileServerUrl = appConfig.apiBaseUrl;
  }

  postFile(file: File, id: string, name?: string): Observable<any> {
    const url = `${this.fileServerUrl}menu/pdf/upload/${id}`;
    const filename = name ? name + '.pdf' : file.name;
    const formData: FormData = new FormData();
    formData.append('MenuFile', file, filename);
    return this.http.post(url, formData, { responseType: 'text' }).pipe(
      map(() => {
        return 'File uploaded successfully!';
      })
    );
  }

  uploadImage(
    path: string,
    id: string,
    image: File,
    name?: string
  ): Observable<any> {
    const url = `${this.fileServerUrl}image/upload/${path}/${id}`;
    const filename = name
      ? name + '.' + image.name.split('.').pop()
      : image.name;
    const formData = new FormData();
    formData.append('image', image, filename);
    return this.http.post(url, formData);
  }
}
