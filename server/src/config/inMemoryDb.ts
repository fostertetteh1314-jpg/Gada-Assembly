type Id = string;

interface BaseDoc {
  _id: Id;
  createdAt: Date;
  updatedAt: Date;
}

type Collection<T extends BaseDoc> = {
  data: Map<Id, T>;
  nextId: number;
};

function createCollection<T extends BaseDoc>(initial: T[] = []): Collection<T> {
  const data = new Map<Id, T>();
  let nextId = 1;
  for (const item of initial) {
    data.set(item._id, item);
    nextId = Math.max(nextId, parseInt(item._id, 10) + 1);
  }
  return { data, nextId };
}

function genId(col: Collection<any>): Id {
  return String(col.nextId++);
}

const collections: Record<string, Collection<any>> = {};

export function getCollection<T extends BaseDoc>(name: string, initial: T[] = []): Collection<T> {
  if (!collections[name]) {
    collections[name] = createCollection(initial);
  }
  return collections[name] as Collection<T>;
}

export function resetDb() {
  for (const key in collections) {
    collections[key].data.clear();
    collections[key].nextId = 1;
  }
}
