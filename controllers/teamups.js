import teamups from '../models/teamups.js'

const errorHandler = (error, res) => {
  if (error.name === 'ValidationError') {
    const key = Object.keys(error.errors)[0]
    const message = error.errors[key].message
    res.status(400).json({ success: false, message })
  } else if (error.name === 'MongoServerError' && error.code === 11000) {
    // 代表重複
    res.status(400).json({ success: false, message: '名稱重複' })
  } else {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const createTeamup = async (req, res) => {
  try {
    const result = await teamups.create({
      organizer: req.user._id,
      date: req.body.selectedDate,
      time: req.body.selectedTime,
      hour: req.body.selectedHour,
      currentPeople: req.body.currentPeople,
      totalPeople: req.body.totalPeople,
      cardImage: req.files?.cardImage[0].path || '',
      types: req.body.types,
      title: req.body.title,
      content: req.body.content
    })
    res.status(200).json({ success: true, message: '揪團成功', result })
  } catch (error) {
    errorHandler(error, res)
  }
}

export const getTeamup = async (req, res) => {
  try {
    const result = await teamups.findById(req.params.id).populate('organizer', 'nickname')
    if (!result) {
      res.status(404).json({ success: false, message: '找不到此揪團' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).json({ success: false, message: 'ID 格式錯誤' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const getAllTeamups = async (req, res) => {
  try {
    const result = await teamups.find().populate('organizer', 'nickname phone').populate('participant', 'nickname phone')
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const joinOrCancelTeamup = async (req, res) => {
  try {
    const teamup = await teamups.findById(req.params.id)
    if (!teamup) {
      return res.status(404).json({ success: false, message: '找不到此揪團' })
    }
    if (!teamup.participant.includes(req.user._id)) {
      if (teamup.currentPeople >= teamup.totalPeople) {
        return res.status(400).json({ success: false, message: '揪團人數已滿' })
      }
      if (teamup.participant.includes(req.user._id)) {
        return res.status(400).json({ success: false, message: '您已經參加了該揪團' })
      }
      teamup.participant.push(req.user._id)
      teamup.currentPeople++
      await teamup.save()
      res.status(200).json({ success: true, message: '參加揪團成功', teamup })
    } else {
      teamup.participant.splice(teamup.participant.indexOf(req.user._id), 1)
      teamup.currentPeople--
      await teamup.save()
      res.status(200).json({ success: true, message: '取消參加成功', teamup })
    }
  } catch (error) {
    errorHandler(error, res)
  }
}

export const editTeamup = async (req, res) => {
  try {
    const result = await teamups.findByIdAndUpdate(req.params.id, {
      cardImage: req.files?.cardImage ? req.files?.cardImage[0].path : req.body.cardImage,
      currentPeople: req.body.currentPeople,
      totalPeople: req.body.totalPeople
    }, { new: true }).populate('organizer', 'nickname phone').populate('participant', 'nickname phone')
    if (!result) {
      res.status(404).json({ success: false, message: '找不到此揪團' })
    } else {
      res.status(200).json({ success: true, message: '揪團編輯成功', result })
    }
  } catch (error) {
    errorHandler(error, res)
  }
}

export const getMyTeamup = async (req, res) => {
  try {
    const people = req.query.people || 'organizer'
    let result
    if (people === 'organizer') {
      result = await teamups.find({ organizer: req.user._id })
    } else {
      result = await teamups.find({ participant: req.user._id })
    }
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    errorHandler(error, res)
  }
}

export const deleteTeamup = async (req, res) => {
  try {
    await teamups.findByIdAndDelete(req.params.id)
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    errorHandler(error, res)
  }
}
