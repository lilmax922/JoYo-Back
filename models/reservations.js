import { Schema, model, ObjectId } from 'mongoose'
// import validator from 'validator'

const schema = new Schema(
  {
    reserver: {
      type: ObjectId,
      ref: 'users',
      required: [true, '缺少預約人']
    },
    date: {
      type: Date,
      default: Date.now, // 當下時間戳記 ; Date.now() 會變成 server 打開的時間導致每個時間都一樣
      required: [true, '缺少預約日期']
    },
    time: {
      type: String,
      enum: ['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'],
      required: [true, '缺少預約時間']
    },
    hour: {
      type: Number,
      default: 1,
      required: [true, '缺少預約時數']
    },
    totalPeople: {
      type: Number,
      default: 1,
      required: [true, '缺少預約人數']
    }
  }, { versionKey: false })

export default model('reservations', schema)
