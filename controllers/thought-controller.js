const { Thought, User } = require('../models');

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
    .populate({
      path: 'reactions',
      select: '-__v'
    })
    .select('-__v')
    .sort({ _id: -1 })
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })
},

getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
    .populate({
      path: 'reactions',
      select: '-__v'
    })
    .select('-__v')
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })
},

  postThought({ params, body }, res) {
    console.log(params);
    Thought.create(body)
      .then(({ _id }) => {
        return Thought.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        )
      })
      .then(dbUserData => {
        console.log(dbUserData)
        if (!dbUserData) {
          res.status(404).json({ message: 'No user was found with this id!' })
          return
        }
        res.json(dbUserData)
      })
      .catch(err => res.json(err))
  },

  postReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { thoughts: body }},
      { new: true, runValidators: true }
    )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought was found with this id!' })
          return
        }
        res.json(dbThoughtData)
      })
      .catch(err => res.json(err))
  },

  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then(deletedThought=> {
        if (!deletedThought) {
          return res.status(404).json({ message: 'No thought was found with this id!' })
        }
        return Thought.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        )
      })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought was found with this id!' })
          return
        }
        res.json(dbThoughtData)
      })
      .catch(err => res.json(err))
  },

  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } }},
      { new: true }
    )
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err))
  }
}

module.exports = thoughtController
