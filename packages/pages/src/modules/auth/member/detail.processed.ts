import axios from 'axios'
import baseurl from '../../baseurl'
export default async (number: number) => {
  return (await axios(`${baseurl}member/getinfo/${number}`)).data.details as member_processed
}
