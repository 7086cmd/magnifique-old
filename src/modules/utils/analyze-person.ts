export default (numb: number) => {
    return {
        gradeid: Math.floor(numb / 10000),
        classid: Math.floor((numb % 10000) / 100),
        number: Math.floor(numb % 100),
    }
}
