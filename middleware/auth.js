import passport from 'passport'
import jsonwebtoken from 'jsonwebtoken'

export const login = (req, res, next) => {
  // 使用 login 驗證方式
  // (error, user, info) 對應 done 的三個參數
  // { session: false } 停用 cookie
  passport.authenticate('login', { session: false }, (error, user, info) => {
    if (error || !user) {
      // Post 進來的資料少了 usernameField 或 passwordField 時
      if (info.message === 'Missing credentials') info.message = '欄位錯誤'
      res.status(401).json({ success: false, message: info.message || error.message })
      return
    }
    req.user = user
    next()
  })(req, res, next)
}

export const jwt = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, data, info) => {
    if (error || !data) {
      // 如果 JWT 錯誤
      if (info instanceof jsonwebtoken.JsonWebTokenError) {
        if (info.name === 'TokenExpiredError') {
          return res.status(401).json({ success: false, message: 'JWT 過期' })
        } else {
          return res.status(401).json({ success: false, message: 'JWT 錯誤' })
        }
      } else {
        return res.status(401).json({ success: false, message: info.message || error.message })
      }
    }
    req.user = data.user
    req.token = data.token
    next()
  })(req, res, next)
}
