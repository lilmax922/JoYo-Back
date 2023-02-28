import boardgames from '../models/boardgames.js'

const errorHandler = (error, res) => {
  if (error.name === 'ValidationError') {
    const key = Object.keys(error.errors)[0]
    const message = error.errors[key].message
    res.status(400).json({ success: false, message })
  } else if (error.name === 'MongoServerError' && error.code === 11000) {
    // 代表重複
    res.status(400).json({ success: false, message: '桌遊名稱重複' })
  } else {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const createBoardgame = async (req, res) => {
  try {
    const result = await boardgames.create({
      introduction: req.body.introduction,
      name: req.body.name,
      // 如果沒上傳圖片的話 req.file 會是 undefined，undefined 沒有 .path，所以要 ?.
      cardImage: req.files?.cardImage[0].path || '',
      mainImages: req.files.mainImages.map(file => file.path),
      types: req.body.types,
      players: req.body.players,
      gameTime: req.body.gameTime,
      age: req.body.age,
      ytVideo: req.body.ytVideo,
      componentImages: req.files.componentImages.map(file => file.path),
      componentTexts: req.body.componentTexts,
      setup: req.body.setup,
      gameFlow: req.body.gameFlow,
      endGame: req.body.endGame,
      post: req.body.post
    })
    res.status(200).json({ success: true, message: '桌遊建立成功', result })
  } catch (error) {
    errorHandler(error, res)
  }
}

export const getBoardgame = async (req, res) => {
  try {
    // req.params.id => 路由的 id 參數
    const result = await boardgames.find({ _id: req.params.id, status: 0 })
    if (!result) {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(200).json({ success: true, message: '', result: result[0] })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).json({ success: false, message: 'ID 格式錯誤' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const getAllBoardgames = async (req, res) => {
  try {
    const result = await boardgames.find({ status: 0 })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getPostBoardgames = async (req, res) => {
  try {
    const result = await boardgames.find({ post: true, status: 0 })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const editBoardgame = async (req, res) => {
  try {
    const cardImage = req.files?.cardImage ? req.files?.cardImage[0].path : req.body.cardImage
    const mainImages = []
    const componentImages = []

    if (req.files.mainImages) {
      req.files.mainImages.forEach((item) => {
        mainImages.push(item.path)
      })
    }
    if (req.files.componentImages) {
      req.files.componentImages.forEach((item) => {
        componentImages.push(item.path)
      })
    }

    if (typeof req.body.mainImages === 'string') {
      mainImages.push(req.body.mainImages)
    }
    if (typeof req.body.mainImages === 'object') {
      req.body.mainImages.forEach((item) => {
        if (item !== '' && item !== undefined && item !== null) {
          mainImages.push(item)
        }
      })
    }

    if (typeof req.body.componentImages === 'string') {
      componentImages.push(req.body.componentImages)
    }
    if (typeof req.body.componentImages === 'object') {
      req.body.componentImages.forEach((item) => {
        if (item !== '' && item !== undefined && item !== null) {
          componentImages.push(item)
        }
      })
    }

    const result = await boardgames.findByIdAndUpdate(req.params.id, {
      introduction: req.body.introduction,
      name: req.body.name,
      cardImage,
      mainImages,
      types: req.body.types,
      players: req.body.players,
      gameTime: req.body.gameTime,
      age: req.body.age,
      ytVideo: req.body.ytVideo,
      componentImages,
      componentTexts: req.body.componentTexts,
      setup: req.body.setup,
      gameFlow: req.body.gameFlow,
      endGame: req.body.endGame,
      post: req.body.post
    }, { new: true })

    if (!result) {
      res.status(404).json({ success: false, message: '找不到此桌遊' })
    } else {
      res.status(200).json({ success: true, message: '桌遊編輯成功', result })
    }
  } catch (error) {
    errorHandler(error, res)
  }
}

export const deleteBoardgame = async (req, res) => {
  try {
    await boardgames.findByIdAndUpdate(req.params.id, {
      status: req.body.status
    }, { new: true })
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    errorHandler(error, res)
  }
}
