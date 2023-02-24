import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client/client.service';
import { Observable } from 'rxjs/internal/Observable';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TaskService } from 'src/app/services/task/task.service';
import * as moment from 'moment';

export interface DialogData {
  owner: string;
  task: string;
  description: string;
  comment: string;
  date: Date;
  time: string;
  id: string;
}

var taskOpt: string[] = [];
var descOpt: string[] = [];

const TEST_DATA: any[] = [
  [[{ owner: 'Santiago gialdo', task: 'credivalroes', description: 'Revisión defectos', comment: '', date: new Date(), time: '01:00:00' },
  { owner: 'Santiago gialdo', task: 'credivalroes', description: 'Revisión defectos', comment: '', date: new Date(), time: '02:00:00' }], new Date()],
  [[{ owner: 'Santiago gialdo', task: 'credivalroes', description: 'Revisión defectos', comment: '', date: new Date(), time: '03:00:00' },
  { owner: 'Santiago gialdo', task: 'credivalroes', description: 'Revisión defectos', comment: '', date: new Date(), time: '04:00:00' }], new Date("2019-01-16")]
];

var Data: any[] = [];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  displayedColumns: string[] = ['date', 'task', 'description', 'time', 'actions'];

  formNewTask!: FormGroup;
  newTask!: string;
  newDescription!: string;
  newComment!: string;
  newDate!: Date;
  newTime!: string;

  taskOptions: string[] = [];
  filteredTaskOptions!: Observable<string[]>;

  descriptionOptions: string[] = [];
  filteredDescriptionOptions!: Observable<string[]>;

  clientes: any;
  dataSource = TEST_DATA;
  autores = new Set<string>();
  autoresData: object = {};

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private clienteService: ClientService,
    public dialog: MatDialog,
  ) {
    this.loadTasks();
  }

  ngOnInit() {
    this.formNewTask = this.formBuilder.group({
      task: [this.newTask, Validators.required],
      description: [this.newDescription, Validators.required],
      comment: [this.newComment],
      date: [this.newDate, Validators.required],
      time: [this.newTime, Validators.required],
    });

    this.filteredTaskOptions = this.formNewTask.controls.task.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', this.taskOptions)),
    );

    this.filteredDescriptionOptions = this.formNewTask.controls.description.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', this.descriptionOptions)),
    );
  }

  loadTasks() {
    Data = [];
    this.taskService.getAllTask().subscribe(async res => {
      var tareas: any = res
      for (let index = 0; index < tareas.length; index++) {
        this.autores.add(tareas[index]["owner"])
        if (index == 0) {
          tareas[index]["task"] = tareas[index]["taskName"]
          Data.push([[tareas[index]], tareas[index]["date"]])
        } else {
          for (let j = 0; j < Data.length; j++) {
            const datos = Data[j];
            if (datos[1] == tareas[index]["date"]) {
              tareas[index]["task"] = tareas[index]["taskName"]
              datos[0].push(tareas[index]);
              break
            } else {
              tareas[index]["task"] = tareas[index]["taskName"]
              Data.push([[tareas[index]], tareas[index]["date"]])
              break
            }
          }
        }
      }
      this.dataSource = Data;
      this.loadOwner();

    })
  }

  loadOwner() {
    this.autores.forEach(async autor => {
      await this.clienteService.getClienteById(autor).subscribe(res => {
        this.autoresData[autor] = res;
        for (let index = 0; index < this.dataSource.length; index++) {
          const data = this.dataSource[index];
          for (let j = 0; j < data[0].length; j++) {
            const tarea = data[0][j];
            tarea["owner"] = this.autoresData[tarea["owner"]]["userName"]
          }
        }
      });
    });
  }

  addTask() {
    let task = {
      owner: localStorage.getItem("userID"),
      taskName: this.formNewTask.get('task').value,
      description: this.formNewTask.get('description').value,
      comment: this.formNewTask.get('comment').value == null ? "" : this.formNewTask.get('comment').value,
      date: new Date(this.formNewTask.get('date').value),
      time: this.formNewTask.get('time').value + ":00"
    }

    this.taskService.newTask(task).subscribe(res => {
      console.log(res);
    }, err => {
      alert("*** Error *** \n something has gone wrong");
    })
  }

  deleteTask(task) {
    this.taskService.DeleteTask(task.id).subscribe(res => {
      alert("Task successfully eliminated");
      this.loadTasks();
    }, err => {
      alert("something wrong has happened");
    })
  }

  openTaskDialog(task): void {
    if (task != null) {
      task.date = moment(task.date).format('yyyy-MM-DD')
      const dialogRef = this.dialog.open(TaskComponentDialog, {
        width: 'inherit',
        data: task,
      });

      dialogRef.afterClosed().subscribe(result => {
        this.loadTasks();
      });
    } else {
      const dialogRef = this.dialog.open(TaskComponentDialog, {
        width: 'inherit',
      });

      dialogRef.afterClosed().subscribe(result => {
        this.loadTasks();
      });
    }

  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }
}


@Component({
  selector: 'task-component-dialog',
  templateUrl: 'task-component-dialog.html',
})
export class TaskComponentDialog {
  formNewTask!: FormGroup;
  newTask!: string;
  newDescription!: string;
  newComment!: string;
  newDate!: Date;
  newTime!: string;
  id!: string;
  isNewTask: boolean = true;

  taskOptions: string[] = [];
  filteredTaskOptions!: Observable<string[]>;

  descriptionOptions: string[] = [];
  filteredDescriptionOptions!: Observable<string[]>;

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    public dialogRef: MatDialogRef<TaskComponentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    if (this.data) {
      this.newTask = this.data.task;
      this.newDescription = this.data.description;
      this.newComment = this.data.comment;
      this.newDate = this.data.date;
      this.newTime = this.data.time;
      this.id = this.data.id;
      this.isNewTask = false;
    }

    this.taskOptions = taskOpt;
    this.descriptionOptions = descOpt;

    this.formNewTask = this.formBuilder.group({
      task: [this.newTask, Validators.required],
      description: [this.newDescription, Validators.required],
      comment: [this.newComment,],
      date: [this.newDate, Validators.required],
      time: [this.newTime, Validators.required],
    });

    this.filteredTaskOptions = this.formNewTask.controls.task.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', this.taskOptions)),
    );

    this.filteredDescriptionOptions = this.formNewTask.controls.description.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', this.descriptionOptions)),
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addTask() {
    debugger
    let time: string = this.formNewTask.get('time').value
    if (time.length >= 8) {
      time = this.formNewTask.get('time').value.slice(0, 8);
    } else {
      time = this.formNewTask.get('time').value + ":00"
    }
    let task = {
      owner: localStorage.getItem("userID"),
      taskName: this.formNewTask.get('task').value,
      description: this.formNewTask.get('description').value,
      comment: this.formNewTask.get('comment').value == null ? "" : this.formNewTask.get('comment').value,
      date: new Date(this.formNewTask.get('date').value),
      time: time
    }

    if (this.isNewTask) {
      this.taskService.newTask(task).subscribe(res => {
        alert("Task successfully registered");
        this.onNoClick();
      }, err => {
        alert("something wrong has happened");
      })
    } else {
      this.taskService.UpdateTask(task, this.id).subscribe(res => {
        alert("Task successfully updated");
        this.onNoClick();
      }, err => {
        alert("something wrong has happened");
      })
    }
  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }
}