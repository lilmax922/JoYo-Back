import users from '../models/users.js'
import jwt from 'jsonwebtoken'

const errorHandler = (error, res) => {
  if (error.name === 'ValidationError') {
    const key = Object.keys(error.errors)[0]
    const message = error.errors[key].message
    res.status(400).json({ success: false, message })
  } else if (error.name === 'MongoServerError' && error.code === 11000) {
    // 代表重複
    const key = Object.keys(error.keyPattern)[0]
    switch (key) {
      case 'nickname':
        return res.status(400).json({ success: false, message: '暱稱已被註冊' })
      case 'phone':
        return res.status(400).json({ success: false, message: '手機號碼已被註冊' })
      case 'email':
        return res.status(400).json({ success: false, message: '電子信箱已被註冊' })
    }
  } else {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 註冊
export const register = async (req, res) => {
  try {
    await users.create({
      nickname: req.body.nickname,
      phone: req.body.phone,
      password: req.body.password,
      email: req.body.email
    })
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    errorHandler(error, res)
  }
}

// 登入
export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens.push(token)
    await req.user.save()
    res.status(200).json({
      success: true,
      message: '登入成功',
      result: {
        token,
        email: req.user.email,
        phone: req.user.phone,
        nickname: req.user.nickname,
        role: req.user.role,
        avatar: req.user.avatar,
        _id: req.user._id
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 登出
export const logout = async (req, res) => {
  try {
    // 把目前請求的 JWT 從資料庫拿掉
    req.user.tokens = req.user.tokens.filter((token) => token !== req.token)
    await req.user.save()
    res.status(200).json({ success: true, message: '登出成功' })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 過期 JWT 換新 JWT
export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex((token) => token === req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(200).json({ success: true, message: 'JWT 更新成功', result: token })
  } catch (error) {
    res.status(500).json({ success: true, message: '未知錯誤' })
  }
}

// 取自己的資料
export const getMyself = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: '使用者資料取得成功',
      result: {
        email: req.user.email,
        phone: req.user.phone,
        nickname: req.user.nickname,
        role: req.user.role,
        avatar: req.user.avatar,
        _id: req.user._id
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 修改自己的資料
export const editMyself = async (req, res) => {
  try {
    req.user.phone = req.body.phone
    req.user.nickname = req.body.nickname
    req.user.password = req.body.password
    const result = req.user.save()
    res.status(200).json({
      success: true,
      result: {
        phone: result.phone,
        nickname: result.nickname
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getAllUser = async (req, res) => {
  try {
    const result = await users.find({ status: 0 }).select('-password')
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const editUser = async (req, res) => {
  try {
    const result = await users.findById(req.body._id)
    result.email = req.body.email || result.email
    result.phone = req.body.phone || result.phone
    result.nickname = req.body.nickname || result.nickname
    result.password = req.body.password || result.password
    await result.save()
    res.status(200).json({
      success: true,
      result: {
        email: result.email,
        phone: result.phone,
        nickname: result.nickname
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const deleteUser = async (req, res) => {
  try {
    await users.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    errorHandler(error, res)
  }
}
