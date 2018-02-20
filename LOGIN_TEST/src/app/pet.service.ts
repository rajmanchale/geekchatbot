import { Injectable } from '@angular/core';
import {Http,Response,Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PetService {
  authToken :any;
  user :any;
  constructor(private http:Http) { 

  }


  private url:string ="http://localhost:4000/login";
  /*getpets()
  {
    return this.http.get(this.url).map((response :Response)=>response.json());
  }*/
  postpets(na,pa)
  {
	
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let post={ name: na.value, password:pa.value};
    console.log(na.value);
	alert(na.value);
      // return this.http.post(this.url,post,{headers:headers}).subscribe(response=>{
      //   console.log(response.json());
      // });
    return this.http.post(this.url,post,{headers:headers}).map(res=>res.json());
  }
  storeuserdata(token,user)
  {
      localStorage.setItem('id_token',token);
      localStorage.setItem('user',user);
      this.authToken=token;
      this.user=user;
  }
}
