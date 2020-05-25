import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/providers/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  message: string = "";
  element: any;

  constructor(public chatService: ChatService) { 
    this.chatService.loadMessages().subscribe(()=> {
      setTimeout(()=> {
        this.element.scrollTop = this.element.scrollHeight;
      },20);
    });
  }

  ngOnInit() {

    this.element = document.getElementById('app-messages');

  }

  send_message() {

   if(this.message.length == 0) {
     return;
   }   
   
   this.chatService.addMessages(this.message)
        .then( () => this.message= '')
        .catch((err)=> console.log("Sent error", err));
  }

}
