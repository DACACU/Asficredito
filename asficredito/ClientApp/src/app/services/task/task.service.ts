import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  public url = window.location.hostname;
  public port = "7106";

  public getAllTask() {
    return this.http.get('https://' + this.url + ":" + this.port + "/api/task");
  }

  public getTaskDate(startDate: string, finalDate: string) {
    return this.http.get('https://' + this.url + ":" + this.port + "/api/task/" + startDate + "/" + finalDate);
  }

  public newTask(task: any) {
    return this.http.post('https://' + this.url + ":" + this.port + "/api/task", task);
  }

  public UpdateTask(array: any, id: string) {
    return this.http.put('https://' + this.url + ":" + this.port + "/api/task/" + id, array);
  }

  public DeleteTask(id: string) {
    return this.http.delete('https://' + this.url + ":" + this.port + "/api/task/" + id);
  }

}
