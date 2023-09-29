import { WatchedList } from '@/core/entities/watched-list'

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b
  }
}

describe('WatchedList', () => {
  it('should be able to create a watched list with initial items', () => {
    const list = new NumberWatchedList([1, 2, 3])

    expect(list.getItems()).toEqual([1, 2, 3])
  })

  it('should be able to add an item to the list', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.add(4)

    expect(list.getNewItems()).toEqual([4])
    expect(list.getItems()).toHaveLength(4)
    expect(list.getItems()).toEqual([1, 2, 3, 4])
  })

  it('should be able to add items to the list more than once', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.add(4)
    list.add(5)

    expect(list.getNewItems()).toEqual([4, 5])
    expect(list.getItems()).toHaveLength(5)
    expect(list.getItems()).toEqual([1, 2, 3, 4, 5])
  })

  it('should be able to remove an item from the list', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.remove(2)

    expect(list.getRemovedItems()).toEqual([2])
    expect(list.getItems()).toHaveLength(2)
    expect(list.getItems()).toEqual([1, 3])
  })

  it('should be able to remove items from the list more than once', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.remove(2)
    list.remove(3)

    expect(list.getRemovedItems()).toEqual([2, 3])
    expect(list.getItems()).toHaveLength(1)
    expect(list.getItems()).toEqual([1])
  })

  it('should be able to add and remove items from the list', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.add(4)
    list.remove(2)

    expect(list.getNewItems()).toEqual([4])
    expect(list.getRemovedItems()).toEqual([2])
    expect(list.getItems()).toHaveLength(3)
    expect(list.getItems()).toEqual([1, 3, 4])
  })

  it('should be able to add an item even if it was removed before', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.remove(2)
    list.add(2)

    expect(list.getNewItems()).toEqual([])
    expect(list.getRemovedItems()).toEqual([])
    expect(list.getItems()).toHaveLength(3)
  })

  it('should be able to remove an item even if it was added before', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.add(4)
    list.remove(4)

    expect(list.getNewItems()).toEqual([])
    expect(list.getRemovedItems()).toEqual([])
    expect(list.getItems()).toHaveLength(3)
    expect(list.getItems()).toEqual([1, 2, 3])
  })

  it('should be able to add an item even if it was removed before and its item must be added to the end of the list', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.remove(2)
    list.add(2)

    expect(list.getNewItems()).toEqual([])
    expect(list.getRemovedItems()).toEqual([])
    expect(list.getItems()).toHaveLength(3)
    expect(list.getItems()).toEqual([1, 3, 2])
  })

  it('should be able to update watched list items', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.update([1, 3, 5])

    expect(list.getNewItems()).toEqual([5])
    expect(list.getRemovedItems()).toEqual([2])
    expect(list.getItems()).toHaveLength(3)
    expect(list.getItems()).toEqual([1, 3, 5])
  })

  it('should be able to add an item without duplicates when it already exists', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.add(1)
    list.add(2)

    expect(list.getItems()).toEqual([1, 2, 3])
  })

  it('should be able to keep the original items when trying to remove a non-existent item', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.remove(4)

    expect(list.getItems()).toEqual([1, 2, 3])
  })
})
