import { Schema, model } from 'mongoose'

const schema = new Schema(
  {
    introduction: {
      type: String,
      required: [true, '缺少桌遊介紹']
    },
    name: {
      type: String,
      required: [true, '缺少桌遊名稱'],
      unique: true
    },
    cardImage: {
      type: String,
      required: [true, '缺少桌遊卡片主圖']
    },
    mainImages: {
      type: [String],
      required: [true, '缺少桌遊主圖'],
      default: []
    },
    types: {
      type: [String],
      required: [true, '缺少桌遊類型'],
      enum: {
        values: ['派對', '陣營', '策略', '心機', '卡牌', '兒童', '家庭', '抽象'],
        message: '桌遊類型錯誤'
      },
      default: []
    },
    players: {
      type: String,
      required: [true, '缺少遊玩人數']
    },
    gameTime: {
      type: Number,
      required: [true, '缺少遊戲時間']
    },
    age: {
      type: Number,
      required: [true, '缺少適合年齡']
    },
    ytVideo: {
      type: String
    },
    componentImages: {
      type: [String],
      required: [true, '缺少內容物圖片']
    },
    componentTexts: {
      type: String,
      required: [true, '缺少內容物說明']
    },
    setup: {
      type: String,
      required: [true, '缺少遊戲設置']
    },
    gameFlow: {
      type: String,
      required: [true, '缺少遊戲流程']
    },
    endGame: {
      type: String,
      required: [true, '缺少遊戲結束說明']
    },
    post: {
      type: Boolean,
      required: [true, '缺少張貼狀態']
    },
    // 0 : 未刪除
    // 1 : 刪除
    status: {
      type: Number,
      default: 0
    }
  }, { versionKey: false })

export default model('boardgames', schema)
