import type { NextFunction, Request, Response } from 'express'
import { HttpError } from './errors.js'
import { authClient } from './supabase.js'

export type AuthContext = {
  token: string
  userId: string
}

// Пускает дальше только запрос с действующим токеном Supabase
export async function requireUser(request: Request, response: Response, next: NextFunction) {
  const header = request.get('authorization')
  if (!header?.startsWith('Bearer ')) {
    return next(new HttpError(401, 'UNAUTHORIZED', 'Требуется вход'))
  }

  const token = header.slice('Bearer '.length).trim()
  if (!token) {
    return next(new HttpError(401, 'UNAUTHORIZED', 'Требуется вход'))
  }

  // Supabase проверяет подпись и срок действия токена
  const { data, error } = await authClient.auth.getUser(token)
  if (error || !data.user) {
    return next(new HttpError(401, 'UNAUTHORIZED', 'Сессия недействительна'))
  }

  const auth: AuthContext = { token, userId: data.user.id }
  response.locals.auth = auth
  next()
}

export function getAuth(response: Response): AuthContext {
  const auth: AuthContext | undefined = response.locals.auth
  if (!auth) {
    throw new HttpError(401, 'UNAUTHORIZED', 'Требуется вход')
  }
  return auth
}
