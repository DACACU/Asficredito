import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientService } from '../../services/client/client.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  formAutenticacion = new FormGroup({
    userName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')
  })

  constructor(
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.cargarForm();
  }

  cargarForm() {
    this.formAutenticacion = new FormGroup({
      userName: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl('')
    })
  }

  registrar() {
    const array = ({
      UserName: this.formAutenticacion.value.userName,
      Email: this.formAutenticacion.value.email,
      Password: this.formAutenticacion.value.password
    })
    this.clientService.InsertClient(array).subscribe(res => {
      this.router.navigate(["/"]);
    }, err => {
      alert("*** ERROR *** \n The email or password or username is empty ");
    })
  }

}
