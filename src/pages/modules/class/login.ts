import axios from 'axios'
import baseurl from '../baseurl'
const login = async (gradeid: number, classid: number, passwordEncoded: string) => {
    const reqUrl = baseurl + `class/${gradeid}/${classid}/login?password=${passwordEncoded}`
    await axios({
        url: reqUrl,
        data: {
            password: passwordEncoded,
        },
        method: 'get',
    }).then((response) => {
        // eslint-disable-next-line no-console
        console.log(response.data)
        return response.data
    })
}
export default login
