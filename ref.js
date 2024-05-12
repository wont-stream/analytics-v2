const fs = require("node:fs/promises")
const path = require("node:path")

const saveDB = async () => {
    const data = await fetch("https://cdn.jsdelivr.net/gh/wont-stream/snowplow-referer-minified/referers-latest.min.json")

    const database = await data.json()

    for (let cat of Object.keys(database)) {
        for (let comp of Object.keys(database[cat])) {
            delete database[cat][comp].parameters
        }
    }

    return await fs.writeFile(path.join(__dirname, "refdb.json"), JSON.stringify(database))
}

const getRef = async (referer) => {
    let database;
    try {
        database = JSON.parse(await fs.readFile(path.join(__dirname, "refdb.json")))
    } catch (e) {
        await saveDB()
        return await getRef(referer);
    }

	try {
		referer = new URL(referer).hostname;

		for (let cat of Object.keys(database)) {
			for (let comp of Object.keys(database[cat])) {
				if (database[cat][comp].domains.includes(referer)) {
					return comp;
				}
			}
		}

		return referer;
	} catch (e) {
        console.log(e)
		return null;
	}
};

module.exports = {
    saveDB,
    getRef
}