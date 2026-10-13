const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

type ApiErrorBody = {
  message?: string
  fields?: Record<string, string>
}

// Ошибка своего Node API: статус, сообщение и ошибки отдельных полей
export class ApiError extends Error {
  status: number
  fields: Record<string, string>

  constructor(status: number, body: ApiErrorBody | undefined) {
    super(getMessage(status, body))
    this.status = status
    this.fields = body?.fields ?? {}
  }
}

function getMessage(status: number, body: ApiErrorBody | undefined): string {
  if (status === 401) {
    return 'Сессия истекла или недействительна. Выйдите и войдите снова.'
  }

  const fieldMessages = Object.values(body?.fields ?? {})
  if (fieldMessages.length > 0) {
    return fieldMessages.join('; ')
  }
  return body?.message ?? `Ошибка API: ${status}`
}

// Запрос к своему Node API с токеном текущей сессии
export async function apiFetch<T>(
  path: string,
  accessToken: string,
  init: RequestInit = {},
): Promise<T> {
  if (!apiBaseUrl) {
    throw new Error('Не настроена переменная VITE_API_BASE_URL в .env.local')
  }

  let response: Response
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        ...init.headers,
      },
    })
  } catch {
    throw new Error('API недоступен. Проверьте, что backend запущен.')
  }

  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(response.status, payload?.error)
  }
  return payload.data as T
}
