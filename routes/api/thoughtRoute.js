const router = require('express').Router()
const {
    getAllThoughts,
    getThoughtById,
    postThought,
    postReaction,
    deleteThought,
    deleteReaction
} = require('../../controllers/thought-controller')

router.route('/').get(getAllThoughts)

router.route('/:userId').post(postThought)

router
  .route('/:userId/:thoughtId')
  .get(getThoughtById)
  .put(postReaction)
  .delete(deleteThought)

router.route('/:userId/:thoughtId/:reactionId/').delete(deleteReaction)

module.exports = router