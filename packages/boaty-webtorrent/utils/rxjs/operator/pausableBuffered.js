import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/buffer'
import 'rxjs/add/operator/concatAll'

function pausableBuffered(pauser$) {
  return Observable.create(subscriber$ => {
    var source$ = this
    var buffer$ = new Subject()
    var flusher$ = new Subject()

    var paused = false

    // every flusher$ ping, send bufferized data to subscriber$
    buffer$
      .buffer(flusher$)
      .concatAll()
      .subscribe(v => subscriber$.next(v))

    pauser$.subscribe(to => {
      paused = to

      if (!paused) {
        // flush buffer$ when RESUME
        flusher$.next(true)
      }
    })

    source$.subscribe(
      // if paused, send data to buffer$ waiting to be flushed, else send data directly to subscriber$
      v => paused ? buffer$.next(v) : subscriber$.next(v),
      e => subscriber$.error(e),
      () => {
        // flush buffer$ when source$ is completed
        flusher$.next(true)
        subscriber$.complete()
      }
    )
  })
}

Observable.prototype.pausableBuffered = pausableBuffered
