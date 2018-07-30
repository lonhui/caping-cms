/**
 * Created by jiachenpan on 16/11/18.
 */

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
    )
  }
}

export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  )
}

/**
 * Deep copy object for compare purpose
 * @param {Object} source Origin Object
 */
export function deepCopy(source) {
  const result = {}
  for (const key in source) {
    result[key] = typeof source[key] === 'object' ? deepCopy(source[key]) : source[key]
  }
  return result
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * 生成图表使用的数据
 * @param {null || {list: Array}} originData 元数据，若不为null，则下面的list是具体的数组
 * @param {Array} categories 时间范围
 * @param {Number} days 分界点
 */
export function toActiveChartsData(originData, categories, days) {
  const dayActive = { oldData: [], newData: [] }
  const dayAdd = { oldData: [], newData: [] }
  const dayRegister = { oldData: [], newData: [] }

  // originData为null表明查询的整个时间段都没有数据，用0补全
  if (originData === null || !originData.list || originData.list.length === 0) {
    for (let i = 0; i < categories.length; i++) {
      if (i < days) {
        dayActive.newData.unshift(0)
        dayAdd.newData.unshift(0)
        dayRegister.newData.unshift(0)
      } else {
        dayActive.oldData.unshift(0)
        dayAdd.oldData.unshift(0)
        dayRegister.oldData.unshift(0)
      }
    }
    return { dayActive, dayAdd, dayRegister }
  } else {
    for (let i = 0; i < categories.length; i++) {
      for (let j = originData.list.length - 1; j >= 0; j--) {
        const item = originData.list[j]
        // debugger
        if (item.date === categories[i]) {
          if (i < days) {
            dayActive.newData[i] = item.active_day
            dayAdd.newData[i] = item.new_count
            dayRegister.newData[i] = item.register_count
            break
          } else {
            dayActive.oldData[i - days] = item.active_day
            dayAdd.oldData[i - days] = item.new_count
            dayRegister.oldData[i - days] = item.register_count
            break
          }
        } else { // 没有数据的天数用0补齐
          if (i < days) {
            dayActive.newData[i] = 0
            dayAdd.newData[i] = 0
            dayRegister.newData[i] = 0
          } else {
            dayActive.oldData[i - days] = 0
            dayAdd.oldData[i - days] = 0
            dayRegister.oldData[i - days] = 0
          }
        }
      }
    }
    return { dayActive, dayAdd, dayRegister }
  }
}

/**
 * @returns {Array} dates ['2018-03-18', '2018-03-19', '2018-03-20', '2018-03-21', '2018-03-22']
 * @param {String} endDate 结束日期（2018-03-22）
 * @param {Number} days 天数（5）
 */
export function toChartsDates(endDate, days) {
  const dates = [endDate]
  for (let i = 1; i < days; i++) {
    dates.unshift(
      parseTime(new Date(new Date(endDate).getTime() - 86400 * 1000 * i), '{y}-{m}-{d}')
    )
  }
  return dates
}
