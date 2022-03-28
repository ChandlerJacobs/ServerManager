import { Component, OnInit } from '@angular/core';
import { catchError, map, startWith } from 'rxjs';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { dataState } from './enum/data-state';
import {BehaviorSubject} from 'rxjs';
import { Status } from './enum/status.enum';
import { AppState } from './interface/app-state';
import { customeResponse } from './interface/custom-response';
import { Server } from './interface/server';
import { ServerService } from './service/server.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  appState$: Observable<AppState<customeResponse>>;
  readonly DataState = dataState;
  readonly Status = Status;
  private filterSubject = new BehaviorSubject<string>('');
  private dataSubject = new BehaviorSubject<customeResponse>(null);
  filterStatus$ = this.filterSubject.asObservable();
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  constructor(private serverService: ServerService, private notifier: NotificationService) { }

  ngOnInit(): void {
    this.appState$ = this.serverService.servers$
      .pipe(
        map(response => {
          this.notifier.onDefault(response.message);
          this.dataSubject.next(response);
          return { dataState: dataState.LOADED, appData: { ...response, data: { servers: response.data.servers.reverse() } } }
        }),
        startWith({ dataState: dataState.LOADING }),
        catchError((error: string) => {
          this.notifier.onError(error);
          return of({ dataState: dataState.ERROR, error });
        })
      );
  }

  pingServer(ipAddress: string): void {
    this.filterSubject.next(ipAddress);
    this.appState$ = this.serverService.ping$(ipAddress)
      .pipe(
        map(response => {
          const index = this.dataSubject.value.data.servers.findIndex(server =>  server.id === response.data.server.id);
          this.dataSubject.value.data.servers[index] = response.data.server;
          this.notifier.onDefault(response.message);
          this.filterSubject.next('');
          return { dataState: dataState.LOADED, appData: this.dataSubject.value }
        }),
        startWith({ dataState: dataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.filterSubject.next('');
          this.notifier.onError(error);
          return of({ dataState: dataState.ERROR, error });
        })
      );
  }

  saveServer(serverForm: NgForm): void {
    this.isLoading.next(true);
    this.appState$ = this.serverService.save$(serverForm.value as Server)
      .pipe(
        map(response => {
          this.dataSubject.next(
            {...response, data: { servers: [response.data.server, ...this.dataSubject.value.data.servers] } }
          );
          this.notifier.onDefault(response.message);
          document.getElementById('closeModal').click();
          this.isLoading.next(false);
          serverForm.resetForm({ status: this.Status.SERVER_DOWN });
          return { dataState: dataState.LOADED, appData: this.dataSubject.value }
        }),
        startWith({ dataState: dataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoading.next(false);
          this.notifier.onError(error);
          return of({ dataState: dataState.ERROR, error });
        })
      );
}

  filterServers(status: Status): void {
    this.appState$ = this.serverService.filter$(status, this.dataSubject.value)
      .pipe(
        map(response => {
          this.notifier.onDefault(response.message);
          return { dataState: dataState.LOADED, appData: response };
        }),
        startWith({ dataState: dataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.notifier.onError(error);
          return of({ dataState: dataState.ERROR, error });
        })
      );
  }

  deleteServer(server: Server): void {
    this.appState$ = this.serverService.delete$(server.id)
      .pipe(
        map(response => {
          this.dataSubject.next(
            { ...response, data: 
              { servers: this.dataSubject.value.data.servers.filter(s => s.id !== server.id)} }
          );
          this.notifier.onDefault(response.message);
          return { dataState: dataState.LOADED, appData: this.dataSubject.value }
        }),
        startWith({ dataState: dataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.notifier.onError(error);
          return of({ dataState: dataState.ERROR, error });
        })
      );
  }

  printReport(): void {
    this.notifier.onDefault('Report downloaded');
    // window.print();
    let dataType = 'application/vnd.ms-excel.sheet.macroEnabled.12';
    let tableSelect = document.getElementById('servers');
    let tableHtml = tableSelect.outerHTML.replace(/ /g, '%20');
    let downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = 'data:' + dataType + ', ' + tableHtml;
    downloadLink.download = 'server-report.xls';
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

}
