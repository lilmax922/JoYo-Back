import passport from 'passport'
import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'
import bcrypt from 'bcrypt'
import users from '../models/users.js'

// 使用 Local 策略寫 login 方式
const LocalStrategy = passportLocal.Strategy
passport.use('login', new LocalStrategy({
  // 修改 ; 預設帳密欄位是 username 和 password
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  // done(錯誤, 傳到下一步的資料, 傳到下一步 info 的內容)
  try {
    const user = await users.findOne({ email }) // 找使用者電子信箱
    if (!user) {
      return done(null, false, { message: '信箱不存在' })
    }
    // 比較使用者密碼跟加密後的密碼是否相同
    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: '密碼錯誤' })
    }
    return done(null, user)
  } catch (error) {
    return done(error, false)
  }
}))

// 使用 JWT 策略寫 jwt 方式
const JWTStrategy = passportJWT.Strategy
const ExtractJwt = passportJWT.ExtractJwt
passport.use('jwt', new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true
}, async (req, payload, done) => {
  const token = req.headers.authorization.split(' ')[1] // authorization 的 value 有空格 要抓空格後的東西
  try {
    const user = await users.findOne({ _id: payload._id, tokens: token })
    if (!user) {
      return done(null, false, { message: '使用者不存在 | JWT 驗證失敗' })
    }
    return done(null, { user, token })
  } catch (error) {
    return done(error, false)
  }
}))
