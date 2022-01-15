import getMembers from '../class/get-members'
import transformDate from '../utils/transform-date'

export default () => {
    try {
        let base = []
        for (let i = 1; i <= 3; i++) {
            for (let j = 1; j <= 15; j++) {
                base.push(...getMembers(transformDate(i), j).details)
            }
        }
        return {
            status: 'ok',
            details: base,
        }
    } catch (e) {
        return {
            status: 'error',
            reason: 'type-error',
            text: new Error(<string>e).message,
        }
    }
}
