import event from '../models/event.js'

export const createEvent = async (req, res) => {
  try {
    await event.create({
      participant: req.user._id,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      price: req.body.price
    })
    res.status(200).json({ success: true, message: 'Event 建立成功' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).json({ success: false, message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).json({ success: false, message: '報名者重複報名' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}
