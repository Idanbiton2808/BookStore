import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  isModalHiddenSub: Subscription = new Subscription();
  isModalHidden: boolean = true;

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
    this.isModalHiddenSub = this.modalService.isModalHidden.subscribe({next:(val)=>{
      this.isModalHidden = val
      }, error:(err)=>{
      console.log(err)
    }});
    this.modalService.isModalHidden.next(true);
  }

   closeModal(event?:Event) {
     this.modalService.closeModal(event || undefined);
  }

}
