function getCsrfToken() {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('csrftoken='))
    ?.split('=')[1]
}

function makeRequestHelper(method) {
  return async (url, body) => {
    const requestOptions = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
    }
    if (method === 'POST') {
      requestOptions.headers['X-CSRFToken'] = getCsrfToken()
    }
    if (body) {
      requestOptions['body'] = JSON.stringify(body)
    }

    const apiResponse = await fetch(url, requestOptions)
    return handleResponse(apiResponse)
  }
}

function handleResponse(apiResponse) {
  return apiResponse.text().then((text) => {
    const data = text && JSON.parse(text)

    if (!apiResponse.ok) {
      const error = (data && data.message) || apiResponse.statusText
      return Promise.reject(error)
    }

    return data
  })
}

export const makeRequest = {
  get: makeRequestHelper('GET'),
  post: makeRequestHelper('POST'),
}
