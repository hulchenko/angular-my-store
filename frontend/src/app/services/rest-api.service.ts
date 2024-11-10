import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, of, tap } from "rxjs";
import { ServerResponse } from "../common/interfaces/server-response.interface";

@Injectable({
  providedIn: "root",
})
export class RestApiService {
  http = inject(HttpClient);

  fetchData(url: string): Observable<ServerResponse> {
    return this.http.get(url).pipe(
      tap((data) => console.log("Get data: ", data)),
      catchError((err) => {
        console.error("Error in fetchData", err);
        return of(err);
      })
    );
  }

  deleteData(url: string): Observable<ServerResponse> {
    return this.http.delete(url).pipe(
      tap((data) => console.log("Delete data: ", data)),
      catchError((err) => {
        console.error("Error in deleteData", err);
        return of(err);
      })
    );
  }

  addData(url: string, body: object): Observable<ServerResponse> {
    return this.http.post(url, body).pipe(
      tap((data) => console.log("Create data: ", data)),
      catchError((err) => {
        console.error("Error in addData", err);
        return of(err);
      })
    );
  }
}