export default (configuration: {
    name: string
    number: number
    in: 'xue-xi' | 'qing-zhi' | 'zu-zhi' | 'xuan-chuan' | 'wen-ti' | 'ji-jian' | 'chair-man'
    type: 'zhu-xi' | 'fu-zhu-xi' | 'bu-zhang' | 'fu-bu-zhang' | 'gan-shi'
    vadmin: 'qing-ti' | 'xue-jian' | 'tuan-zong-zhi' | 'bu-zhang' | 'other'
    record: {
        actions: number
        score: number
        violation: number
    }
    workflows: object
    password: string
}) => {
    const groups = {
        'xue-xi': '学习部',
        'qing-zhi': '青志部',
        'zu-zhi': '组织部',
        'xuan-chuan': '宣传部',
        'wen-ti': '文体部',
        'ji-jian': '纪检部',
        'chair-man': '主席团',
    }
    const admins = {
        'qing-ti': '副主席（青体）',
        'xue-jian': '副主席（学检）',
        'tuan-zong-zhi': '团总支副秘书',
    }
    const types = {
        'zhu-xi': '主席',
        'fu-zhu-xi': '副主席',
        'bu-zhang': '部长',
        'fu-bu-zhang': '副部长',
        'gan-shi': '干事',
    }
    let base = {
        name: configuration.name,
        number: configuration.number,
        in: groups[configuration.in],
        do: '',
        icg: false,
        record: configuration.record,
    }
    if (configuration.type == 'zhu-xi') {
        base.do = types[configuration.type]
        base.icg = true
    } else if (configuration.type == 'fu-zhu-xi') {
        base.do = admins[configuration.vadmin]
        base.icg = true
    } else if (configuration.type == 'bu-zhang') {
        base.do = groups[configuration.in] + types[configuration.type]
        base.icg = true
    } else if (configuration.type == 'fu-bu-zhang') {
        base.do = groups[configuration.in] + types[configuration.type]
        base.icg = false
    } else {
        base.do = groups[configuration.in] + types[configuration.type]
        base.icg = false
    }
    return base
}
