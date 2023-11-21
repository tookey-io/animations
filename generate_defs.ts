import fs from 'fs/promises'
import path from 'path'

async function readVendor(vendor: string) {
    const root = `./defs/${vendor}`
    const defs = await fs.readdir(root)

    const lines = defs.map((def, index) => {
        const uuid = 'a' + Math.random().toString(32).substring(2)
        return {
            importLine: `import ${uuid} from './${vendor}/${def}';`,
            exportLine: `"${path.parse(def).name}": ${uuid}`
        }
    })

    return lines
}

async function main() {
    const vendors = await fs.readdir('./defs').then((paths) => paths.filter(p => p !== 'index.ts'));
    const allImports: string[] = []
    const allExports: string[] = []
    allExports.push(`export default {`)
    for (const vendor of vendors) {
        allExports.push(`\t"${vendor}": {`)
        const vendorLines = await readVendor(vendor)
        vendorLines.forEach(({ importLine }) => allImports.push(importLine))
        vendorLines.forEach(({ exportLine }) => allExports.push(`\t\t${exportLine},`))
        allExports.push(`\t},`)
    }
    allExports.push(`}`)

    await fs.writeFile('./defs/index.ts', allImports.join('\n') + '\n' + allExports.join('\n'), 'utf-8')
}

main()