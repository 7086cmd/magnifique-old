import baseurl from '../../../modules/baseurl'
import { PostFetch } from './env'

const createPostConfig = (fetcherInput: fetcherOptions): PostFetch.postFetcherConfig => {
  if (fetcherInput.type === 'admin') {
    return {
      type: 'admin',
      getter: true,
      deleter: true,
      creater: false,
      downloader: true,
      uploader: false,
      url: baseurl + 'admin/post',
      standardConfig: fetcherInput,
    }
  } else if (fetcherInput.type === 'member_admin') {
    return {
      type: 'member_admin',
      getter: true,
      deleter: true,
      creater: false,
      downloader: true,
      url: baseurl + 'member/admin/post',
      uploader: false,
      standardConfig: fetcherInput,
    }
  } else if (fetcherInput.type === 'member') {
    return {
      type: 'member',
      getter: true,
      deleter: true,
      creater: true,
      uploader: true,
      downloader: true,
      url: baseurl + 'member/post',
      standardConfig: fetcherInput,
      name: fetcherInput.name,
    }
  } else {
    return {
      type: 'class',
      getter: true,
      deleter: false,
      creater: false,
      uploader: false,
      downloader: false,
      url: baseurl + 'class/post',
      standardConfig: fetcherInput,
    }
  }
}

export { createPostConfig }
