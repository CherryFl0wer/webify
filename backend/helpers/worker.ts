import * as requester from 'request';

const BeeQueue = require('bee-queue');

export module SongWorker {

    const worker = new BeeQueue("SongWorker");

    export function initWorker(): void {
        worker.process(10, (job: any, done: any) => {

            requester("http://localhost:3000/song/ytdl?q=" + job.data.keyword + "&origin=spotify", {
                json: true,
                method: "POST",
                body: {
                    name: job.data.name,
                    artists: job.data.artists,
                    forId: job.data.forId
                }
            }, (err: any, response: any, body: any) => {


                if (err || body.type == 'error') {
                    console.log(err, body);
                    return done("Error on job n°" + job.id, null);
                }

                return done(null, job.data);
            });
        });
    }

    export function enQueue(data: any): void {
        worker.createJob(data).save();
    }
}