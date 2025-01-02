import { PGlite } from "@electric-sql/pglite"
import { hstore } from "@electric-sql/pglite/contrib/hstore"
import { lo } from "@electric-sql/pglite/contrib/lo"
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp"
import { vector } from "@electric-sql/pglite/vector"
import { fromFileUrl } from "@std/path"

const db = new PGlite({
  extensions: {
    hstore,
    lo,
    uuid_ossp,
    vector,
  },
})

const schema = await Deno.readTextFile(
  fromFileUrl(import.meta.resolve("./schema.sql")),
)

await db.exec(schema)

const ret = await db.query(`
  SELECT * from todo WHERE id = 1;
`)

console.log(ret.rows)

const ret2 = await db.query(
  "UPDATE todo SET task = $2, done = $3 WHERE id = $1",
  [5, "Update a task using parametrised queries", true],
)

console.log(ret2)
