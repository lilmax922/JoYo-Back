import 'dotenv/config'
import mongoose from 'mongoose'
import express from 'express'
import cors from 'cors'
import './passport/passport.js'
import userRoute from './routes/users.js'
import boardgameRoute from './routes/boardgames.js'
import reservationRoute from './routes/reservations.js'
import teamupRoute from './routes/teamups.js'

mongoose.connect(process.env.DB_URL)
mongoose.set('sanitizeFilter', true) // 塞進 mongoose 的資料有特殊字元時，自動過濾

const app = express()

// 跨域請求
app.use(cors({
  // origin:請求來源
  // callback(錯誤, 是否允許)
  origin (origin, callback) {
    if (origin === undefined || origin.includes('github') || origin.includes('localhost')) {
      callback(null, true)
    } else {
      callback(new Error(), false)
    }
  }
}))
// 處理跨域錯誤
app.use((_, req, res, next) => {
  res.status(403).json({ success: false, message: '請求被拒絕' })
})

app.use(express.json()) // 將傳入的 body 解析為 json
app.use((_, req, res, next) => {
  res.status(400).json({ success: false, message: '格式錯誤' })
})

// routes
app.use('/users', userRoute)
app.use('/boardgames', boardgameRoute)
app.use('/reservations', reservationRoute)
app.use('/teamups', teamupRoute)

// '*' 任意路徑的所有請求
app.all('*', (req, res) => {
  res.status(404).json({ success: false, message: '404 NotFound' })
})

app.listen(process.env.PORT || 4000, () => {
  console.log('伺服器啟動')
})
