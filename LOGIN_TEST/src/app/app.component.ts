import { PetService } from './pet.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule,Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title='Angular app';
    constructor(private petService:PetService) {

    }
    //pets=[]
    ngOnInit(){
     //this.petService .getpets().subscribe(responsePets => this.pets=responsePets);
    }
        
        
}
    

