import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';
import { JsonResult } from 'src/app/@core/models/jsonresult.model';

@Injectable({
    providedIn: 'root'
})
export class FileOvService {
    urlBase = "";
    constructor(public _enviromentService: EnviromentService, public http: HttpClient) {
        this.urlBase = `${this._enviromentService.urlBaseServicios}/fileOv`;
    }
    uploadOv(endpoint, tokenParam, entity: FormData): Observable<JsonResult<any>> {
        //const url = `${this.urlBase}/Upload`;

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${tokenParam}`
        });

        const url = `${endpoint}`;
        return this.http.post<JsonResult<any>>(url, entity, { headers });
    }


    getEndpointMasive(): Observable<JsonResult<any>> {
        const url = `${this.urlBase}/get-endpoint-masive`;
        return this.http.post<JsonResult<any>>(url, null);

    }

}