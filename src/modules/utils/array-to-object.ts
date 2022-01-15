const arrayToObject = (insert: string, content: object) => {
    // eslint-disable-next-line prefer-const
    let base = {}
    for (let i = 0; i in content; i++) {
        const key = content[i][insert]
        base[key] = content[i]
        delete base[key][insert]
    }
    return base
}
export default arrayToObject
