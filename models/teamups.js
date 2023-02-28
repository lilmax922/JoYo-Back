import { Schema, model, ObjectId } from 'mongoose'
// import _ from 'lodash'

const schema = new Schema(
  {
    organizer: {
      type: ObjectId,
      ref: 'users',
      required: [true, '缺少揪團發起人']
    },
    participant: {
      type: [ObjectId],
      ref: 'users',
      required: [true, '缺少組隊參加人']
    },
    date: {
      type: Date,
      default: Date.now,
      required: [true, '缺少揪團日期']
    },
    time: {
      type: String,
      enum: ['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'],
      required: [true, '缺少揪團時間']
    },
    hour: {
      type: Number,
      default: 1,
      required: [true, '缺少預約時數']
    },
    currentPeople: {
      type: Number,
      required: [true, '缺少目前人數']
    },
    totalPeople: {
      type: Number,
      required: [true, '缺少總人數']
    },
    cardImage: {
      type: String,
      required: [true, '缺少主要遊玩類型圖片']
    },
    types: {
      type: [String],
      enum: {
        values: ['派對', '陣營', '策略', '心機', '卡牌', '兒童', '家庭', '抽象'],
        message: '桌遊類型錯誤'
      },
      // validate: {
      //   validator () {
      //     return _.intersection(this.type, this.interesting).length === 0
      //   },
      //   message: '錯誤'
      // },
      default: []
    },
    title: {
      type: String,
      required: [true, '缺少揪團標題'],
      maxLength: [30, '標題最多 30 個字'],
      minLength: [1, '標題最少 1 個字']
    },
    content: {
      type: String,
      required: [true, '缺少揪團內容'],
      minLength: [1, '內容最少 1 個字']
    }
  }, { versionKey: false })

export default model('teamups', schema)
