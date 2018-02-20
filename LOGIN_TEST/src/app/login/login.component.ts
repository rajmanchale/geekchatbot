import { Http } from '@angular/http';
import { AlertComponent } from './../layout/bs-component/components/alert/alert.component';
import { PetService } from './../pet.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    constructor(public router: Router,private petService:PetService) {
    
    }

    pets=[]
    ngOnInit(){
    
     //this.petService.postpets().
     
    }

    
    onLoggedin(na,pa)
    {
        this.petService.postpets(na,pa).subscribe((res : Response)=>{
            alert(res);
            if(res.status)
            {
                console.log("successfully logged in");
               //this.petService.storeuserdata(res.token,na.value);
                this.router.navigate(['dashboard']);
            }
            else
            {
                console.log("something went wrong");
            }
            pa.value=na.value='';
        });
        //this.petService.postpets(na,pa)
        //this.petService.getpets().subscribe(responsePets => this.pets=responsePets);
    }
    
    
    

    /*onLoggedin(na,pa)
    {
        console.log(this.pets);
        var flag=0;
        for(var i=0;i<this.pets.length;i++){
            console.log(this.pets[i].user,this.pets[i].pass)
            if(na.value==this.pets[i].user && pa.value==this.pets[i].pass)
            {
                this.router.navigate(['dashboard']);
                 flag=1;
                 alert(flag);
            }
        }
         if(!flag){
        document.getElementById('high').innerHTML="permision denied";
        alert(pa.value);
        alert(na.value);
        pa.value=na.value='';
         }
    }*/
}
    


