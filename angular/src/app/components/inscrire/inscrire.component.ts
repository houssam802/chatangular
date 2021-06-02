import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import * as $ from 'jquery';


@Component({
  selector: 'app-inscrire',
  templateUrl: './inscrire.component.html',
  styleUrls: ['./inscrire.component.css']
})
export class InscrireComponent implements OnInit, AfterViewInit {

  submitted = false;
  errors : any = {};
  userForm !: FormGroup;

  constructor(private formBuilder : FormBuilder,
    private httpClient : HttpClient, 
    private router : Router,
    private authenticationService : AuthenticationService) { }

  invalidNomUtili()
  {
  	return (this.submitted && (this.errors.nomutil != null || this.userForm.controls.nomutil.errors != null));
  }

  invalidEmail()
  {
  	return (this.submitted && (this.errors.email != null || this.userForm.controls.email.errors != null));
  }

  invalidPassword()
  {
  	return (this.submitted && this.userForm.controls.pword.errors != null);
  }

  invalidConfirmePassword()
  {
  	return (this.submitted && this.userForm.controls.cpword.errors != null);
  }

  ngOnInit()
  {
  	this.userForm = this.formBuilder.group({
  		nomutil: ['', Validators.required],
  		email: ['', [Validators.required, Validators.email]],
  		pword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32), Validators.pattern('([a-zA-Z0-9]*)')]],
      cpword: ['', [Validators.required]]
    }, {
      validator: (formGroup:FormGroup) => {
        const control = formGroup.controls["pword"];
        const matchingControl = formGroup.controls["cpword"];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
      }
    });
  }

  ngAfterViewInit(){
    var icon : any = document.querySelector('.img');
    icon.style.backgroundImage = "url('../../../assets/Images/profile.png')";
    var profile : any = document.getElementById("fileUp");
    profile.onchange = (e : any) => {
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
      icon.style.backgroundColor = 'transparent';
      icon.style.backgroundImage = `url(${reader.result})`;
      }
    }
  }

  onSubmit()
  {
  	this.submitted = true;

  	if(this.userForm.invalid == true)
  	{
  		return;
  	}
  	else
  	{
      var form = document.getElementsByTagName('form')[0];
      var formData = new FormData(form);
      this.envoiForm(formData, this);
      //form.submit();
        /*this.httpClient.post("/api/v1/user/inscrire", obj).subscribe((obs : any) => {
          this.errors = {};
          if(obs.message){
            Object.assign(this.errors, obs.message);
          } else {
            this.authenticationService.setToken(obs.toString());
            //this.router.navigate(["/chat"]);
          }
        })*/
  	}
  }

  /*onFileSelect(event : any){
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.userForm.patchValue({
        profile: file
      });
      this.userForm.get('profile')?.updateValueAndValidity();
    }
  }*/

  envoiForm(formData: FormData, inscrireComponent: any){
    $.ajax({
      url: "/api/v1/user/inscrire",
      type: 'POST',
      dataType: "JSON",
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
        inscrireComponent.errors = {};
        if(data.message){
          Object.assign(inscrireComponent.errors, data.message);
        } else {
          console.log(inscrireComponent.authenticationService);
          inscrireComponent.authenticationService.setToken(data);
          inscrireComponent.router.navigate(["/user"]);
        }
      },
      error: function(err){
        console.log(err);
      }
    });
  }

}
