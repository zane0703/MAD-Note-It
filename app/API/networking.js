import { fetch as sFetch } from "react-native-ssl-pinning";
let host = "https://localhost"
export default async (path, method, body, callback) => {
    let status
    let option = {
        method,
        sslPinning: {
            certs: ["RootCA"]
        }
    }
    if (method !== "GET") {
        option.body = JSON.stringify(body)
    }
    sFetch(host + path, option)
        .then((res) => {
            status = res.status
            if (res.status === 204) {return null; }
            return res.json()
        })
        .then((data) => {callback(null, data, status) })
        .catch(err => { callback(err, null, null, null) })
}