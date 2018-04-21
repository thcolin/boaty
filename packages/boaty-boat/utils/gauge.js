export default function gauge(payload) {
  return payload.length === 0 ? [] : payload.reduce(
    (result, object) => result.map((value, index) => Math.max(value, Object.values(object)[index].toString().length)),
    Array(Object.keys(payload[0]).length).fill(0)
  )
}
