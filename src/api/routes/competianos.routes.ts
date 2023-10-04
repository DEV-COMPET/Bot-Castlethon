import { FastifyInstance } from 'fastify';
import { listMember } from '../modules/members/usecases/listMember/listMember';
import { getMemberByEmail } from '../modules/members/usecases/getMemberByEmail/getMemberByEmail';
import { createMember } from '../modules/members/usecases/createMember/createMember';
import { updateMember } from '../modules/members/usecases/updateMember/updateMember';
import { deleteMember } from '../modules/members/usecases/deleteMember/deleteMember';

export async function membersRoutes(app: FastifyInstance) {
    app.get('/', listMember)
    app.get('/:email', getMemberByEmail)
    app.post('/', createMember)
    app.put("/:nome", updateMember)
    app.delete("/", deleteMember)
}