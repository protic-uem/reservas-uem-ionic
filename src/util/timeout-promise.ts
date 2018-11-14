import { Injectable } from '@angular/core';



@Injectable()
export class TimeoutPromise {

  promiseTimeout(ms, promise){
      console.log("Entrou promiseTimeout");
      let timeout = new Promise((resolve, reject) => {
         let id = setTimeout(() => {
           clearTimeout(id);
          reject('Tempo de requisição esgotado');
        }, ms)
        });

      // Returns a race between our timeout and the passed in promise
      return Promise.race([
        promise,
        timeout
      ]);
  }

}
