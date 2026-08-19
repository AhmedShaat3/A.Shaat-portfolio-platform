import { db } from './db/client'; import { sections } from './db/schema'; (async () = await db.update(sections).set({ visible: true }); console.log('? Sections activated'); })(); 
