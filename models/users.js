import { Schema, model, Error } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

const schema = new Schema(
  {
    email: {
      type: String,
      required: [true, '缺少電子信箱'],
      unique: true,
      default: '',
      validate: {
        validator (email) {
          return validator.isEmail(email)
        },
        message: '電子信箱格式錯誤'
      }
    },
    phone: {
      type: String,
      required: [true, '缺少手機號碼'],
      unique: true,
      trim: true,
      validate: {
        // 驗證的 function
        validator (phone) {
          return validator.isMobilePhone(phone, 'zh-TW')
        },
        // 錯誤訊息
        message: '手機號碼格式錯誤'
      }
    },
    nickname: {
      type: String,
      required: [true, '缺少暱稱'],
      unique: true,
      default: ''
    },
    password: {
      type: String,
      required: true,
      default: ''
    },
    tokens: {
      type: [String],
      default: []
    },
    avatar: {
      type: String
    },
    role: {
      type: Number,
      // 0 = 使用者
      // 1 = 管理員
      default: 0
    },
    status: {
      type: Number,
      // 1 = 刪除
      default: 0
    }
  }, { versionKey: false }) // 不要紀錄修改次數

schema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length >= 4 && user.password.length <= 12) {
      user.password = bcrypt.hashSync(user.password, 10)
    } else {
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼長度錯誤' }))
      next(error)
      return
    }
  }
  next()
})

schema.pre('findOneAndUpdate', function (next) {
  const user = this._update // 更新的資料
  if (user.password) {
    if (user.password.length >= 4 && user.password.length <= 12) {
      // 密碼加鹽 10 次
      user.password = bcrypt.hashSync(user.password, 10)
    } else {
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼長度錯誤' }))
      next(error)
      return
    }
  }
  next()
})

export default model('users', schema)
