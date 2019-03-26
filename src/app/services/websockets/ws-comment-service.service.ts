import { Injectable } from '@angular/core';
import { Comment } from '../../models/comment';
import { RxStompService } from '@stomp/ng2-stompjs';
import { CreateComment } from '../../models/messages/create-comment';
import { PatchComment } from '../../models/messages/patch-comment';
import { TSMap } from 'typescript-map';
import { UpVote } from '../../models/messages/up-vote';
import { DownVote } from '../../models/messages/down-vote';


@Injectable({
  providedIn: 'root'
})
export class WsCommentServiceService {

  constructor(private rxStompService: RxStompService) { }

  add(comment: Comment): void {
    const message = new CreateComment(comment.roomId, comment.userId, comment.body);
    this.rxStompService.publish({
      destination: `/queue/comment.command.create`,
      body: JSON.stringify(message),
      headers: {
        'content-type': 'application/json'
      }
    });
  }

  toggleRead(comment: Comment): Comment {
    console.log(comment);
    comment.read = !comment.read;
    const changes = new TSMap<string, any>();
    changes.set('read', comment.read);
    this.patchComment(comment, changes);
    return comment;
  }

  toggleFavorite(comment: Comment): Comment {
    comment.favorite = !comment.favorite;
    const changes = new TSMap<string, any>();
    changes.set('favorite', comment.favorite);
    this.patchComment(comment, changes);
    return comment;
  }

  toggleCorrect(comment: Comment): Comment {
    comment.correct = !comment.correct;
    const changes = new TSMap<string, any>();
    changes.set('correct', comment.correct);
    this.patchComment(comment, changes);
    return comment;
  }

  voteUp(comment: Comment): void {
    const message = new UpVote(comment.userId, comment.id);
    this.rxStompService.publish({
      destination: `/queue/vote.command.upvote`,
      body: JSON.stringify(message),
      headers: {
        'content-type': 'application/json'
      }
    });
  }

  voteDown(comment: Comment): void {
    const message = new DownVote(comment.userId, comment.id);
    this.rxStompService.publish({
      destination: `/queue/vote.command.downvote`,
      body: JSON.stringify(message),
      headers: {
        'content-type': 'application/json'
      }
    });
  }

  private patchComment(comment: Comment, changes: TSMap<string, any>): void {
    const message = new PatchComment(comment.id, changes);
      this.rxStompService.publish({
        destination: `/queue/comment.command.patch`,
        body: JSON.stringify(message),
        headers: {
          'content-type': 'application/json'
        }
      });
  }
}
