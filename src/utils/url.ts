export function setObjToSearchParams(obj: Record<string, any>): string {
  let parameters = ""
  for (const key in obj) {
    parameters += `${key}=${encodeURIComponent(String(obj[key]))}&`
  }
  return parameters.replace(/&$/, "")
}
