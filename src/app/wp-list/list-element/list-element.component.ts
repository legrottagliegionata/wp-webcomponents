import {Component, Input, OnInit} from '@angular/core';
import {WpPost, Rendered} from '../model';

@Component({
  selector: 'sps-list-element',
  template: `
    <div class="sps-list-element-container">
      <div class="sps-list-element-img">
        <img src="{{post.featured_media_url}}" >
      </div>
      <div class="sps-list-element-title">
        <a href="{{post.link}}">{{post?.title?.rendered}}</a>
      </div>
    </div>

  `,
  styleUrls: ['./list-element.component.scss']
})
export class ListElementComponent implements OnInit {

  constructor() {
  }

  @Input() post: WpPost;


  ngOnInit() {
  }

}
