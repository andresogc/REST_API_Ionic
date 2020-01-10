import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task } from '../interfaces/task';
import { AlertController, ToastController, LoadingController } from "@ionic/angular";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  tasks:Task[]=[];
  

  constructor(private taskService:TaskService,
              private alertCtrl:AlertController,
              private toastCtrl:ToastController,
              private loadingCtrl:LoadingController
    ) {}

    async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando..',
    });
    await loading.present();
    this.taskService.getAllTasks()
    .subscribe(async (tasks) => {
      console.log(tasks);
      this.tasks = tasks;
      await loading.dismiss();
    });
    
  }
  
  async openAlert(){
    const alert = await this.alertCtrl.create({
      header: 'Nueva tarea!',
      inputs:[
        {
          name:'title',
          type: 'text',
          placeholder:'Aqui la tarea'
        },
      ],
      buttons:[
        {
          text:'cancelar',
          role:'cancel',
          cssClass:'secondary',
          handler: () =>{
            console.log('confirm cancel')
          }
        },
        {
          text:'crear',
          handler: (data) =>{
            this.createTask(data.title);
          }
        }
      ]

    });

    await alert.present();
  }
  
  createTask(title:string){
    const task ={
      userId:'1',
      title,
      completed:true
    };
    this.taskService.createTask(task)
    .subscribe((newTask) => {
      this.tasks.unshift(newTask);
    });
  }

  deleteTask(id:string, i:number){
    console.log(i);
    this.taskService.deleteTask(id)
    .subscribe(() => {
      this.tasks.splice(i, 1);
      this.presentToast('Su tarea fue eliminada correctamente');
    });
  }

  async presentToast(message:string) {
    const toast = await this.toastCtrl.create({
      message, 
      duration: 2000
    });
    await toast.present();
  }

 /*  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando..',
      duration: 2000
    });
    await loading.present();

    return loading;
  } */
}
