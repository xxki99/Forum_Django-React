function GetNowInUTC(date) {
    var utc = new Date(date.getTime() + date.getTimezoneOffset() * 60000)
    return utc
}

function CalTimeInterval(time_text) {
    if (time_text === "") {
        return ""
    }
    console.log(time_text)
    const now = new Date()
    const now_utc = GetNowInUTC(now)
    const pub_date = new Date(Date.parse(time_text))
    const pub_utc = GetNowInUTC(pub_date)
    const dif = now_utc - pub_utc

    const m = 1000 * 60

    const count_m = Math.floor(dif / m)
    if (count_m < 60) {
        return (count_m.toString() + "m")
    }
    else {
        const h = m * 60
        const count_h = Math.floor(dif / h)
        if (count_h < 24) {
            return (count_h.toString() + "h")
        }
        else {
            const d = h * 24
            const count_d = Math.floor(dif / d)
            return (count_d.toString() + "d")
        }
    }
}

function ConvertTimeToString(pub_date) {
    const date = new Date(pub_date)
    const str_date = date.toLocaleDateString()
    const str_time = date.toLocaleTimeString()
    return (str_date + "\t" + str_time)
}

export { CalTimeInterval, ConvertTimeToString }
