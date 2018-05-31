import * as requester from 'request';

const BeeQueue = require('bee-queue');

export module SongWorker {
    const worker = new BeeQueue("SongWorker");

    export function initWorker(): void {
        worker.process(10, (job: any, done: any) => {
            console.log(`[${job.id}] Processing download on ${job.data.videoId}`); 
            console.log('Requesting http://localhost:3000/song/ytdl?q=' + job.data.keyword + '&origin=spotify');
            requester("http://localhost:3000/song/ytdl?q=" + job.data.keyword + "&origin=spotify", {
                json: true
            }, (err: any, response: any, body: any) => {
                if (err || body.type == 'error') {
                    return done("Error on job n°" + job.id, null);
                }

                return done(null, job.data);
            });
        });
    }

    export function enQueue(data : { keyword: string, videoId: string}): void {
        const job = worker.createJob(data).save();
        // On Process ...
    }
}