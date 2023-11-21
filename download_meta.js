const path = require('path')
const fs = require('fs/promises')
const url = 'https://cloud.activepieces.com/api/v1/pieces'


async function main() {
    const pieces = await fetch(url).then(r => r.json())

    const names = pieces.map(({ name }) => name)

    for (let name of names) {
        const def = await fetch(`${url}/${name}`).then(r => r.text())
        const parsed = path.parse(name)
        console.log(`where: ${parsed.dir} file: ${parsed.base}`)


        if (!(await fs.lstat('defs/' + parsed.dir).catch(() => false))) {
            console.log('creating dir')
            await fs.mkdir('defs/' + parsed.dir, { recursive: true })
        }

        await fs.writeFile('defs/' + parsed.base + '.json', def)
    }
}

main()