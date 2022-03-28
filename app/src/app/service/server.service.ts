import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscriber, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators'
import { Status } from '../enum/status.enum';
import { customeResponse } from '../interface/custom-response';
import { Server } from '../interface/server';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private readonly apiUrl = 'http://localhost:8080';


  constructor(private http: HttpClient) { }

  servers$ = <Observable<customeResponse>>
    this.http.get<customeResponse>(`${this.apiUrl}/server/list`)
      .pipe(
        tap(console.log),
        catchError(this.handleErrors)
      );

  save$ = (server: Server) => <Observable<customeResponse>>
    this.http.post<customeResponse>(`${this.apiUrl}/server/save/`, server)
      .pipe(
        tap(console.log),
        catchError(this.handleErrors)
      );

  ping$ = (ipAddress: string) => <Observable<customeResponse>>
    this.http.get<customeResponse>(`${this.apiUrl}/server/ping/${ipAddress}`)
      .pipe(
        tap(console.log),
        catchError(this.handleErrors)
      );

  delete$ = (serverId: number) => <Observable<customeResponse>>
    this.http.delete<customeResponse>(`${this.apiUrl}/server/delete/${serverId}`)
      .pipe(
        tap(console.log),
        catchError(this.handleErrors)
      );

  filter$ = (status: Status, response: customeResponse) => <Observable<customeResponse>>
    new Observable<customeResponse>(
      suscriber => {
        console.log(response);
        suscriber.next(
          status === Status.ALL ? { ...response, message: `Servers filtered by ${status}` } :
            {
              ...response, message: response.data.servers.filter(server => server.status === status).length > 0 ?
                `Servers filtered by ${status === Status.SERVER_UP ? `SERVER UP` : `SERVER DOWN`}` : `No servers of 
          ${status} found`,
              data: { servers: response.data.servers.filter(server => server.status === status) }
            }
        );
        suscriber.complete();
      }
    ).pipe(
      tap(console.log),
      catchError(this.handleErrors)
    );

  private handleErrors(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    // return throwError(`an error occurred - Error code: ${error.status}`);
    return throwError(() => new Error(`an error occurred - Error code: ${error.status}`));
  }

}
