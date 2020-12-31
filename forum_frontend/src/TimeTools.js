function CalTimeInterval(time_text){
    const now = Date.now()
    const pub_date = Date.parse(time_text)
    const dif = now - pub_date

    const m = 1000*60

    const count_m = Math.floor(dif / m)
    if (count_m < 60){
        return (count_m.toString() + "m")
    }
    else{
        const h = m * 60
        const count_h = Math.floor(dif / h)
        if (count_h < 24){
            return (count_h.toString() + "h")
        }
        else{
            const d = h * 24
            const count_d = Math.floor(dif / d)
            return (count_d.toString() + "d")
        }
    }
}

function ConvertTimeToString(pub_date){
    const date = new Date(pub_date)
    const str_date = date.toLocaleDateString()
    const str_time = date.toLocaleTimeString()
    return (str_date + "\t" + str_time)
}

export {CalTimeInterval, ConvertTimeToString}
