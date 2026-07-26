import Signal from "@rbxts/signal"
import { DestroyMethod } from "../utils/TypeWrapper.utils"
import { SortedArray } from "./SortedArray.class"

/**
 * A class that manages a collection of items with associated priorities. 
 * It allows adding and removing items, and automatically keeps track of the item with the highest priority. 
 * When the active item changes, it fires an event to notify listeners.
 * Only one item per priority is allowed. If an item with the same priority is added, an error will be thrown.
 */
export class PriorityHandler<T extends { priority: number }> {
    public readonly onActiveItemChanged: Signal<(newActiveItem: T) => void> = new Signal();
    
    private items: SortedArray<T> = new SortedArray((a, b) => a.priority > b.priority, (a, b) => this.equalityComparator(a, b));
    private activeItem: T | undefined = undefined;
    
    constructor(
        private readonly equalityComparator: (a: T, b: T) => boolean = (a, b) => a.priority === b.priority
    ) {}

    public addItem(item: T): DestroyMethod {
        if (this.items.find((v) => v.priority === item.priority)) {
            error(`An item with priority ${item.priority} already exists in the PriorityHandler. Please use a unique priority for each item.`);
        } 
        this.items.add(item);
        this.updateActiveItem();
        return () => this.removeItem(item);
    }

    public removeItem(item: T): void {
        this.items.remove(item);
        this.updateActiveItem();
    }

    private updateActiveItem() {
        const newActiveItem = this.items.get(this.items.size() - 1);
        if (!this.activeItem || !this.equalityComparator(newActiveItem, this.activeItem)) {
            this.activeItem = newActiveItem;
            this.onActiveItemChanged.Fire(this.activeItem);
        }
    }
}