import { Router, Request, Response } from 'express'

const router = Router()

// @route GET /auth
// @desc Authenticate a user
// @access PUBLIC

router.get('/', (req: Request, res: Response) => {
  res.sendStatus(200)
})

export default router