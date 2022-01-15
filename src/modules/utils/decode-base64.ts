const decodeBase64 = (content: string) => {
    return Buffer.from(content, 'base64').toString()
}
export default decodeBase64
