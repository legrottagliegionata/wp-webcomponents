import {Component, OnInit, ViewEncapsulation, Input, OnChanges, SimpleChanges} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, concat, merge, Observable, pipe} from 'rxjs';
import {
  debounceTime,
  defaultIfEmpty,
  distinctUntilChanged,
  finalize,
  map,
  startWith,
  switchMap,
  take,
  tap,
  withLatestFrom
} from 'rxjs/operators';

import {FormControl, Validators, ValidatorFn, NG_VALUE_ACCESSOR} from '@angular/forms';
import {WpPost} from './model';
import {toNumbers} from '@angular/compiler-cli/src/diagnostics/typescript_version';
import {isNumber} from 'util';

@Component({
  selector: 'sps-wp-list',
  templateUrl: './wp-list.component.html',
  styleUrls: ['./wp-list.component.scss'],
})
export class WpListComponent implements OnInit {

  constructor(private http: HttpClient) {
  }

  posts$: Observable<Array<WpPost>>;
  isLoading = true;
  /**
   * Dominio da cui caricare la lista
   */
  @Input() wpDomain: string;
  @Input() findLabel: string;
  @Input() perPage: number;
  @Input() postType: string;

  filter = new FormControl();
  totalItem: number;
  totalPages: number;
  actualPage$ = new BehaviorSubject<number>(1);

  ngOnInit() {
    this.totalItem = 0;
    this.totalPages = 1;
    this.initializeFetch();
  } // ngOnInit

  /**
   * Recupera i post utilizzando le restApi di wordpress
   *
   * @param postPerPage Numero di post da visualizzare per pagina (nei limiti di Wp)
   * @param pageNumber Numero di pagina da visualizzare (Nei limiti di Wp)
   * @param keyword Parola chiave per il filtro
   */
  private getPostPerPage$(postPerPage: number, pageNumber: number, keyword?: string): Observable<any | WpPost> {
    let params = 'order=asc&orderby=title';
    params += '&page=' + pageNumber;
    if (postPerPage) {
      params += '&per_page=' + postPerPage;
    }
    if (keyword && keyword.length) {
      params += '&search=' + keyword;
    }
    if (this.postType && this.postType.length) {
      params += '&type=' + this.postType;
    }
    return this.http.get('http://' + this.wpDomain + '/wp-json/wp/v2/' + (this.postType || 'posts') + '/?_embed&_fields=author,id,type,excerpt,title,link,featured_media,featured_media_url&' + params, {observe: 'response'});
  }

  /**
   * Inizializzazione degli observer che effettuano la ricerca
   */
  private initializeFetch() {
    if (this.wpDomain && this.wpDomain.length) {
      this.posts$ = merge(
        // pipe
        this.actualPage$.pipe(
          tap(() => {
            this.isLoading = true;
          }), // tap
          debounceTime(100),
          withLatestFrom(this.filter.valueChanges.pipe(startWith(undefined))),
          switchMap(([page, keyword]) => this.callGetPosts(keyword, page))
        ), // pipe
        this.filter.valueChanges.pipe(
          tap(() => {
            this.isLoading = true;
          }), // tap
          debounceTime(300),
          switchMap(keyword => this.callGetPosts(keyword, 1)
          )// switchMap
        )// pipe
      );
      // concat

    } // if

    this.actualPage$.subscribe();
  }

  private callGetPosts(keyword, page) {
    return this.getPostPerPage$(this.perPage || 10, page, keyword)
      .pipe(
        finalize(() => {
            this.isLoading = false;
          }
        ), // finalize
        map((res: HttpResponse<any>) => {
          this.totalItem = isNumber(Number.parseInt(res.headers.get('X-WP-Total'), 10)) ? Number.parseInt(res.headers.get('X-WP-Total'), 10) : 0;
          this.totalPages = isNumber(Number.parseInt(res.headers.get('X-WP-TotalPages'), 10)) ? Number.parseInt(res.headers.get('X-WP-TotalPages'), 10) : 0;
          return res.body;
        })
      ); // pipe
  }

  /**
   * Cambio alla prossima pagina
   * @param actualPage Pagina attuale
   */
  nextPage() {
    if (this.actualPage$.getValue() < this.totalPages) {
      this.actualPage$.next(this.actualPage$.getValue() + 1);
    }
  }

  /**
   * Cambio alla pagina precedente
   * @param actualPage Pagina attuale
   */
  prevPage() {
    if (this.actualPage$.getValue() > 0) {
      this.actualPage$.next(this.actualPage$.getValue() - 1);
    }
  }

}
