/**
 * Keep an array sorted. Cost more to add an item, but guarantees that the array is always sorted.
 */
export class SortedArray<T extends defined> {
    private items: T[] = [];

    constructor(
        private readonly comparator: (a: T, b: T) => boolean,
        private readonly equalityComparator: (a: T, b: T) => boolean,
    ) {}

    public add(item: T): void {
        const index = this.findInsertIndex(item);
        this.items.insert(index, item);
    }

    public remove(item: T): void {
        const index = this.indexOf(item);
        if (index !== -1) {
            this.items.remove(index);
        }
    }

    public size = () => this.items.size();
    public get = (index: number) => this.items[index];
    public find = (predicate: (item: T) => boolean) => this.items.find((v) => predicate(v));

    public indexOf(item: T): number {
        let low = 0;
        let high = this.items.size() - 1;

        while (low <= high) {
            const mid = math.floor((low + high) / 2);
            const midItem = this.items[mid];

            if (this.equalityComparator(midItem, item)) {
                return mid;
            }
            if (this.comparator(midItem, item)) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        return -1;
    }

    private findInsertIndex(item: T): number {
        let low = 0;
        let high = this.items.size();

        while (low < high) {
            const mid = math.floor((low + high) / 2);
            if (this.comparator(this.items[mid], item)) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }

        return low;
    }
}