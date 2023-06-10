import { sleep } from 'k6'
import http from 'k6/http'

// See https://k6.io/docs/using-k6/options
export const options = {
  stages: [
    { duration: '1m', target: 2000 },
    // { duration: '3m', target: 5000 },
    // { duration: '1m', target: 10000 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.02'], // http errors should be less than 2%
    http_req_duration: ['p(95)<2000'], // 95% requests should be below 2s
  },
}

export default function main() {
  let getPost = http.get(`http://localhost:8081/api/v1/read/1`)
  sleep(1)
  // let username = Math.random().toString(36).slice(-8)
  // let password = Math.random().toString(36).slice(-8)
  // let response1 = http.post(`http://localhost:8080/users?username=${username}&password=${password}`)
  // sleep(2)
  // let login = http.post(`http://localhost:8080/users/login?username=${username}&password=${password}`)
  // let response2 = http.post(`http://localhost:8080/users/check`)
  // sleep(2)
}
