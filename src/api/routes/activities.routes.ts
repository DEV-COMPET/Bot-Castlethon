import { FastifyInstance } from 'fastify';
import { listActivity } from '../modules/activities/usecases/activity/listActivity/listActivity';
import { getActivityByName } from '../modules/activities/usecases/activity/getActivityByName/getTeamByName';
import { createActivity } from '../modules/activities/usecases/activity/createActivity/createActivity';
import { updateActivity } from '../modules/activities/usecases/activity/updateActivity/updateActivity';
import { deleteActivity } from '../modules/activities/usecases/activity/deleteActivity/deleteActivity';
import { listAnswer } from '../modules/activities/usecases/answer/listTeam/listTeam';
import { getAnswerByName } from '../modules/activities/usecases/answer/getTeamByName/getActivityByName';
import { createAnswer } from '../modules/activities/usecases/answer/createActivity/createAnswer';
import { updateAnswer } from '../modules/activities/usecases/answer/updateTeam/updateTeam';
import { deleteAnswer } from '../modules/activities/usecases/answer/deleteTeam/deleteActivity';
import { openActivity } from '../modules/activities/usecases/activity/openActivity/openActivity';
import { closeActivity } from '../modules/activities/usecases/activity/closeActivity/closeActivity';
import { addActivityMessage } from '../modules/activities/usecases/activity/addActivityMessage/addActivityMessage';

export async function activitysRoutes(app: FastifyInstance) {
    app.get('/', listActivity)
    app.get('/:name', getActivityByName)
    app.post('/', createActivity)
    app.put("/:nome", updateActivity)
    app.put("/open/:name", openActivity)
    app.put("/close/:name", closeActivity)
    app.put("/messages", addActivityMessage)
    app.delete("/", deleteActivity)
}

export async function answersRoutes(app: FastifyInstance) {
    app.get('/', listAnswer)
    app.get('/:name', getAnswerByName)
    app.post('/', createAnswer)
    app.put("/:nome", updateAnswer)
    app.delete("/", deleteAnswer)
}