import express, { Request, Response } from 'express'
import cors from 'cors'
import {PrismaClient} from '@prisma/client'
import { convertHourToMinutes } from './utils/convert-hour-to-minutes'
import {convertMinutesToHours} from './utils/convert-minutes-to-hours'

const app = express()

app.use(express.json())
app.use(cors())

const prisma = new PrismaClient()

app.get('/games', async (req: Request, res: Response) => {

    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true
                }
            }
        }
    })

    return res.json(games)
})

app.post('/games/:id/ads', async (req: Request, res: Response) => {
    const {id} = req.params

    const body = req.body

    const ad = await prisma.ad.create({
        data: {
            gameId: id,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: convertHourToMinutes(body.hourStart),
            hourEnd: convertHourToMinutes(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel
        }
    })

    return res.status(201).json(ad)
})

app.get('/games/:id/ads', async (req: Request, res: Response) => {

    const {id} = req.params

    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true
        },
        where: {
            gameId: id
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return res.json(ads.map(ad => {
        return {
            ...ad,
            weekDays: ad.weekDays.split(','),
            hourStart: convertMinutesToHours(ad.hourStart),
            hourEnd: convertMinutesToHours(ad.hourEnd)
        }
    }))
})


app.get('/ads/:id/discord', async (req: Request, res: Response) => {

    const {id} = req.params

    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true
        },
        where: {
            id
        }
    })
    
    return res.json({
        discord: ad.discord
    })
})

app.listen(3333)
