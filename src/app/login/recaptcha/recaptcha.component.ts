import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { AuthenticationService } from "src/app/services/backend.service.index";
import { EnviromentService } from "src/app/@core/services/enviroment.service";
@Component({
  selector: 'app-recaptcha',
  templateUrl: './recaptcha.component.html',
})
export class RecaptchaComponent implements OnInit {
  protected aFormGroup: FormGroup;
  public requestValidateCaptcha$: Observable<any> = this.authenticationService.requestValidateCaptcha$;
  public siteKey: string = "";

  constructor(
    private formBuilder: FormBuilder,
    public authenticationService: AuthenticationService,
    private _EnviromentService: EnviromentService
  ) { }

  ngOnInit() {
    this.siteKey = this._EnviromentService.siteKey;
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });
  }

  handleSuccess(resultToken) {
    this.authenticationService.ValidateCaptcha(resultToken)
      .subscribe(response => {
        this.requestValidateCaptcha$ = response["data"]
        this.authenticationService.requestValidateCaptcha$ = this.requestValidateCaptcha$;
      }
      )
  }
}





