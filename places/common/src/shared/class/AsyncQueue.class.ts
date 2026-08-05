/**
 * Runs enqueued async tasks strictly one after another (FIFO), regardless of
 * how quickly they're enqueued. A failing task does not block the ones queued after it.
 */
export class AsyncQueue {
    private tail: Promise<unknown> = Promise.resolve();

    public enqueue<T>(task: () => Promise<T>): Promise<T> {
        const result = this.tail.then(() => task(), () => task());
        this.tail = result.then(() => {}, () => {});
        return result;
    }
}
