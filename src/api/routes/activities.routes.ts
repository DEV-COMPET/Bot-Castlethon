import { FastifyInstance } from 'fastify';
import { listActivity } from '../modules/activities/usecases/activity/listActivity/listActivity';
import { getActivityByName } from '../modules/activities/usecases/activity/getActivityByName/getTeamByName';
import { createActivity } from '../modules/activities/usecases/activity/createActivity/createActivity';
import { updateActivity } from '../modules/activities/usecases/activity/updateActivity/updateActivity';
import { deleteActivity } from '../modules/activities/usecases/activity/deleteActivity/deleteActivity';

export async function activitysRoutes(app: FastifyInstance) {
    app.get('/', listActivity)
    app.get('/:name', getActivityByName)
    app.post('/', createActivity)
    app.put("/:nome", updateActivity)
    app.delete("/", deleteActivity)
}