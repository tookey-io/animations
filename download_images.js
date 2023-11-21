const path = require('path')
const fs = require('fs/promises')
const url = 'https://cloud.activepieces.com/api/v1/pieces'


async function main() {
    const pieces = await fetch(url).then(r => r.json())

    console.log(pieces)
    const logos = pieces.map(({ logoUrl }) => logoUrl)

    for (let logo of logos) {
        const { base: filename } = path.parse(logo)
        const blob = await fetch(logo).then(r => r.arrayBuffer())
        await fs.writeFile('public/' + filename, Buffer.from(blob))
    }
}

main()